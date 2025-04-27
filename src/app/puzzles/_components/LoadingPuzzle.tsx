'use client'

export default function LoadingPuzzle() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold animate-pulse">
          Loading puzzle...
        </div>
      </div>
    </main>
  )
}
