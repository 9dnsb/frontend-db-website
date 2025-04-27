// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { formatDate } from '@/lib/formatDate' // moved here
import type { Metadata } from 'next'

export function createPuzzleMetadataLoader<T>(
  loadPuzzleFn: (slug: string) => Promise<T | null>,
  getMetadataText: (puzzle: T) => { title: string; description: string }
) {
  return async function generateMetadata(slug: string): Promise<Metadata> {
    const puzzle = await loadPuzzleFn(slug)

    if (!puzzle) {
      return {
        title: 'Puzzle Not Found',
        description: 'The requested puzzle could not be found.',
      }
    }

    const { title, description } = getMetadataText(puzzle)

    return {
      title,
      description,
    }
  }
}
