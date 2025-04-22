export type Puzzle = {
  slug: string
  publishedDate: string
  easyGroup: {
    label: string
    words: { word: string }[]
  }
  mediumGroup: {
    label: string
    words: { word: string }[]
  }
  hardGroup: {
    label: string
    words: { word: string }[]
  }
  trickyGroup: {
    label: string
    words: { word: string }[]
  }
}

export type Word = {
  word: string
  difficulty: 'easy' | 'medium' | 'hard' | 'tricky'
}

export type Labels = {
  easy: string
  medium: string
  hard: string
  tricky: string
}
/** 🔄 Fisher-Yates shuffle */
function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** ✅ Convert puzzle to Word[] with difficulty labels */
export function convertToWordArray(puzzle: Puzzle): Word[] {
  return shuffle([
    ...puzzle.easyGroup.words.map((w) => ({
      ...w,
      difficulty: 'easy' as const,
    })),
    ...puzzle.mediumGroup.words.map((w) => ({
      ...w,
      difficulty: 'medium' as const,
    })),
    ...puzzle.hardGroup.words.map((w) => ({
      ...w,
      difficulty: 'hard' as const,
    })),
    ...puzzle.trickyGroup.words.map((w) => ({
      ...w,
      difficulty: 'tricky' as const,
    })),
  ])
}

/** ✅ Extract label names from puzzle */
export function convertToLabels(puzzle: Puzzle): Labels {
  return {
    easy: puzzle.easyGroup.label,
    medium: puzzle.mediumGroup.label,
    hard: puzzle.hardGroup.label,
    tricky: puzzle.trickyGroup.label,
  }
}
