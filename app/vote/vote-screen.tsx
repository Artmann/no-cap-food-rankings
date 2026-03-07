'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'

import type { Country } from '@/lib/countries'
import { getRandomPair } from '@/lib/countries'
import { getVisitorId } from '@/lib/visitor'

import { saveVote } from './actions'

const emptySubscribe = () => () => {}

export function VoteScreen() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <div className="flex h-dvh items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  return <VoteScreenInner />
}

function VoteScreenInner() {
  const [visitorId] = useState(getVisitorId)
  const [pair, setPair] = useState<[Country, Country]>(getRandomPair)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const handleSkip = useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)

    setTimeout(() => {
      setPair(getRandomPair())
      setSelected(null)
      setIsTransitioning(false)
    }, 300)
  }, [isTransitioning])

  const handleVote = useCallback(
    async (preferred: Country, nonPreferred: Country) => {
      if (isTransitioning) return

      setSelected(preferred.id)
      setIsTransitioning(true)

      await saveVote({
        nonPreferredCountryId: nonPreferred.id,
        preferredCountryId: preferred.id,
        visitorId
      })

      setTimeout(() => {
        setPair(getRandomPair())
        setSelected(null)
        setIsTransitioning(false)
      }, 400)
    },
    [isTransitioning, visitorId]
  )

  const [top, bottom] = pair

  return (
    <div className="relative flex h-dvh flex-col md:flex-row">
      <button
        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 bg-gradient-to-b from-amber-200 to-orange-300 px-6 text-neutral-900 transition-opacity duration-300 md:bg-gradient-to-r ${
          isTransitioning && selected !== top.id ? 'opacity-40' : 'opacity-100'
        }`}
        onClick={() => handleVote(top, bottom)}
        type="button"
      >
        <h2 className="text-2xl font-bold">{top.name}</h2>
        <p className="max-w-xs text-center text-base text-neutral-600">
          {top.description}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {top.dishes.map((dish) => (
            <span
              className="rounded-full bg-neutral-900/10 px-3 py-1 text-sm backdrop-blur-sm"
              key={dish.name}
            >
              {dish.emoji} {dish.name}
            </span>
          ))}
        </div>
      </button>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-sm font-bold text-white shadow-lg">
          VS
        </div>
      </div>

      <button
        className="absolute bottom-4 right-4 z-10 cursor-pointer rounded-full bg-neutral-900/15 px-3 py-1 text-xs font-medium text-neutral-800 backdrop-blur-sm transition-colors hover:bg-neutral-900/25 md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:-translate-x-1/2 md:translate-y-24"
        onClick={handleSkip}
        type="button"
      >
        Skip
      </button>

      <button
        className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 bg-gradient-to-b from-cyan-200 to-blue-300 px-6 text-neutral-900 transition-opacity duration-300 md:bg-gradient-to-r ${
          isTransitioning && selected !== bottom.id
            ? 'opacity-40'
            : 'opacity-100'
        }`}
        onClick={() => handleVote(bottom, top)}
        type="button"
      >
        <h2 className="text-2xl font-bold">{bottom.name}</h2>
        <p className="max-w-xs text-center text-base text-neutral-600">
          {bottom.description}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {bottom.dishes.map((dish) => (
            <span
              className="rounded-full bg-neutral-900/10 px-3 py-1 text-sm backdrop-blur-sm"
              key={dish.name}
            >
              {dish.emoji} {dish.name}
            </span>
          ))}
        </div>
      </button>
    </div>
  )
}
