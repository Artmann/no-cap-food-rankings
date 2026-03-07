import countriesData from '@/data/countries.json'

export interface Dish {
  emoji: string
  name: string
}

export interface Country {
  description: string
  dishes: Dish[]
  emoji: string
  id: string
  name: string
}

export const countries: Country[] = countriesData

export function getRandomPair(): [Country, Country] {
  const first = Math.floor(Math.random() * countries.length)
  let second = Math.floor(Math.random() * (countries.length - 1))

  if (second >= first) {
    second++
  }

  return [countries[first], countries[second]]
}
