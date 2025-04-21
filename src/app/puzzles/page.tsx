import { PuzzleCard } from '../components/PuzzleCard'
import { fetchData } from '@/lib/fetchData'

type Puzzle = {
  id: string
  slug: string
  publishedDate: string
}

export default async function PuzzleListPage() {
  let puzzles: Puzzle[] = []

  try {
    const data = await fetchData<{ docs: Puzzle[] }>('/api/puzzles')
    puzzles = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch puzzles:', err)
    return null
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Puzzles</h1>

      {puzzles.length === 0 ? (
        <p>No puzzles found.</p>
      ) : (
        <ul className="space-y-3">
          {puzzles.map((puzzle) => (
            <li key={puzzle.id}>
              <PuzzleCard
                slug={puzzle.slug}
                publishedDate={puzzle.publishedDate}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
