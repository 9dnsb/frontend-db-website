import Link from 'next/link'
import { fetchData } from '@/lib/fetchData'
import { formatDate } from '@/lib/formatDate'
import { capitalize } from '@/lib/capitalize'

type Puzzle = {
  id: string
  slug: string
  startingWord: string
  publishedDate: string
}

export default async function OneOffListPage() {
  let puzzles: Puzzle[] = []

  try {
    const data = await fetchData<{ docs: Puzzle[] }>(
      '/api/oneoffpuzzles?sort=-publishedDate'
    )
    puzzles = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch One Off puzzles:', err)
    return null
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">One Off Puzzles</h1>

      {puzzles.length === 0 ? (
        <p>No puzzles found.</p>
      ) : (
        <ul className="space-y-4">
          {puzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <Link
                href={`/puzzles/oneoff/${puzzle.slug}`}
                className="block border rounded-lg p-4 hover:shadow transition bg-muted/5"
              >
                <h2 className="font-semibold text-lg">
                  {formatDate(puzzle.publishedDate)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Word: {capitalize(puzzle.startingWord)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
