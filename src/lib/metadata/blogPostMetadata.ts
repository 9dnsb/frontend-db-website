import type { Metadata } from 'next'
import { fetchData } from '@/lib/fetchData'
import { formatDate } from '@/lib/formatDate'

type Post = {
  id: string
  title: string
  slug: string
  publishedDate: string
  author?: {
    name: string
  }
}

type APIResponse = {
  docs: Post[]
}

export async function generateBlogPostMetadata(
  slug: string
): Promise<Metadata> {
  try {
    const data = await fetchData<APIResponse>(
      `/api/blog-posts?where[slug][equals]=${slug}`
    )

    const post = data.docs?.[0]
    if (!post) {
      return {
        title: 'Not Found',
        description: 'This blog post does not exist.',
      }
    }

    const authorName = post.author?.name ?? 'David Blatt'

    return {
      title: post.title,
      description: `Read "${post.title}" by ${authorName}.`,
      openGraph: {
        title: post.title,
        description: `Written by ${authorName} on ${formatDate(post.publishedDate)}.`,
        type: 'article',
        url: `https://davidblatt.ca/blog/${post.slug}`,
        siteName: 'David Blatt',
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description: `A blog post by ${authorName}`,
      },
    }
  } catch (err) {
    console.error(`❌ Failed to generate metadata for slug=${slug}:`, err)
    return {
      title: 'Error',
      description: 'There was an issue loading this blog post.',
    }
  }
}
