'use client'

import Link from 'next/link'
import { CTA } from './CTA'
import { formatDate } from '@/lib/formatDate'

type PostCardProps = {
  slug: string
  title: string
  excerpt: string
  publishedDate: string
}

export function PostCard({
  slug,
  title,
  excerpt,
  publishedDate,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="block group">
      <article className="bg-[var(--card-background)] p-4 rounded-lg shadow-sm hover:shadow-md border border-white/5 hover:border-white/10 transition-colors">
        <h3 className="text-lg font-medium group-hover:underline">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {formatDate(publishedDate)}
        </p>
        <p className="text-[var(--foreground)]/70 text-sm mt-2">{excerpt}</p>
        <CTA text="Read post →" />
      </article>
    </Link>
  )
}
