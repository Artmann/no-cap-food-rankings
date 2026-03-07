'use client'

const storageKey = 'chow-where-visitor-id'

export function getVisitorId(): string {
  const existing = localStorage.getItem(storageKey)

  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  localStorage.setItem(storageKey, id)

  return id
}
