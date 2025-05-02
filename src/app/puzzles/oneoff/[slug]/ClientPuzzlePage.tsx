'use client'

import { capitalize } from '@/lib/capitalize'
import { formatDate } from '@/lib/formatDate'
import { useRef, useState } from 'react'

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
  const [revealAll, setRevealAll] = useState(false)

  const [message, setMessage] = useState<{
    type: 'error' | 'success'
    text: string
  } | null>(null)
  const [showMessage, setShowMessage] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const focusInput = () => inputRef.current?.focus()

  function showTempMessage(
    type: 'error' | 'success',
    text: string,
    duration = 2500
  ) {
    setMessage({ type, text })
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), duration - 500)
    setTimeout(() => setMessage(null), duration)
  }

  function checkGuess() {
    const normalizedGuess = guess.trim().toLowerCase()

    if (correct.includes(normalizedGuess)) {
      showTempMessage('error', '⚠️ Already guessed.')
    } else if (validAnswers.includes(normalizedGuess)) {
      setCorrect((prev) => [...new Set([...prev, normalizedGuess])])
      setGuess('')
      showTempMessage('success', '✅ Good one!')
    } else {
      showTempMessage('error', '❌ Not a valid one-off.')
    }

    focusInput()
  }

  return (
    <main className="container mx-auto py-6">
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
          {capitalize(startingWord)}
        </span>
      </h2>

      <div className="flex flex-wrap gap-6 items-center mt-6">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter a one-off word"
              className="flex-1 px-3 py-2 border rounded"
              spellCheck="false"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  checkGuess()
                }
              }}
              aria-label="Enter one-off word"
            />
            <div className="shrink-0">
              <button
                onClick={checkGuess}
                className="px-5 py-2 rounded bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>

          {message && (
            <p
              key={message.text}
              className={`text-sm transition-opacity duration-500 ease-in-out will-change-opacity ${
                showMessage ? 'opacity-100' : 'opacity-0'
              } ${
                message.type === 'error'
                  ? 'text-red-500 animate-shake'
                  : 'text-green-600'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground whitespace-nowrap">
          ✅ Found: {correct.length} / {validAnswers.length}
        </p>
      </div>

      {correct.length > 0 && (
        <AnswerList
          correct={correct}
          validAnswers={validAnswers}
          revealAll={revealAll}
        />
      )}

      {!revealAll && correct.length < validAnswers.length && (
        <button
          onClick={() => setRevealAll(true)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          🔍 Click to show all answers
        </button>
      )}

      {correct.length === validAnswers.length && (
        <p className="mt-6 text-center text-green-600 font-bold text-lg">
          🎉 Puzzle solved! You found all {validAnswers.length} words.
        </p>
      )}
    </main>
  )
}

function AnswerList({
  correct,
  validAnswers,
  revealAll,
}: {
  correct: string[]
  validAnswers: string[]
  revealAll: boolean
}) {
  const listClass =
    'list-disc list-inside columns-2 sm:columns-3 gap-x-6 break-inside-avoid text-sm'
  const remaining = validAnswers.filter((w) => !correct.includes(w))

  return (
    <div className="mt-4">
      <h2 className="text-sm font-medium mb-1">✅ Found:</h2>
      <ul className={listClass}>
        {correct.map((w) => (
          <li key={w}>{capitalize(w)}</li>
        ))}
      </ul>

      {revealAll && (
        <div className="mt-6">
          <h2 className="text-sm font-medium mb-1">📝 All Possible Answers:</h2>
          <ul className={listClass}>
            {remaining.map((w) => (
              <li key={w} className="text-muted-foreground italic">
                {capitalize(w)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
