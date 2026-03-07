import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const votes = pgTable('votes', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  nonPreferredCountryId: text('non_preferred_country_id').notNull(),
  preferredCountryId: text('preferred_country_id').notNull(),
  visitorId: uuid('visitor_id').notNull()
})
