// src/app/blog/page.tsx
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
}

export default async function BlogIndexPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  let posts: Post[] = []

  try {
    const res = await fetch(`${baseUrl}/api/BROKEN-endpoint`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(
        `❌ Failed to fetch blog index: ${res.status} ${res.statusText}`
      )
      return null // or render fallback UI if you want
    }

    const data = await res.json()
    posts = data.docs
  } catch (err) {
    console.error('❌ Blog index fetch threw an error:', err)
    return null
  }

  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
