import { getBlogPosts } from '@/lib/getBlogPosts'
import { BlogList } from '../components/BlogList'

export default async function BlogIndexPage() {
  const posts = await getBlogPosts()

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>
      <BlogList posts={posts} />
    </main>
  )
}
