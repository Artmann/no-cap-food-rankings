// @vitest-environment node
import { type PGlite } from '@electric-sql/pglite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { contryRankings } from '@/db/schema'
import { createTestDatabase } from '@/db/test-utils'
import { countries } from '@/lib/countries'

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
})

afterEach(async () => {
  await client.close()
  vi.restoreAllMocks()
})

async function callEndpoint() {
  const { GET } = await import('./route')

  return GET()
}

describe('GET /api/rankings', () => {
  it('returns a successful json response', async () => {
    const response = await callEndpoint()

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('returns all countries when no rankings exist', async () => {
    const response = await callEndpoint()
    const body = await response.json()

    expect(body).toHaveLength(countries.length)
  })

  it('returns default elo rating of 1500 for unranked countries', async () => {
    const response = await callEndpoint()
    const body = await response.json()

    for (const ranking of body) {
      expect(ranking.eloRating).toEqual(1500)
      expect(ranking.trend).toEqual('neutral')
    }
  })

  it('assigns sequential ranks starting from 1', async () => {
    const response = await callEndpoint()
    const body = await response.json()

    expect(body[0].rank).toEqual(1)
    expect(body[body.length - 1].rank).toEqual(countries.length)

    for (let i = 0; i < body.length; i++) {
      expect(body[i].rank).toEqual(i + 1)
    }
  })

  it('returns countries sorted by elo rating descending', async () => {
    const database = hoisted.database!

    await database.insert(contryRankings).values([
      { countryId: 'japan', eloChange: 60, eloRating: 1800 },
      { countryId: 'italy', eloChange: 10, eloRating: 1700 },
      { countryId: 'mexico', eloChange: -80, eloRating: 1600 }
    ])

    const response = await callEndpoint()
    const body = await response.json()

    expect(body[0]).toEqual(
      expect.objectContaining({
        countryId: 'japan',
        eloRating: 1800,
        rank: 1,
        trend: 'up'
      })
    )

    expect(body[1]).toEqual(
      expect.objectContaining({
        countryId: 'italy',
        eloRating: 1700,
        rank: 2,
        trend: 'neutral'
      })
    )

    expect(body[2]).toEqual(
      expect.objectContaining({
        countryId: 'mexico',
        eloRating: 1600,
        rank: 3,
        trend: 'down'
      })
    )
  })

  it('includes country metadata in each ranking', async () => {
    const response = await callEndpoint()
    const body = await response.json()

    for (const ranking of body) {
      expect(ranking).toEqual(
        expect.objectContaining({
          countryId: expect.any(String),
          dishes: expect.any(Array),
          eloRating: expect.any(Number),
          emoji: expect.any(String),
          name: expect.any(String),
          rank: expect.any(Number),
          trend: expect.any(String)
        })
      )
    }
  })

  it('reflects updated rankings from the database', async () => {
    const database = hoisted.database!

    await database.insert(contryRankings).values({
      countryId: 'thailand',
      eloChange: 100,
      eloRating: 2000
    })

    const response = await callEndpoint()
    const body = await response.json()

    expect(body[0]).toEqual(
      expect.objectContaining({
        countryId: 'thailand',
        eloRating: 2000,
        rank: 1,
        trend: 'up'
      })
    )
  })
})
