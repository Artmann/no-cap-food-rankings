import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'

import * as schema from './schema'

export async function createTestDatabase() {
  const client = new PGlite()

  await client.exec(`
    CREATE TABLE votes (
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      non_preferred_country_id TEXT NOT NULL,
      preferred_country_id TEXT NOT NULL,
      visitor_id UUID NOT NULL
    );

    CREATE TABLE country_rankings (
      country_id TEXT PRIMARY KEY,
      elo_change INTEGER NOT NULL,
      elo_rating INTEGER NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)

  const database = drizzle(client, { schema })

  return { client, database }
}
