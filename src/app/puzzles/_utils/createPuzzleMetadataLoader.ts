import type { Metadata } from 'next'

export function createPuzzleMetadataLoader<T>(
  loadPuzzleFn: (slug: string) => Promise<T | null>,
  getMetadataText: (puzzle: T) => {
    title: string
    description: string
    path: string
  }
) {
  return async function generateMetadata(slug: string): Promise<Metadata> {
    const puzzle = await loadPuzzleFn(slug)

    if (!puzzle) {
      return {
        title: 'Puzzle Not Found',
        description: 'The requested puzzle could not be found.',
        openGraph: {
          title: 'Puzzle Not Found',
          description: 'The requested puzzle could not be found.',
          type: 'website',
          siteName: 'David Blatt',
          url: `https://davidblatt.ca/`, // fallback home
          locale: 'en_CA',
        },
        twitter: {
          card: 'summary',
          title: 'Puzzle Not Found',
          description: 'The requested puzzle could not be found.',
        },
      }
    }

    const { title, description, path } = getMetadataText(puzzle)

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        siteName: 'David Blatt',
        url: `https://davidblatt.ca${path}`,
        locale: 'en_CA',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    }
  }
}
