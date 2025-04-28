import { createPuzzlePage } from '@/app/puzzles/_utils/createPuzzlePage'
import ClientPuzzlePage from './ClientPuzzlePage'
import { loadMathGridlePuzzle } from './loader'
import { formatDate } from '@/lib/formatDate'
import { createDynamicPuzzleMetadataLoader } from '@/app/puzzles/_utils/createDynamicPuzzleMetadataLoader' // ✅ Import

export const generateMetadata = createDynamicPuzzleMetadataLoader(
  loadMathGridlePuzzle,
  (puzzle) => ({
    title: `Math Gridle - ${formatDate(puzzle.publishedDate)}`,
    description: `Play the Math Gridle puzzle published on ${formatDate(puzzle.publishedDate)}. Fill the 3×3 grid using numbers 1–9 to match row and column sums.`,
    path: `/puzzles/mathgridle/${puzzle.slug}`,
  })
)

export default createPuzzlePage(
  loadMathGridlePuzzle,
  (puzzle) => ({
    date: puzzle.publishedDate,
    rowTargets: puzzle.rowTargets,
    colTargets: puzzle.colTargets,
    grid: puzzle.grid,
  }),
  ClientPuzzlePage
)
