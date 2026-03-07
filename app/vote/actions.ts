'use server'

import { headers } from 'next/headers'

import { db } from '@/db'
import { votes } from '@/db/schema'

const rateLimitMap = new Map<string, number[]>()
const rateLimitWindow = 60_000
const rateLimitMax = 30

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(key) ?? []
  const recent = timestamps.filter((t) => now - t < rateLimitWindow)

  recent.push(now)
  rateLimitMap.set(key, recent)

  return recent.length > rateLimitMax
}

export async function saveVote(input: {
  nonPreferredCountryId: string
  preferredCountryId: string
  visitorId: string
}): Promise<{ error?: string }> {
  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return {
      error: 'Slow down! You are voting too fast. Try again in a minute.'
    }
  }

  try {
    await db.insert(votes).values({
      nonPreferredCountryId: input.nonPreferredCountryId,
      preferredCountryId: input.preferredCountryId,
      visitorId: input.visitorId
    })

    return {}
  } catch {
    return { error: 'Something went wrong saving your vote. Please try again.' }
  }
}
