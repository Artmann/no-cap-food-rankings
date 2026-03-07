import { count, gt } from 'drizzle-orm'

import { db } from '@/db'
import { votes } from '@/db/schema'
import { countries } from '@/lib/countries'

const bayesianPrior = 2

export interface CountryRanking {
  countryId: string
  dishes: { emoji: string; name: string }[]
  emoji: string
  losses: number
  name: string
  rank: number
  score: number
  totalMatchups: number
  trend: 'down' | 'neutral' | 'up'
  wins: number
}

export function computeScore(wins: number, total: number): number {
  return (wins + bayesianPrior) / (total + bayesianPrior * 2)
}

export function computeTrend(
  allTimeScore: number,
  recentScore: number
): 'down' | 'neutral' | 'up' {
  const difference = recentScore - allTimeScore

  if (difference > 0.05) return 'up'
  if (difference < -0.05) return 'down'

  return 'neutral'
}

export function buildRankings(
  winsMap: Map<string, number>,
  lossesMap: Map<string, number>,
  recentWinsMap: Map<string, number>,
  recentLossesMap: Map<string, number>
): CountryRanking[] {
  const rankings = countries.map((country) => {
    const wins = winsMap.get(country.id) ?? 0
    const losses = lossesMap.get(country.id) ?? 0
    const total = wins + losses
    const allTimeScore = computeScore(wins, total)

    const recentWins = recentWinsMap.get(country.id) ?? 0
    const recentLosses = recentLossesMap.get(country.id) ?? 0
    const recentTotal = recentWins + recentLosses
    const recentScore = computeScore(recentWins, recentTotal)

    return {
      countryId: country.id,
      dishes: country.dishes,
      emoji: country.emoji,
      losses,
      name: country.name,
      rank: 0,
      score: allTimeScore,
      totalMatchups: total,
      trend: computeTrend(allTimeScore, recentScore),
      wins
    }
  })

  rankings.sort((a, b) => b.score - a.score)

  for (let i = 0; i < rankings.length; i++) {
    rankings[i].rank = i + 1
  }

  return rankings
}

async function queryCountsByCountry(
  column: 'preferredCountryId' | 'nonPreferredCountryId',
  since?: Date
): Promise<Map<string, number>> {
  const field =
    column === 'preferredCountryId'
      ? votes.preferredCountryId
      : votes.nonPreferredCountryId

  const conditions = since ? gt(votes.createdAt, since) : undefined

  const rows = await db
    .select({
      countryId: field,
      total: count()
    })
    .from(votes)
    .where(conditions)
    .groupBy(field)

  return new Map(rows.map((row) => [row.countryId, row.total]))
}

export async function getRankings(): Promise<CountryRanking[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [winsMap, lossesMap, recentWinsMap, recentLossesMap] =
    await Promise.all([
      queryCountsByCountry('preferredCountryId'),
      queryCountsByCountry('nonPreferredCountryId'),
      queryCountsByCountry('preferredCountryId', since),
      queryCountsByCountry('nonPreferredCountryId', since)
    ])

  return buildRankings(winsMap, lossesMap, recentWinsMap, recentLossesMap)
}
