import { createPuzzleMetadataLoader } from '@/app/puzzles/_utils/createPuzzleMetadataLoader'
import { loadOneOffPuzzle } from './loader'
import { formatDate } from '@/lib/formatDate'

export const generateOneOffMetadata = createPuzzleMetadataLoader(
  loadOneOffPuzzle,
  (puzzle) => ({
    title: `One Off - ${formatDate(puzzle.publishedDate)}`,
    description: `Play the One Off puzzle published on ${formatDate(puzzle.publishedDate)}. Change, add, or remove a letter to find all related words.`,
  })
)
