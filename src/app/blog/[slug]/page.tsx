import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Post = {
  title: string
  slug: string
  content: SerializedEditorState
}

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/blog-posts`)
  const data = await res.json()

  return data.docs.map((post: { slug: string }) => ({
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

    const data = await res.json()
    post = data.docs?.[0]

    if (!post) {
      console.warn(`⚠️ Blog post not found for slug=${slug}`)
      return notFound()
    }
  } catch (err) {
    console.error(`❌ Exception thrown fetching blog slug=${slug}:`, err)
    return notFound()
  }

  return (
    <article style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>{post.title}</h1>
      <RichText data={post.content} />
    </article>
  )
}
