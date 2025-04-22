'use client'

import { formatDate } from '@/lib/formatDate'
import { useState } from 'react'

export default function ClientPuzzlePage({
  date,
  startingWord,
  validAnswers,
}: {
  date: string
  startingWord: string
  validAnswers: string[]
}) {
  const [guess, setGuess] = useState('')
  const [correct, setCorrect] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function checkGuess() {
    if (validAnswers.includes(guess.toLowerCase())) {
      setCorrect((prev) => [...new Set([...prev, guess.toLowerCase()])])
      setGuess('')
      setError(null)
    } else {
      setError('❌ Not a valid one-off.')
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">One Off Puzzle</h1>

      <div className="text-sm text-muted-foreground mb-4 space-y-1">
        <p>
          🧠 Find all real English words that are one letter away from the
          starting word.
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>Change one letter</li>
          <li>Add one letter</li>
          <li>Remove one letter</li>
        </ul>
        <p>No letter reordering. All answers must be real words.</p>
      </div>

      <p className="text-muted-foreground mb-2">
        Published: {formatDate(date)}
      </p>

      <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4">
        Starting Word:{' '}
        <span className="font-bold tracking-wide">
          {startingWord.charAt(0).toUpperCase() + startingWord.slice(1)}
        </span>
      </h2>

      <div className="flex items-center gap-4 mt-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter a one-off word"
          className="flex-1 px-3 py-2 border rounded"
          //       👆 adds horizontal padding
        />

        <button
          onClick={checkGuess}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          ✅ Found: {correct.length} / {validAnswers.length}
        </p>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {correct.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-medium mb-1">✅ Found:</h2>
          <ul className="list-disc list-inside">
            {correct.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          {correct.length === validAnswers.length && (
            <p className="mt-6 text-center text-green-600 font-bold text-lg">
              🎉 Puzzle solved! You found all {validAnswers.length} words.
            </p>
          )}
        </div>
      )}
    </main>
  )
}
