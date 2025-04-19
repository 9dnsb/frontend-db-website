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
  const [featured, ...recent] = posts

  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <h1 className="text-4xl font-bold mb-4">Hey, I’m David Blatt.</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          I write technical articles, tutorials, personal essays, and thoughts
          on code, learning, and life.
        </p>
      </section>

      {/* Featured Post */}
      {featured && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article className="p-6 rounded-xl bg-[var(--background)]">
              <h3 className="text-xl font-semibold group-hover:underline">
                {featured.title}
              </h3>
              <p className="text-[var(--foreground)]/80 mt-2">
                {featured.excerpt}
              </p>
              <span className="text-sm text-neutral-500 block mt-4">
                {new Date(featured.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </article>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      {recent.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <ul className="space-y-6">
            {recent.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <article className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-[var(--background)] border border-neutral-100">
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
