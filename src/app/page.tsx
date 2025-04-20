// src/app/page.tsx
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

async function getPosts(): Promise<Post[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(
    `${baseUrl}/api/blog-posts?limit=4&sort=-publishedDate`,
    {
      next: { revalidate: 60 },
    }
  )
  const data = await res.json()
  return data.docs
}

export default async function HomePage() {
  const posts = await getPosts()

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
                <Link href={`/blog/${post.slug}`} className="block group">
                  <article className="bg-[var(--card-background)] p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="text-[var(--foreground)]/70 text-sm mt-1">
                      {post.excerpt}
                    </p>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
