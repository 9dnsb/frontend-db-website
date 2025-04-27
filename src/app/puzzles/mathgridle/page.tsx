import Link from 'next/link'
import { fetchData } from '@/lib/fetchData'
import { formatDate } from '@/lib/formatDate'

type MathGridlePuzzle = {
  id: string
  slug: string
  publishedDate: string
}

export default async function MathGridleListPage() {
  let puzzles: MathGridlePuzzle[] = []

  try {
    const data = await fetchData<{ docs: MathGridlePuzzle[] }>(
      '/api/mathgridlepuzzles?sort=-publishedDate'
    )
    puzzles = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch Math Gridle puzzles:', err)

    // Fallback: hardcoded test puzzles
    puzzles = [
      {
        id: 'test-1',
        slug: 'example-puzzle-1',
        publishedDate: '2025-04-27',
      },
    ]
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Math Gridle Puzzles</h1>

      {puzzles.length === 0 ? (
        <p>No puzzles found.</p>
      ) : (
        <ul className="space-y-4">
          {puzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <Link
                href={`/puzzles/mathgridle/${puzzle.slug}`}
                className="block border rounded-lg p-4 hover:shadow transition bg-muted/5"
              >
                <h2 className="font-semibold text-lg">
                  {formatDate(puzzle.publishedDate)}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
