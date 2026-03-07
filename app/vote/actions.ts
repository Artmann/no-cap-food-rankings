'use server'

import { db } from '@/db'
import { votes } from '@/db/schema'

export async function saveVote(input: {
  nonPreferredCountryId: string
  preferredCountryId: string
  visitorId: string
}) {
  await db.insert(votes).values({
    nonPreferredCountryId: input.nonPreferredCountryId,
    preferredCountryId: input.preferredCountryId,
    visitorId: input.visitorId
  })
}
