import { describe, expect, it, vi } from 'vitest'

import { countries } from '@/lib/countries'

import { computeTrendFromEloChange } from './rankings'

vi.mock('@/db', () => ({
  database: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue([])
      })
    })
  }
}))

describe('computeTrendFromEloChange', () => {
  it('returns up when eloChange is greater than 50', () => {
    expect(computeTrendFromEloChange(51)).toEqual('up')
    expect(computeTrendFromEloChange(100)).toEqual('up')
  })

  it('returns down when eloChange is less than -50', () => {
    expect(computeTrendFromEloChange(-51)).toEqual('down')
    expect(computeTrendFromEloChange(-100)).toEqual('down')
  })

  it('returns neutral when eloChange is between -50 and 50', () => {
    expect(computeTrendFromEloChange(0)).toEqual('neutral')
    expect(computeTrendFromEloChange(50)).toEqual('neutral')
    expect(computeTrendFromEloChange(-50)).toEqual('neutral')
    expect(computeTrendFromEloChange(25)).toEqual('neutral')
    expect(computeTrendFromEloChange(-25)).toEqual('neutral')
  })
})

describe('getRankings', () => {
  it('returns all countries sorted by eloRating descending with defaults for missing', async () => {
    const mockRows = [
      { countryId: 'japan', eloChange: 60, eloRating: 1800 },
      { countryId: 'mexico', eloChange: -80, eloRating: 1600 },
      { countryId: 'italy', eloChange: 10, eloRating: 1700 }
    ]

    const { database } = await import('@/db')
    const mockOrderBy = vi.fn().mockResolvedValue(mockRows)
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
    vi.mocked(database.select).mockReturnValue(
      { from: mockFrom } as unknown as ReturnType<typeof database.select>
    )

    const { getRankings } = await import('./rankings')
    const rankings = await getRankings()

    expect(rankings).toHaveLength(countries.length)

    expect(rankings[0].countryId).toEqual('japan')
    expect(rankings[0].eloRating).toEqual(1800)
    expect(rankings[0].rank).toEqual(1)
    expect(rankings[0].trend).toEqual('up')

    expect(rankings[1].countryId).toEqual('italy')
    expect(rankings[1].eloRating).toEqual(1700)
    expect(rankings[1].rank).toEqual(2)
    expect(rankings[1].trend).toEqual('neutral')

    expect(rankings[2].countryId).toEqual('mexico')
    expect(rankings[2].eloRating).toEqual(1600)
    expect(rankings[2].rank).toEqual(3)
    expect(rankings[2].trend).toEqual('down')

    const unranked = rankings.filter(
      (r) => !['japan', 'italy', 'mexico'].includes(r.countryId)
    )

    for (const ranking of unranked) {
      expect(ranking.eloRating).toEqual(1500)
      expect(ranking.trend).toEqual('neutral')
    }
  })

  it('assigns correct ranks starting from 1', async () => {
    const { database } = await import('@/db')
    const mockOrderBy = vi.fn().mockResolvedValue([])
    const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
    vi.mocked(database.select).mockReturnValue(
      { from: mockFrom } as unknown as ReturnType<typeof database.select>
    )

    const { getRankings } = await import('./rankings')
    const rankings = await getRankings()

    expect(rankings[0].rank).toEqual(1)
    expect(rankings[rankings.length - 1].rank).toEqual(countries.length)
  })
})
