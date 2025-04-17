import Link from 'next/link'

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/blog-posts')
  const data = await res.json()

  return {
    props: {
      posts: data.docs,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogIndex({ posts }: { posts: any[] }) {
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
