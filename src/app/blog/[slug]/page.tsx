import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Post = {
  id: string
  title: string
  slug: string
  content: SerializedEditorState
  publishedDate: string
  author?: {
    name: string
  }
}

type APIResponse = {
  docs: Post[]
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/blog-posts`)
  const data: APIResponse = await res.json()

  return data.docs.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  let post: Post | undefined = undefined

  try {
    const res = await fetch(
      `${baseUrl}/api/blog-posts?where[slug][equals]=${slug}`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) {
      console.error(`❌ Blog fetch failed: ${res.status} for slug=${slug}`)
      return notFound()
    }

    const data: APIResponse = await res.json()
    post = data.docs?.[0]

    if (!post) {
      console.warn(`⚠️ Blog post not found for slug=${slug}`)
      return notFound()
    }
  } catch (err) {
    console.error(`❌ Exception thrown fetching blog slug=${slug}:`, err)
    return notFound()
  }

  const formattedDate = new Date(post.publishedDate).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const authorName = post.author?.name || 'David Blatt'

  return (
    <main className="max-w-3xl mx-auto px-6 py-2">
      <h1 className="text-3xl font-bold mb-2 leading-tight">{post.title}</h1>

      <p className="text-sm text-[var(--foreground)]/60 mb-8">
        {formattedDate} · by {authorName}
      </p>

      <div className="prose prose-lg ">
        <RichText data={post.content} />
      </div>
    </main>
  )
}
