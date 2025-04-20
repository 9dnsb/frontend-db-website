import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type AboutMeData = {
  content: SerializedEditorState
}

export default async function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/globals/about-me`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch About Me content')
  }

  const data: AboutMeData = await res.json()

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
        <RichText data={data.content} />
      </div>
    </main>
  )
}
