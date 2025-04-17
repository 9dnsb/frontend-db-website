import { GetStaticPaths, GetStaticProps } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Post = {
  title: string
  slug: string
  content: SerializedEditorState
}

export const getStaticPaths: GetStaticPaths = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/api/blog-posts`)
  const data = await res.json()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paths = data.docs.map((post: any) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const slug = params?.slug
  const res = await fetch(
    `${baseUrl}/api/blog-posts?where[slug][equals]=${slug}`
  )
  const data = await res.json()

  return {
    props: {
      post: data.docs[0],
    },
  }
}

// ✅ Make this a synchronous component
export default function BlogPost({ post }: { post: Post }) {
  return (
    <article style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>{post.title}</h1>
      <RichText data={post.content} />
    </article>
  )
}
