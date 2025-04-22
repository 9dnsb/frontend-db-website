import { notFound } from 'next/navigation'
import ClientPuzzlePage from './ClientPuzzlePage'
import { loadOneOffPuzzle } from './loader'

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const puzzle = await loadOneOffPuzzle(slug)

  if (!puzzle) return notFound()

  return (
    <ClientPuzzlePage
      date={puzzle.publishedDate}
      startingWord={puzzle.startingWord}
      validAnswers={puzzle.validAnswers.map((a) => a.word)}
    />
  )
}
