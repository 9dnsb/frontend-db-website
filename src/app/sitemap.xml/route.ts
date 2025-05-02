// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'
import { fetchData } from '@/lib/fetchData'

type Post = {
  slug: string
  publishedDate?: string
}

type APIResponse = {
  docs: Post[]
}

function generateSitemap(posts: Post[]) {
  const base = 'https://www.davidblatt.ca'

  const urls = posts.map((post) => {
    const lastmod = post.publishedDate?.split('T')[0] ?? ''
    return `
      <url>
        <loc>${base}/blog/${post.slug}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      </url>
    `
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
  </urlset>`
}

export async function GET() {
  try {
    const data = await fetchData<APIResponse>('/api/blog-posts')
    const xml = generateSitemap(data.docs)
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (err) {
    console.error('❌ Error generating sitemap:', err)
    return new NextResponse('Failed to generate sitemap', { status: 500 })
  }
}
