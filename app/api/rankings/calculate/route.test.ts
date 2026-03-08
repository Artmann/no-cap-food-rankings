// @vitest-environment node
import { eq } from 'drizzle-orm'
import { type PGlite } from '@electric-sql/pglite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { contryRankings, votes } from '@/db/schema'
import { createTestDatabase } from '@/db/test-utils'

type TestDatabase = Awaited<ReturnType<typeof createTestDatabase>>

const hoisted = vi.hoisted(() => {
  return {
    database: null as TestDatabase['database'] | null
  }
})

vi.mock('@/db', () => ({
  get database() {
    return hoisted.database
  }
}))

let client: PGlite

beforeEach(async () => {
  const testDb = await createTestDatabase()

  client = testDb.client
  hoisted.database = testDb.database

  process.env.RANKINGS_API_KEY = 'test-secret'
})

afterEach(async () => {
  await client.close()
  vi.restoreAllMocks()
})

async function insertVote(
  database: TestDatabase['database'],
  preferred: string,
  nonPreferred: string,
  createdAt: Date
) {
  await database.insert(votes).values({
    createdAt,
    nonPreferredCountryId: nonPreferred,
    preferredCountryId: preferred,
    visitorId: '00000000-0000-0000-0000-000000000001'
  })
}

async function callEndpoint(key?: string) {
  const { POST } = await import('./route')

  const url = key
    ? `http://localhost/api/rankings/calculate?key=${key}`
    : 'http://localhost/api/rankings/calculate'

  const request = new Request(url, { method: 'POST' })

  return POST(request)
}

describe('POST /api/rankings/calculate', () => {
  describe('auth', () => {
    it('returns 401 without key', async () => {
      const response = await callEndpoint()

      expect(response.status).toEqual(401)
    })

    it('returns 401 with wrong key', async () => {
      const response = await callEndpoint('wrong-key')

      expect(response.status).toEqual(401)
    })

    it('returns 200 with correct key', async () => {
      const response = await callEndpoint('test-secret')

      expect(response.status).toEqual(200)
    })
  })

  describe('empty database', () => {
    it('returns empty ratings when no votes exist', async () => {
      const response = await callEndpoint('test-secret')
      const body = await response.json()

      expect(body).toEqual({
        eloChanges: {},
        ratings: {},
        success: true,
        voteCount: 0
      })
    })
  })

  describe('elo calculation', () => {
    it('calculates correct ratings for a single vote', async () => {
      const db = hoisted.database!

      await insertVote(db, 'japan', 'italy', new Date('2025-01-01'))

      const response = await callEndpoint('test-secret')
      const body = await response.json()

      expect(body.ratings).toEqual({
        italy: 1484,
        japan: 1516
      })

      expect(body.voteCount).toEqual(1)
    })

    it('calculates correct ratings for multiple votes', async () => {
      const db = hoisted.database!

      await insertVote(db, 'japan', 'italy', new Date('2025-01-01'))
      await insertVote(db, 'japan', 'mexico', new Date('2025-01-02'))
      await insertVote(db, 'mexico', 'italy', new Date('2025-01-03'))

      const response = await callEndpoint('test-secret')
      const body = await response.json()

      // Vote 1: japan 1500 vs italy 1500 → japan 1516, italy 1484
      // Vote 2: japan 1516 vs mexico 1500 → expected japan = 1/(1+10^((1500-1516)/400)) ≈ 0.523
      //   japan += 32*(1-0.523) = 15.27 → 1531.27, mexico += 32*(0-0.477) = -15.27 → 1484.73
      // Vote 3: mexico 1484.73 vs italy 1484 → expected mexico = 1/(1+10^((1484-1484.73)/400)) ≈ 0.501
      //   mexico += 32*(1-0.501) = 15.97 → 1500.70, italy += 32*(0-0.499) = -15.97 → 1468.03

      expect(body.ratings.japan).toBeCloseTo(1531.27, 0)
      expect(body.ratings.mexico).toBeCloseTo(1500.7, 0)
      expect(body.ratings.italy).toBeCloseTo(1468.03, 0)

      expect(body.voteCount).toEqual(3)
    })
  })

  describe('db persistence', () => {
    it('persists rankings to country_rankings table', async () => {
      const db = hoisted.database!

      await insertVote(db, 'japan', 'italy', new Date('2025-01-01'))

      await callEndpoint('test-secret')

      const japanRanking = await db
        .select()
        .from(contryRankings)
        .where(eq(contryRankings.countryId, 'japan'))

      const italyRanking = await db
        .select()
        .from(contryRankings)
        .where(eq(contryRankings.countryId, 'italy'))

      expect(japanRanking[0]).toEqual(
        expect.objectContaining({
          countryId: 'japan',
          eloChange: 16,
          eloRating: 1516
        })
      )

      expect(italyRanking[0]).toEqual(
        expect.objectContaining({
          countryId: 'italy',
          eloChange: -16,
          eloRating: 1484
        })
      )
    })

    it('upserts rankings without creating duplicate rows', async () => {
      const db = hoisted.database!

      await insertVote(db, 'japan', 'italy', new Date('2025-01-01'))

      await callEndpoint('test-secret')
      await callEndpoint('test-secret')

      const allRankings = await db.select().from(contryRankings)

      expect(allRankings).toHaveLength(2)
    })
  })
})
