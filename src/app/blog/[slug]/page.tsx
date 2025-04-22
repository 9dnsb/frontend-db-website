import { notFound } from 'next/navigation'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichContent } from '@/app/components/RichContent'
import { formatDate } from '@/lib/formatDate'
import { PageContainer } from '@/app/components/PageContainer'
import { fetchData } from '@/lib/fetchData'
import { generateBlogPostMetadata } from '@/lib/metadata/blogPostMetadata'

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
  const data = await fetchData<APIResponse>('/api/blog-posts')
  return data.docs.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return generateBlogPostMetadata(slug)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const data = await fetchData<APIResponse>(
      `/api/blog-posts?where[slug][equals]=${slug}`
    )

    const post = data.docs?.[0]
    if (!post) {
      console.warn(`⚠️ Blog post not found for slug=${slug}`)
      return notFound()
    }

    const authorName = post.author?.name || 'David Blatt'

    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2 leading-tight">{post.title}</h1>
        <p className="text-sm text-[var(--foreground)]/60 mb-8">
          {formatDate(post.publishedDate)} · by {authorName}
        </p>
        <RichContent content={post.content} />
      </PageContainer>
    )
  } catch (err) {
    console.error(`❌ Exception fetching blog slug=${slug}:`, err)
    return notFound()
  }
}
