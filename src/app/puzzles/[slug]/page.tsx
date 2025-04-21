import { notFound } from 'next/navigation'
import ClientPuzzlePage from './ClientPuzzlePage'

type Word = {
  word: string
  difficulty: 'easy' | 'medium' | 'hard' | 'tricky'
}

type Puzzle = {
  slug: string
  publishedDate: string
  easyGroup: { word: string }[]
  mediumGroup: { word: string }[]
  hardGroup: { word: string }[]
  trickyGroup: { word: string }[]
}

type APIResponse = {
  docs: Puzzle[]
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/puzzles`)
  const data: APIResponse = await res.json()

  return data.docs.map((puzzle) => ({
    slug: puzzle.slug,
  }))
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  let puzzle: Puzzle | undefined = undefined

  try {
    const res = await fetch(
      `${baseUrl}/api/puzzles?where[slug][equals]=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      console.error(`❌ Puzzle fetch failed: ${res.status} for slug=${slug}`)
      return notFound()
    }

    const data: APIResponse = await res.json()
    puzzle = data.docs?.[0]

    if (!puzzle) {
      console.warn(`⚠️ Puzzle not found for slug=${slug}`)
      return notFound()
    }
  } catch (err) {
    console.error(`❌ Exception fetching puzzle slug=${slug}:`, err)
    return notFound()
  }

  const words: Word[] = shuffle([
    ...puzzle.easyGroup.map((w) => ({ ...w, difficulty: 'easy' as const })),
    ...puzzle.mediumGroup.map((w) => ({ ...w, difficulty: 'medium' as const })),
    ...puzzle.hardGroup.map((w) => ({ ...w, difficulty: 'hard' as const })),
    ...puzzle.trickyGroup.map((w) => ({ ...w, difficulty: 'tricky' as const })),
  ])

  return <ClientPuzzlePage words={words} date={puzzle.publishedDate} />
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
