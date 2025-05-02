// src/app/components/BlogList.tsx
import { PostCard } from './PostCard'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string
}

export function BlogList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p>No blog posts found.</p>

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard {...post} />
        </li>
      ))}
    </ul>
  )
}
