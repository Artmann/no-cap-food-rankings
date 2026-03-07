import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Country } from '@/lib/countries'

const mockCountryA: Country = {
  description: 'Test description A',
  dishes: [
    { emoji: '🍕', name: 'Dish A1' },
    { emoji: '🍝', name: 'Dish A2' }
  ],
  emoji: '🇮🇹',
  id: 'country-a',
  name: 'Country A'
}

const mockCountryB: Country = {
  description: 'Test description B',
  dishes: [
    { emoji: '🍣', name: 'Dish B1' },
    { emoji: '🍜', name: 'Dish B2' }
  ],
  emoji: '🇯🇵',
  id: 'country-b',
  name: 'Country B'
}

const mockCountryC: Country = {
  description: 'Test description C',
  dishes: [{ emoji: '🌮', name: 'Dish C1' }],
  emoji: '🇲🇽',
  id: 'country-c',
  name: 'Country C'
}

const mockSaveVote = vi.fn()
let pairIndex = 0
const pairs: [Country, Country][] = [
  [mockCountryA, mockCountryB],
  [mockCountryC, mockCountryA]
]

vi.mock('./actions', () => ({
  saveVote: (...args: unknown[]) => mockSaveVote(...args)
}))

vi.mock('@/lib/countries', () => ({
  getRandomPair: () => pairs[pairIndex++ % pairs.length]
}))

vi.mock('@/lib/visitor', () => ({
  getVisitorId: () => 'test-visitor-id'
}))

import { VoteScreen } from './vote-screen'

describe('VoteScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    pairIndex = 0
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders two countries with their names and descriptions', () => {
    render(<VoteScreen />)

    expect(screen.getByText('Country A')).toBeInTheDocument()
    expect(screen.getByText('Country B')).toBeInTheDocument()
    expect(screen.getByText('Test description A')).toBeInTheDocument()
    expect(screen.getByText('Test description B')).toBeInTheDocument()
  })

  it('renders dishes for both countries', () => {
    render(<VoteScreen />)

    expect(screen.getByText(/Dish A1/)).toBeInTheDocument()
    expect(screen.getByText(/Dish A2/)).toBeInTheDocument()
    expect(screen.getByText(/Dish B1/)).toBeInTheDocument()
    expect(screen.getByText(/Dish B2/)).toBeInTheDocument()
  })

  it('renders the VS badge and skip button', () => {
    render(<VoteScreen />)

    expect(screen.getByText('VS')).toBeInTheDocument()
    expect(screen.getByText('Skip')).toBeInTheDocument()
  })

  it('calls saveVote with correct data when voting for the first country', async () => {
    mockSaveVote.mockResolvedValue(undefined)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<VoteScreen />)

    await user.click(screen.getByText('Country A'))

    expect(mockSaveVote).toHaveBeenCalledWith({
      nonPreferredCountryId: 'country-b',
      preferredCountryId: 'country-a',
      visitorId: 'test-visitor-id'
    })
  })

  it('calls saveVote with correct data when voting for the second country', async () => {
    mockSaveVote.mockResolvedValue(undefined)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<VoteScreen />)

    await user.click(screen.getByText('Country B'))

    expect(mockSaveVote).toHaveBeenCalledWith({
      nonPreferredCountryId: 'country-a',
      preferredCountryId: 'country-b',
      visitorId: 'test-visitor-id'
    })
  })

  it('shows a new pair after voting', async () => {
    mockSaveVote.mockResolvedValue(undefined)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<VoteScreen />)

    await user.click(screen.getByText('Country A'))
    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(screen.getByText('Country C')).toBeInTheDocument()
    })
  })

  it('shows a new pair after skipping without saving a vote', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<VoteScreen />)

    await user.click(screen.getByText('Skip'))
    vi.advanceTimersByTime(400)

    await waitFor(() => {
      expect(screen.getByText('Country C')).toBeInTheDocument()
    })

    expect(mockSaveVote).not.toHaveBeenCalled()
  })
})
