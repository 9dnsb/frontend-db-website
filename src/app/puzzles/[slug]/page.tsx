import { notFound } from 'next/navigation'
import ClientPuzzlePage from './ClientPuzzlePage'
import { fetchData } from '@/lib/fetchData'

type Word = {
  word: string
  difficulty: 'easy' | 'medium' | 'hard' | 'tricky'
}

type Puzzle = {
  slug: string
  publishedDate: string
  easyGroup: {
    label: string
    words: { word: string }[]
  }
  mediumGroup: {
    label: string
    words: { word: string }[]
  }
  hardGroup: {
    label: string
    words: { word: string }[]
  }
  trickyGroup: {
    label: string
    words: { word: string }[]
  }
}

type APIResponse = {
  docs: Puzzle[]
}

export async function generateStaticParams() {
  const data = await fetchData<APIResponse>('/api/puzzles')
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

  try {
    const data = await fetchData<APIResponse>(
      `/api/puzzles?where[slug][equals]=${slug}`
    )
    const puzzle = data.docs?.[0]

    if (!puzzle) {
      console.warn(`⚠️ Puzzle not found for slug=${slug}`)
      return notFound()
    }

    const words: Word[] = shuffle([
      ...puzzle.easyGroup.words.map((w) => ({
        ...w,
        difficulty: 'easy' as const,
      })),
      ...puzzle.mediumGroup.words.map((w) => ({
        ...w,
        difficulty: 'medium' as const,
      })),
      ...puzzle.hardGroup.words.map((w) => ({
        ...w,
        difficulty: 'hard' as const,
      })),
      ...puzzle.trickyGroup.words.map((w) => ({
        ...w,
        difficulty: 'tricky' as const,
      })),
    ])

    const labels = {
      easy: puzzle.easyGroup.label,
      medium: puzzle.mediumGroup.label,
      hard: puzzle.hardGroup.label,
      tricky: puzzle.trickyGroup.label,
    }

    return (
      <ClientPuzzlePage
        words={words}
        date={puzzle.publishedDate}
        labels={labels}
      />
    )
  } catch (err) {
    console.error(`❌ Exception fetching puzzle slug=${slug}:`, err)
    return notFound()
  }
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
