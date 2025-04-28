import { createPuzzlePage } from '@/app/puzzles/_utils/createPuzzlePage'
import ClientPuzzlePage from './ClientPuzzlePage'
import { loadOneOffPuzzle } from './loader'
import { formatDate } from '@/lib/formatDate'
import { createDynamicPuzzleMetadataLoader } from '@/app/puzzles/_utils/createDynamicPuzzleMetadataLoader' // ✅ Import

export const generateMetadata = createDynamicPuzzleMetadataLoader(
  loadOneOffPuzzle,
  (puzzle) => ({
    title: `One Off - ${formatDate(puzzle.publishedDate)}`,
    description: `Play the One Off puzzle published on ${formatDate(puzzle.publishedDate)}. Change, add, or remove a letter to find all related words.`,
    path: `/puzzles/oneoff/${puzzle.slug}`,
  })
)

export default createPuzzlePage(
  loadOneOffPuzzle,
  (puzzle) => ({
    date: puzzle.publishedDate,
    startingWord: puzzle.startingWord,
    validAnswers: puzzle.validAnswers.map((a) => a.word),
  }),
  ClientPuzzlePage
)
