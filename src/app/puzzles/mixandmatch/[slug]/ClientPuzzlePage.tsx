'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Labels, Word } from './loader'
import { formatDate } from '@/lib/formatDate'

function shuffle<T>(array: T[]): T[] {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function ClientPuzzlePage({
  words,
  date,
  labels,
}: {
  words: Word[]
  date: string
  labels: Labels
}) {
  const [remaining, setRemaining] = useState<Word[]>(words)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [shake, setShake] = useState(false)
  const [solvedGroups, setSolvedGroups] = useState<string[]>([])

  function toggleWord(word: string) {
    setSelected((prev) =>
      prev.includes(word)
        ? prev.filter((w) => w !== word)
        : prev.length < 4
          ? [...prev, word]
          : prev
    )
  }

  function checkGroup() {
    if (selected.length !== 4) {
      setMessage('⚠️ Select exactly 4 words.')
      return
    }

    const selectedWords = remaining.filter((w) => selected.includes(w.word))
    const group = selectedWords[0].difficulty
    const allMatch = selectedWords.every((w) => w.difficulty === group)

    if (allMatch) {
      setRemaining((prev) => prev.filter((w) => !selected.includes(w.word)))
      setSelected([])
      const label = labels[group]
      setMessage(`✅ Correct group: ${label}`)
      setSolvedGroups((prev) => [...prev, label])
      setShake(false)
    } else {
      setMessage('❌ Try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function getColorForGroup(label: string): string {
    switch (label) {
      case labels.easy:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case labels.medium:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case labels.hard:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case labels.tricky:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Mix & Match Puzzle</h1>
      <p className="text-muted-foreground mb-4">
        Published: {formatDate(date)}
      </p>

      <motion.div
        className="grid grid-cols-4 gap-3"
        variants={{
          shake: { x: [0, -10, 10, -8, 8, -4, 4, 0] },
          still: { x: 0 },
        }}
        animate={shake ? 'shake' : 'still'}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {remaining.map(({ word }) => {
            const isSelected = selected.includes(word)
            return (
              <motion.button
                key={word}
                onClick={() => toggleWord(word)}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className={`text-sm text-center break-words px-2 py-2 min-h-[3.5rem] border rounded-lg font-medium transition w-full ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted hover:bg-muted/50'
                }`}
              >
                {word}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <p className="mt-4 text-sm text-muted-foreground">
        Selected: {selected.join(', ') || 'None'}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={checkGroup}
          className="px-4 py-2 rounded font-semibold transition
             bg-gray-900 text-white hover:bg-gray-700
             dark:bg-white dark:text-black dark:hover:bg-gray-200
             border border-gray-300 dark:border-gray-700"
        >
          Check Group
        </button>

        <button
          onClick={() => setRemaining(shuffle([...remaining]))}
          className="px-4 py-2 rounded font-semibold transition
             bg-gray-100 text-gray-800 hover:bg-gray-200
             dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
             border border-gray-300 dark:border-gray-700"
        >
          Shuffle
        </button>
      </div>

      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-sm font-medium"
        >
          {message}
        </motion.p>
      )}

      {solvedGroups.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Solved Groups:
          </h2>
          <ul className="flex flex-wrap gap-2">
            {solvedGroups.map((label) => (
              <li
                key={label}
                className={`px-2 py-1 text-xs font-medium rounded ${getColorForGroup(
                  label
                )}`}
              >
                ✅ {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {remaining.length === 0 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="mt-4 text-green-600 font-bold text-center"
        >
          🎉 Puzzle solved! Great job.
        </motion.p>
      )}
    </main>
  )
}
