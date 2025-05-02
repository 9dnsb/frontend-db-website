'use client'

import Link from 'next/link'

const games = [
  {
    slug: 'oneoff',
    name: 'One Off',
    description: 'Change, add, or remove one letter to find all related words.',
  },
  {
    slug: 'mathgridle',
    name: 'Math Gridle',
    description:
      'Fill the 3×3 grid using numbers 1–9 to match all row and column sums.',
  },
  {
    slug: 'mixandmatch',
    name: 'Mix & Match',
    description:
      'Group 16 words into 4 hidden categories. Can you find the sets?',
  },
]

export default function PuzzleHubPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Choose a Puzzle</h1>
      <ul className="space-y-4">
        {games.map(({ slug, name, description }) => (
          <li key={slug}>
            <Link
              href={`/puzzles/${slug}`}
              className="block rounded-lg p-6 border hover:shadow transition bg-muted/5"
            >
              <h2 className="text-xl font-semibold mb-1">{name}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
