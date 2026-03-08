import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { CountryRanking } from '@/lib/rankings'

import { RankingsTable } from './rankings-table'

const mockRankings: CountryRanking[] = [
  {
    countryId: 'japan',
    dishes: [
      { emoji: '🍣', name: 'Sushi' },
      { emoji: '🍜', name: 'Ramen' }
    ],
    eloRating: 1800,
    emoji: '🇯🇵',
    name: 'Japan',
    rank: 1,
    trend: 'up'
  },
  {
    countryId: 'italy',
    dishes: [
      { emoji: '🍕', name: 'Pizza' },
      { emoji: '🍝', name: 'Pasta' }
    ],
    eloRating: 1700,
    emoji: '🇮🇹',
    name: 'Italy',
    rank: 2,
    trend: 'neutral'
  },
  {
    countryId: 'mexico',
    dishes: [{ emoji: '🌮', name: 'Tacos' }],
    eloRating: 1600,
    emoji: '🇲🇽',
    name: 'Mexico',
    rank: 3,
    trend: 'down'
  },
  {
    countryId: 'france',
    dishes: [{ emoji: '🥐', name: 'Croissant' }],
    eloRating: 1500,
    emoji: '🇫🇷',
    name: 'France',
    rank: 4,
    trend: 'neutral'
  }
]

describe('RankingsTable', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders all country names', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    for (const ranking of mockRankings) {
      expect(screen.getAllByText(ranking.name).length).toBeGreaterThan(0)
    }
  })

  it('renders dish badges for each country', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.getAllByText(/Sushi/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Ramen/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Pizza/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Tacos/).length).toBeGreaterThan(0)
  })

  it('renders medal emojis for top 3', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.getAllByText('🥇').length).toBeGreaterThan(0)
    expect(screen.getAllByText('🥈').length).toBeGreaterThan(0)
    expect(screen.getAllByText('🥉').length).toBeGreaterThan(0)
  })

  it('renders numeric rank for positions beyond 3', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.getAllByText('4').length).toBeGreaterThan(0)
  })

  it('shows up arrow for trending up countries', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.getAllByText('↑').length).toBeGreaterThan(0)
  })

  it('shows down arrow for trending down countries', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.getAllByText('↓').length).toBeGreaterThan(0)
  })

  it('does not show indicator for neutral trend', () => {
    render(<RankingsTable initialRankings={mockRankings} />)

    expect(screen.queryByText('—')).not.toBeInTheDocument()
  })

  it('polls for updated rankings every 5 seconds', async () => {
    const updatedRankings = [
      { ...mockRankings[1], rank: 1 },
      { ...mockRankings[0], rank: 2 }
    ]

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(updatedRankings)
    })

    vi.stubGlobal('fetch', mockFetch)

    render(<RankingsTable initialRankings={mockRankings} />)

    vi.advanceTimersByTime(5000)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/rankings')
    })
  })

  it('renders with an empty rankings list', () => {
    render(<RankingsTable initialRankings={[]} />)

    expect(screen.getByText('Rank')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
  })
})
