import { createPuzzleMetadataLoader } from '@/app/puzzles/_utils/createPuzzleMetadataLoader'
import { loadMathGridlePuzzle } from './loader'
import { formatDate } from '@/lib/formatDate'

export const generateMathGridleMetadata = createPuzzleMetadataLoader(
  loadMathGridlePuzzle,
  (puzzle) => ({
    title: `Math Gridle - ${formatDate(puzzle.publishedDate)}`,
    description: `Play the Math Gridle puzzle published on ${formatDate(puzzle.publishedDate)}. Fill the 3×3 grid using numbers 1–9 to match row and column sums.`,
    path: `/puzzles/mathgridle/${puzzle.slug}`, // ✅ Add this field
  })
)
