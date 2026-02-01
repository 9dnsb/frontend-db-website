// src/lib/getBlogPosts.ts
import { fetchData } from './fetchData'

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

export async function getBlogPosts(): Promise<Post[]> {
  try {
    const data = await fetchData<{ docs: Post[] }>(
      `/api/blog-posts?sort=-publishedDate&where[publishedDate][less_than_equal]=${new Date().toISOString()}&where[status][equals]=published`
    )
    return data.docs
  } catch (err) {
    console.error('❌ Failed to fetch blog posts:', err)
    return []
  }
}
