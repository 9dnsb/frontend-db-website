'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Word = {
  word: string
  difficulty: 'easy' | 'medium' | 'hard' | 'tricky'
}

export default function ClientPuzzlePage({
  words,
  date,
}: {
  words: Word[]
  date: string
}) {
  const [remaining, setRemaining] = useState<Word[]>(words)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

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
      setMessage(`✅ Correct group: ${group.toUpperCase()}`)
      setShake(false)
    } else {
      setMessage('❌ Try again.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Connections Puzzle</h1>
      <p className="text-muted-foreground mb-4">
        Published:{' '}
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
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
                className={`border rounded-lg p-3 text-center font-medium transition ${
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

      <button
        onClick={checkGroup}
        className="mt-4 px-4 py-2 rounded font-semibold transition
             bg-gray-900 text-white hover:bg-gray-700
             dark:bg-white dark:text-black dark:hover:bg-gray-200
             border border-gray-300 dark:border-gray-700"
      >
        Check Group
      </button>

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
