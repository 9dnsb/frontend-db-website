import { createPuzzlePage } from '@/app/puzzles/_utils/createPuzzlePage'
import ClientPuzzlePage from './ClientPuzzlePage'
import { loadMathGridlePuzzle } from './loader'

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
