import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

export default async function BlogIndexPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  let posts: Post[] = []

  try {
    const res = await fetch(`${baseUrl}/api/blog-posts?sort=-publishedDate`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(
        `❌ Failed to fetch blog index: ${res.status} ${res.statusText}`
      )
      return null
    }

    const data = await res.json()
    posts = data.docs
  } catch (err) {
    console.error('❌ Blog index fetch threw an error:', err)
    return null
  }

  return (
    <main className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">All Blog Posts</h1>

      {posts.length > 0 ? (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <article className="bg-[var(--card-background)] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
      ) : (
        <p>No blog posts found.</p>
      )}
    </main>
  )
}
