import { notFound } from 'next/navigation'
import type { ComponentType } from 'react' // ✅ Only import ComponentType now

export function createPuzzlePage<TBackend, TClient extends object>(
  loadPuzzleFn: (slug: string) => Promise<TBackend | null>,
  transformPuzzleFn: (puzzle: TBackend) => TClient,
  ClientComponent: ComponentType<TClient>
) {
  return async function PuzzlePage({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    const puzzle = await loadPuzzleFn(slug)

    if (!puzzle) return notFound()

    const clientProps = transformPuzzleFn(puzzle)

    return <ClientComponent {...clientProps} />
  }
}
