'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'

import type { CountryRanking } from '@/lib/rankings'

function TrendIndicator({ trend }: { trend: CountryRanking['trend'] }) {
  if (trend === 'up') {
    return <span className="text-emerald-500 font-bold">↑</span>
  }

  if (trend === 'down') {
    return <span className="text-red-500 font-bold">↓</span>
  }

  return null
}

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span>🥇</span>
  if (rank === 2) return <span>🥈</span>
  if (rank === 3) return <span>🥉</span>

  return <span className="text-sm text-neutral-500">{rank}</span>
}

export function RankingsTable({
  initialRankings
}: {
  initialRankings: CountryRanking[]
}) {
  const [rankings, setRankings] = useState(initialRankings)

  const fetchRankings = useCallback(async () => {
    try {
      const response = await fetch('/api/rankings')
      const data = await response.json()

      setRankings(data)
    } catch {
      // silently ignore polling errors
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchRankings, 5000)

    return () => clearInterval(interval)
  }, [fetchRankings])

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-sm font-medium text-neutral-500">
              <th className="px-4 py-3 w-16">Rank</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <LayoutGroup>
            <AnimatePresence>
              <tbody>
                {rankings.map((ranking) => (
                  <motion.tr
                    className="border-b border-neutral-100 last:border-0"
                    key={ranking.countryId}
                    layout
                    transition={{ duration: 0.3, type: 'spring', bounce: 0.15 }}
                  >
                    <td className="px-4 py-3 text-center text-sm">
                      <MedalBadge rank={ranking.rank} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900">
                          {ranking.name}
                        </span>
                        <div className="flex gap-1">
                          {ranking.dishes.map((dish) => (
                            <span
                              className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] leading-tight text-neutral-500"
                              key={dish.name}
                            >
                              {dish.emoji} {dish.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TrendIndicator trend={ranking.trend} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </LayoutGroup>
        </table>
      </div>

      {/* Mobile card list */}
      <LayoutGroup>
        <div className="flex flex-col gap-2 md:hidden">
          <AnimatePresence>
            {rankings.map((ranking) => (
              <motion.div
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm"
                key={ranking.countryId}
                layout
                transition={{ duration: 0.3, type: 'spring', bounce: 0.15 }}
              >
                <div className="flex w-10 flex-shrink-0 items-center justify-center text-sm">
                  <MedalBadge rank={ranking.rank} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-neutral-900">
                    {ranking.name}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {ranking.dishes.map((dish) => (
                      <span
                        className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] leading-tight text-neutral-500"
                        key={dish.name}
                      >
                        {dish.emoji} {dish.name}
                      </span>
                    ))}
                  </div>
                </div>
                <TrendIndicator trend={ranking.trend} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </>
  )
}
