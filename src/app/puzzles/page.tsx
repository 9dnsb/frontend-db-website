import Link from 'next/link'

type Puzzle = {
  id: string
  slug: string
  publishedDate: string
}

async function getPuzzles(): Promise<Puzzle[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/puzzles`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      cache: 'no-store',
    })

    const data = await res.json()
    return data.docs || []
  } catch {
    return []
  }
}

export default async function PuzzleListPage() {
  const puzzles = await getPuzzles()

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Puzzles</h1>

      {puzzles.length === 0 ? (
        <p>No puzzles found.</p>
      ) : (
        <ul className="space-y-3">
          {puzzles.map((puzzle) => {
            const dateLabel = new Date(puzzle.publishedDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )

            return (
              <li key={puzzle.id}>
                <Link
                  href={`/puzzles/${puzzle.slug}`}
                  className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-muted/50 transition"
                >
                  <span className="font-medium text-lg">{dateLabel}</span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    Click to play this puzzle
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
