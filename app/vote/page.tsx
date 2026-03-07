import type { Metadata } from 'next'

import { VoteScreen } from './vote-screen'

export const metadata: Metadata = {
  description:
    'Pick your favorite between two countries and see which cuisine reigns supreme.',
  title: 'vote | no cap food rankings'
}

export default function VotePage() {
  return <VoteScreen />
}
