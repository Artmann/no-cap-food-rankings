import { getRankings } from '@/lib/rankings'

export async function GET() {
  const rankings = await getRankings()

  return Response.json(rankings)
}
