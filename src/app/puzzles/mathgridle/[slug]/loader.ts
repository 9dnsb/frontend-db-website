import { fetchData } from '@/lib/fetchData'

type MathGridlePuzzle = {
  id: string
  slug: string
  publishedDate: string
  grid: number[][]
  rowTargets: number[]
  colTargets: number[]
}

export async function loadMathGridlePuzzle(
  slug: string
): Promise<MathGridlePuzzle | null> {
  try {
    const data = await fetchData<{ docs: MathGridlePuzzle[] }>(
      `/api/mathgridlepuzzles?where[slug][equals]=${slug}`
    )

    const puzzle = data.docs[0]

    if (puzzle) {
      return puzzle
    }
  } catch (err) {
    console.error('❌ Failed to fetch Math Gridle puzzle:', err)
  }

  // Fallback: hardcoded example puzzle if fetch fails
  if (slug === 'example-puzzle-1') {
    return {
      id: 'test-1',
      slug: 'example-puzzle-1',
      publishedDate: '2025-04-27',
      grid: [
        [8, 1, 6],
        [3, 5, 7],
        [4, 9, 2],
      ],
      rowTargets: [24, 15, 6],
      colTargets: [17, 16, 12],
    }
  }

  return null
}
