import type { Metadata } from 'next'

export function createDynamicPuzzleMetadataLoader<T>(
  loadPuzzleFn: (slug: string) => Promise<T | null>,
  getMetadataFields: (puzzle: T) => {
    title: string
    description: string
    path: string
  }
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>
  }): Promise<Metadata> {
    const { slug } = await params
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
          url: `https://davidblatt.ca/`,
          locale: 'en_CA',
        },
        twitter: {
          card: 'summary',
          title: 'Puzzle Not Found',
          description: 'The requested puzzle could not be found.',
        },
      }
    }

    const { title, description, path } = getMetadataFields(puzzle)

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
