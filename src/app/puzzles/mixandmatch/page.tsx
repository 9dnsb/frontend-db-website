import Link from 'next/link'
import { fetchData } from '@/lib/fetchData'
import { formatDate } from '@/lib/formatDate'

type Puzzle = {
  id: string
  slug: string
  publishedDate: string
}

export default async function MixAndMatchListPage() {
  let puzzles: Puzzle[] = []

  try {
    const data = await fetchData<{ docs: Puzzle[] }>(
      '/api/mixandmatchpuzzles?sort=-publishedDate'
    )
    puzzles = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch Mix & Match puzzles:', err)
    return null
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mix & Match Puzzles</h1>

      {puzzles.length === 0 ? (
        <p>No puzzles found.</p>
      ) : (
        <ul className="space-y-4">
          {puzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <Link
                href={`/puzzles/mixandmatch/${puzzle.slug}`}
                className="block border rounded-lg p-4 hover:shadow transition bg-muted/5"
              >
                <h2 className="font-semibold text-lg">
                  {formatDate(puzzle.publishedDate)}
                </h2>
                <p className="text-sm text-muted-foreground">{puzzle.slug}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
