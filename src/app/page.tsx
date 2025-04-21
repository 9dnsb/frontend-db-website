// src/app/page.tsx
import { PostCard } from './components/PostCard'
import { fetchData } from '@/lib/fetchData'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

export default async function HomePage() {
  let posts: Post[] = []

  try {
    const data = await fetchData<{ docs: Post[] }>(
      '/api/blog-posts?limit=4&sort=-publishedDate'
    )
    posts = data.docs
  } catch (err) {
    console.error('❌ Failed to fetch home page posts:', err)
    return null
  }

  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Hey, I’m David Blatt.</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          I write articles about how I&apos;m using ChatGPT in my everyday life
          — to solve problems, learn new things, and build projects. I hope you
          leave with something helpful: a tip, a new idea, or even just
          curiosity about how AI might fit into your own life.
        </p>
      </section>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
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
        </section>
      )}
    </div>
  )
}
