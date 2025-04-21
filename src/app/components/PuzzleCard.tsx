'use client'

import Link from 'next/link'
import { CTA } from './CTA'
import { formatDate } from '../../lib/formatDate'

type PuzzleCardProps = {
  slug: string
  publishedDate: string
}

export function PuzzleCard({ slug, publishedDate }: PuzzleCardProps) {
  return (
    <Link
      href={`/puzzles/${slug}`}
      className="group block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-muted/50 transition"
    >
      <div className="text-lg font-medium">
        Mix & Match: {formatDate(publishedDate)}
      </div>
      <CTA text="Play puzzle →" />
    </Link>
  )
}
