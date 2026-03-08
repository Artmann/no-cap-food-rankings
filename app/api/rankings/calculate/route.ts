import { asc, gt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sum } from 'radash'
import invariant from 'tiny-invariant'

import { database } from '@/db'
import { contryRankings, votes } from '@/db/schema'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('key')

  if (!apiKey || apiKey !== process.env.RANKINGS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ratings = new Map<string, number>()
  const eloChanges = new Map<string, number[]>()
  let voteCount = 0

  for await (const row of stepThroughVotes()) {
    voteCount++
    const winnerId = row.preferredCountryId
    const looserId = row.nonPreferredCountryId

    if (!ratings.has(winnerId)) {
      ratings.set(winnerId, 1500)
    }

    if (!ratings.has(looserId)) {
      ratings.set(looserId, 1500)
    }

    const winnerRating = ratings.get(winnerId)
    const looserRating = ratings.get(looserId)

    invariant(
      winnerRating !== undefined,
      `Winner rating for country ${winnerId} is undefined`
    )
    invariant(
      looserRating !== undefined,
      `Looser rating for country ${looserId} is undefined`
    )

    const expectedWinnerScore =
      1 / (1 + 10 ** ((looserRating - winnerRating) / 400))
    const expectedLooserScore = 1 - expectedWinnerScore

    const k = 32

    const winnerEloChange = k * (1 - expectedWinnerScore)
    const looserEloChange = k * (0 - expectedLooserScore)

    ratings.set(winnerId, winnerRating + winnerEloChange)
    ratings.set(looserId, looserRating + looserEloChange)

    if (!eloChanges.has(winnerId)) {
      eloChanges.set(winnerId, [])
    }

    if (!eloChanges.has(looserId)) {
      eloChanges.set(looserId, [])
    }

    const winnerChanges = eloChanges.get(winnerId)
    const looserChanges = eloChanges.get(looserId)

    invariant(
      winnerChanges !== undefined,
      `Elo changes for winner ${winnerId} is undefined`
    )
    invariant(
      looserChanges !== undefined,
      `Elo changes for looser ${looserId} is undefined`
    )

    winnerChanges.push(winnerEloChange)
    looserChanges.push(looserEloChange)

    // Limit the number of Elo changes stored for each country to 50
    if (winnerChanges.length > 50) {
      winnerChanges.shift()
    }

    if (looserChanges.length > 50) {
      looserChanges.shift()
    }
  }

  await updateCountryRankings(ratings, eloChanges)

  return NextResponse.json({
    eloChanges: Object.fromEntries(eloChanges),
    ratings: Object.fromEntries(ratings),
    success: true,
    voteCount
  })
}

async function updateCountryRankings(
  ratings: Map<string, number>,
  eloChanges: Map<string, number[]>
) {
  const now = new Date()

  for (const [countryId, rating] of ratings.entries()) {
    const changes = eloChanges.get(countryId) ?? []
    const totalEloChange = sum(changes)

    await database
      .insert(contryRankings)
      .values({
        countryId,
        eloRating: Math.round(rating),
        eloChange: Math.round(totalEloChange),
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: contryRankings.countryId,
        set: {
          eloRating: Math.round(rating),
          eloChange: Math.round(totalEloChange),
          updatedAt: now
        }
      })
  }
}

async function* stepThroughVotes(pageSize = 100) {
  let lastId: string | undefined = undefined

  while (true) {
    const rows = await database
      .select()
      .from(votes)
      .where(lastId ? gt(votes.id, lastId) : undefined)
      .orderBy(asc(votes.createdAt))
      .limit(pageSize)

    yield* rows

    if (rows.length < pageSize) {
      return
    }

    lastId = rows.at(-1)?.id
  }
}
