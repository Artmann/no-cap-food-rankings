import { Github } from 'lucide-react'
import Link from 'next/link'

import { getRankings } from '@/lib/rankings'

import { RankingsTable } from './rankings-table'

export const dynamic = 'force-dynamic'

export const metadata = {
  description: 'See which country has the best food, ranked by your votes.',
  title: 'rankings | no cap food rankings'
}

export default async function Home() {
  const rankings = await getRankings()

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              no cap food rankings
            </h1>
            <p className="mt-1 text-neutral-500">the people have spoken</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="text-neutral-400 transition-colors hover:text-neutral-900"
              href="https://github.com/Artmann/chow-where"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-5 w-5" />
            </a>
            <Link
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              href="/vote"
            >
              Start Voting
            </Link>
          </div>
        </div>

        <RankingsTable initialRankings={rankings} />
      </div>
    </div>
  )
}
