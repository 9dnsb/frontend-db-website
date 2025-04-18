// src/app/blog/page.tsx
import Link from 'next/link'

type Post = {
  id: string
  title: string
  slug: string
}

export default async function BlogIndexPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/blog-posts`, {
    next: { revalidate: 60 },
  })
  const data = await res.json()
  const posts: Post[] = data.docs

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
