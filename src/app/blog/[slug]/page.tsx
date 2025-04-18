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
  const { slug } = await params // ✅ THIS IS THE FIX

  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  const res = await fetch(
    `${baseUrl}/api/blog-posts?where[slug][equals]=${slug}`,
    {
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return notFound()

  const data = await res.json()
  const post: Post | undefined = data.docs?.[0]

  if (!post) return notFound()

  return (
    <article style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>{post.title}</h1>
      <RichText data={post.content} />
    </article>
  )
}
