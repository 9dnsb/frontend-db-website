import { PostCard } from '../components/PostCard'
import { fetchData } from '@/lib/fetchData'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

export default async function BlogIndexPage() {
  let posts: Post[] = []

  try {
    const data = await fetchData<{ docs: Post[] }>(
      '/api/blog-posts?sort=-publishedDate'
    )
    posts = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch blog index:', err)
    return null
  }

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>

      {posts.length > 0 ? (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                publishedDate={post.publishedDate}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No blog posts found.</p>
      )}
    </main>
  )
}
