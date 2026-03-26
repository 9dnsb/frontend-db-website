'use client'

import { useSyncExternalStore } from 'react'

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  return () => observer.disconnect()
}

function getServerSnapshot() {
  return false
}

export function ThemeToggleButton() {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerSnapshot
  )

  const toggleTheme = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1 text-[var(--foreground)]/70">
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </span>
      <button
        onClick={toggleTheme}
        className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${
          isDark ? 'bg-zinc-700' : 'bg-gray-300'
        }`}
        aria-label="Toggle dark mode"
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
            isDark ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
