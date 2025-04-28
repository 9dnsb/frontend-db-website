'use client'

import { useState } from 'react'

type Props = {
  date: string
  grid: number[][]
  rowTargets: number[]
  colTargets: number[]
}

export default function ClientPuzzlePage({
  date,
  rowTargets,
  colTargets,
}: Props) {
  const [playerGrid, setPlayerGrid] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ])
  const [message, setMessage] = useState('')
  const [showRules, setShowRules] = useState(false)

  function handleChange(row: number, col: number, value: string) {
    if (value === '') {
      setPlayerGrid((prev) => {
        const newGrid = prev.map((inner) => [...inner])
        newGrid[row][col] = 0 // treat empty as 0
        return newGrid
      })
      return
    }

    const num = parseInt(value, 10)
    if (!Number.isInteger(num) || num < 1 || num > 9) return

    setPlayerGrid((prev) => {
      const newGrid = prev.map((inner) => [...inner])
      newGrid[row][col] = num
      return newGrid
    })
  }

  function handleSubmit() {
    const flat = playerGrid.flat()
    const numSet = new Set(flat)

    if (
      flat.length !== 9 ||
      numSet.size !== 9 ||
      [...numSet].some((n) => n < 1 || n > 9)
    ) {
      setMessage('You must use every number 1–9 exactly once.')
      return
    }

    for (let r = 0; r < 3; r++) {
      const sum = playerGrid[r].reduce((a, b) => a + b, 0)
      if (sum !== rowTargets[r]) {
        setMessage('Wrong. Try again.')
        return
      }
    }

    for (let c = 0; c < 3; c++) {
      const sum = playerGrid[0][c] + playerGrid[1][c] + playerGrid[2][c]
      if (sum !== colTargets[c]) {
        setMessage('Wrong. Try again.')
        return
      }
    }

    setMessage('✅ Correct! You solved the puzzle!')
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Math Gridle</h1>

      <div className="text-muted-foreground text-sm mb-2">
        Published: {date}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowRules((prev) => !prev)}
          className="flex items-center space-x-2 text-sm font-bold text-blue-600 hover:underline"
        >
          <span>
            {showRules ? 'Click to Hide Rules' : 'Click to Show Rules'}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              showRules ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            showRules ? 'max-h-96 mt-2' : 'max-h-0'
          }`}
        >
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2 p-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Fill the 3×3 grid using each number 1–9 exactly once.</li>
              <li>Each row must add up to its target sum (on the left).</li>
              <li>Each column must add up to its target sum (above).</li>
              <li>Any correct combination that matches the sums wins!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top Column Sums */}
      <div className="flex justify-center space-x-2 mb-2">
        <div className="w-10" /> {/* Spacer */}
        {colTargets.map((target, i) => (
          <div key={`col-${i}`} className="w-16 text-center font-bold text-lg">
            {target}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-2">
        {playerGrid.map((row, r) => (
          <div
            key={`row-${r}`}
            className="flex items-center justify-center space-x-2"
          >
            <div className="w-10 text-center font-bold text-lg">
              {rowTargets[r]}
            </div>
            {row.map((value, c) => (
              <input
                key={`cell-${r}-${c}`}
                type="text" // ✅ text not number
                inputMode="numeric" // ✅ still numeric keyboard
                pattern="[1-9]*" // ✅ optional: hint to browsers to allow only 1-9
                value={value === 0 ? '' : value}
                onChange={(e) => handleChange(r, c, e.target.value)}
                className="w-16 h-16 text-center border border-gray-300 rounded text-2xl font-bold"
                autoComplete="off"
                spellCheck="false"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex flex-col items-center space-y-4 mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <div className="text-lg font-semibold">{message}</div>
      </div>
    </main>
  )
}
