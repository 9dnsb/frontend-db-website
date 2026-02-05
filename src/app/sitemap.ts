import type { MetadataRoute } from 'next'
import { fetchData } from '@/lib/fetchData'

type Post = {
  slug: string
  publishedDate?: string
}

type APIResponse = {
  docs: Post[]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://davidblatt.ca'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base },
    { url: `${base}/about` },
    { url: `${base}/blog` },
  ]

  try {
    const data = await fetchData<APIResponse>('/api/blog-posts')

    const postPages: MetadataRoute.Sitemap = data.docs.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      ...(post.publishedDate && {
        lastModified: post.publishedDate.split('T')[0],
      }),
    }))

    return [...staticPages, ...postPages]
  } catch (err) {
    console.error('Error generating sitemap:', err)
    return staticPages
  }
}
