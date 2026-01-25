import type { Metadata } from 'next'
import { getBlogPosts } from '@/lib/getBlogPosts'
import { BlogList } from '../components/BlogList'

export const metadata: Metadata = {
  title: 'Blog | David Blatt',
  description: 'Articles and thoughts on AI and how it might fit into your everyday life.',
  openGraph: {
    title: 'Blog | David Blatt',
    description: 'Articles and thoughts on AI and how it might fit into your everyday life.',
    url: 'https://davidblatt.ca/blog',
    type: 'website',
  },
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts()

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>
      <BlogList posts={posts} />
    </main>
  )
}
