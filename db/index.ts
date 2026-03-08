import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined
}

export const database =
  globalForDrizzle.db ?? drizzle<typeof schema>(databaseUrl, { schema })

if (process.env.NODE_ENV !== 'production') {
  globalForDrizzle.db = database
}
