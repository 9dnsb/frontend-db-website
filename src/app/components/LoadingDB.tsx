'use client'

import { useState, useEffect, useRef } from 'react'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0'

function getRandomChar() {
  return characters[Math.floor(Math.random() * characters.length)]
}

interface LoadingDBProps {
  shouldFinish?: boolean
  onFinished?: () => void
}

export default function LoadingDB({
  shouldFinish = false,
  onFinished,
}: LoadingDBProps) {
  // Start with static placeholder to avoid hydration mismatch
  const [displayText, setDisplayText] = useState('**')
  const [isGlitching, setIsGlitching] = useState(true)
  const hasFinishedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start scrambling only after mount (client-side)
  useEffect(() => {
    // Use interval for all updates (including first one) to avoid sync setState warning
    intervalRef.current = setInterval(() => {
      if (!hasFinishedRef.current) {
        setDisplayText(`${getRandomChar()}${getRandomChar()}`)
      }
    }, 80)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // When shouldFinish becomes true, resolve to "DB"
  useEffect(() => {
    if (shouldFinish && !hasFinishedRef.current) {
      hasFinishedRef.current = true

      // Stop the scramble
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Show "DB" and pause before calling onFinished
      setTimeout(() => {
        setDisplayText('DB')
        setIsGlitching(false)

        setTimeout(() => {
          if (onFinished) {
            onFinished()
          }
        }, 1000)
      }, 0)
    }
  }, [shouldFinish, onFinished])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[var(--background)]">
      <div className="relative">
        {/* Main text */}
        <span
          className={`
            font-mono text-6xl font-bold tracking-wider
            text-foreground
            ${isGlitching ? 'animate-glitch' : ''}
          `}
        >
          {displayText}
        </span>

        {/* Glitch layers (offset colored copies) */}
        {isGlitching && (
          <>
            <span
              className="absolute inset-0 font-mono text-6xl font-bold tracking-wider text-cyan-500 opacity-70 animate-glitch-1"
              aria-hidden="true"
            >
              {displayText}
            </span>
            <span
              className="absolute inset-0 font-mono text-6xl font-bold tracking-wider text-red-500 opacity-70 animate-glitch-2"
              aria-hidden="true"
            >
              {displayText}
            </span>
          </>
        )}

        {/* Blinking cursor */}
        <span className="font-mono text-6xl font-bold animate-blink text-foreground">
          _
        </span>
      </div>
    </div>
  )
}
