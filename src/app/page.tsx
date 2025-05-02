import { getBlogPosts } from '@/lib/getBlogPosts'
import { BlogList } from './components/BlogList'

export default async function HomePage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold mb-4">Hey, I’m David Blatt.</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          I write articles about how I&apos;m using ChatGPT in my everyday life
          — to solve problems, learn new things, and build projects.
        </p>
      </section>

      {posts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 relative after:block after:w-10 after:h-0.5 after:bg-blue-500 after:mt-2">
            Recent Posts
          </h2>
          <BlogList posts={posts} />
        </section>
      )}
    </div>
  )
}
