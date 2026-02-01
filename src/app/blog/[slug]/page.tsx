import { notFound } from 'next/navigation'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichContent } from '@/app/components/RichContent'
import { formatDate } from '@/lib/formatDate'
import { PageContainer } from '@/app/components/PageContainer'
import { fetchData } from '@/lib/fetchData'
import { generateBlogPostMetadata } from '@/lib/metadata/blogPostMetadata'
import { PaperChat } from '@/app/components/PaperChat'

type Post = {
  id: string
  title: string
  slug: string
  content: SerializedEditorState
  publishedDate: string
  status?: 'draft' | 'published'
  author?: {
    name: string
  }
  sourcePaper?: {
    id: string
    title: string
    vectorStoreId: string | null
    processingStatus: 'pending' | 'processing' | 'ready' | 'error'
  } | null
}

type APIResponse = {
  docs: Post[]
}

export async function generateStaticParams() {
  try {
    const data = await fetchData<APIResponse>('/api/blog-posts')
    return data.docs.map((post) => ({
      slug: post.slug,
    }))
  } catch {
    // Backend unavailable during build - pages will be generated on-demand
    return []
  }
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
    // depth=1 to populate the sourcePaper relationship
    const data = await fetchData<APIResponse>(
      `/api/blog-posts?where[slug][equals]=${slug}&depth=1`
    )

    const post = data.docs?.[0]
    if (!post) {
      console.warn(`⚠️ Blog post not found for slug=${slug}`)
      return notFound()
    }

    // Return 404 for draft posts (not yet published)
    if (post.status === 'draft') {
      console.warn(`⚠️ Blog post is draft, returning 404 for slug=${slug}`)
      return notFound()
    }

    const authorName = post.author?.name || 'David Blatt'

    // Only pass vectorStoreId if paper is ready
    const vectorStoreId =
      post.sourcePaper?.processingStatus === 'ready'
        ? post.sourcePaper.vectorStoreId
        : null

    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2 leading-tight">{post.title}</h1>
        <p className="text-sm text-[var(--foreground)]/60 mb-8">
          {formatDate(post.publishedDate)} · by {authorName}
        </p>
        <RichContent content={post.content} />

        {/* Paper Chat - only renders if vectorStoreId exists */}
        <PaperChat
          vectorStoreId={vectorStoreId}
          paperTitle={post.sourcePaper?.title || post.title}
        />
      </PageContainer>
    )
  } catch (err) {
    console.error(`❌ Exception fetching blog slug=${slug}:`, err)
    return notFound()
  }
}
