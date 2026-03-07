import { describe, expect, it, vi } from 'vitest'

vi.mock('@/db', () => ({ db: {} }))

import { countries } from '@/lib/countries'

import { buildRankings, computeScore, computeTrend } from './rankings'

describe('computeScore', () => {
  it('returns 0.5 for zero votes', () => {
    expect(computeScore(0, 0)).toEqual(0.5)
  })

  it('computes correct score with known values', () => {
    // (10 + 2) / (20 + 4) = 12/24 = 0.5
    expect(computeScore(10, 20)).toEqual(0.5)

    // (8 + 2) / (10 + 4) = 10/14 ≈ 0.7143
    expect(computeScore(8, 10)).toBeCloseTo(0.7143, 4)

    // (0 + 2) / (10 + 4) = 2/14 ≈ 0.1429
    expect(computeScore(0, 10)).toBeCloseTo(0.1429, 4)
  })
})

describe('computeTrend', () => {
  it('returns up when recent score is notably higher', () => {
    expect(computeTrend(0.5, 0.6)).toEqual('up')
  })

  it('returns down when recent score is notably lower', () => {
    expect(computeTrend(0.6, 0.5)).toEqual('down')
  })

  it('returns neutral when scores are close', () => {
    expect(computeTrend(0.5, 0.52)).toEqual('neutral')
    expect(computeTrend(0.5, 0.5)).toEqual('neutral')
    expect(computeTrend(0.5, 0.48)).toEqual('neutral')
  })
})

describe('buildRankings', () => {
  it('includes all countries even with no votes', () => {
    const rankings = buildRankings(new Map(), new Map(), new Map(), new Map())

    expect(rankings).toHaveLength(countries.length)

    for (const ranking of rankings) {
      expect(ranking.score).toEqual(0.5)
      expect(ranking.wins).toEqual(0)
      expect(ranking.losses).toEqual(0)
      expect(ranking.totalMatchups).toEqual(0)
    }
  })

  it('ranks highest score as rank 1', () => {
    const wins = new Map([
      ['japan', 10],
      ['mexico', 5]
    ])

    const losses = new Map([
      ['japan', 2],
      ['mexico', 8]
    ])

    const rankings = buildRankings(wins, losses, new Map(), new Map())
    const japan = rankings.find((r) => r.countryId === 'japan')
    const mexico = rankings.find((r) => r.countryId === 'mexico')

    expect(japan?.rank).toBeLessThan(mexico?.rank ?? 0)
    expect(rankings[0].rank).toEqual(1)
  })

  it('sorts by score descending', () => {
    const wins = new Map([
      ['japan', 20],
      ['italy', 15],
      ['mexico', 5]
    ])

    const losses = new Map([
      ['japan', 2],
      ['italy', 5],
      ['mexico', 15]
    ])

    const rankings = buildRankings(wins, losses, new Map(), new Map())
    const topThree = rankings.slice(0, 3)

    expect(topThree[0].countryId).toEqual('japan')
    expect(topThree[1].countryId).toEqual('italy')
    expect(topThree[2].score).toBeGreaterThanOrEqual(
      rankings[rankings.length - 1].score
    )
  })

  it('detects trend correctly', () => {
    const wins = new Map([['japan', 50]])
    const losses = new Map([['japan', 50]])

    // Recent: 10 wins out of 10 → score ~0.857
    // All-time: 50/100 → score 0.5
    const recentWins = new Map([['japan', 10]])
    const recentLosses = new Map<string, number>()

    const rankings = buildRankings(wins, losses, recentWins, recentLosses)
    const japan = rankings.find((r) => r.countryId === 'japan')

    expect(japan?.trend).toEqual('up')
  })
})
