import { desc } from 'drizzle-orm'

import { database } from '@/db'
import { contryRankings } from '@/db/schema'
import { countries } from '@/lib/countries'

export interface CountryRanking {
  countryId: string
  dishes: { emoji: string; name: string }[]
  eloRating: number
  emoji: string
  name: string
  rank: number
  trend: 'down' | 'neutral' | 'up'
}

export function computeTrendFromEloChange(
  eloChange: number
): 'down' | 'neutral' | 'up' {
  if (eloChange > 50) return 'up'
  if (eloChange < -50) return 'down'

  return 'neutral'
}

export async function getRankings(): Promise<CountryRanking[]> {
  const rows = await database
    .select({
      countryId: contryRankings.countryId,
      eloChange: contryRankings.eloChange,
      eloRating: contryRankings.eloRating
    })
    .from(contryRankings)
    .orderBy(desc(contryRankings.eloRating))

  const eloMap = new Map(rows.map((row) => [row.countryId, row]))

  const rankings = countries.map((country) => {
    const row = eloMap.get(country.id)

    return {
      countryId: country.id,
      dishes: country.dishes,
      eloRating: row?.eloRating ?? 1500,
      emoji: country.emoji,
      name: country.name,
      rank: 0,
      trend: computeTrendFromEloChange(row?.eloChange ?? 0)
    }
  })

  rankings.sort((a, b) => b.eloRating - a.eloRating)

  for (let i = 0; i < rankings.length; i++) {
    rankings[i].rank = i + 1
  }

  return rankings
}
