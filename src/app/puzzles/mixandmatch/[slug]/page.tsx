import { notFound } from 'next/navigation'
import ClientPuzzlePage from './ClientPuzzlePage'
import { fetchData } from '@/lib/fetchData'
import { convertToWordArray, convertToLabels, Puzzle } from './loader'

type APIResponse = {
  docs: Puzzle[]
}

export async function generateStaticParams() {
  const data = await fetchData<{ docs: { slug: string }[] }>(
    '/api/mixandmatchpuzzles'
  )
  return data.docs.map((p) => ({ slug: p.slug }))
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const data = await fetchData<APIResponse>(
      `/api/mixandmatchpuzzles?where[slug][equals]=${slug}`
    )
    const puzzle = data.docs?.[0]

    if (!puzzle) {
      console.warn(`⚠️ Puzzle not found for slug=${slug}`)
      return notFound()
    }

    const words = convertToWordArray(puzzle)
    const labels = convertToLabels(puzzle)

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
