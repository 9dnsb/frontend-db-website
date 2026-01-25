import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { RichContent } from '../components/RichContent'
import { PageContainer } from '../components/PageContainer'
import { fetchData } from '@/lib/fetchData'

export const metadata: Metadata = {
  title: 'About | David Blatt',
  description: 'Learn more about David Blatt and his perspective on AI in everyday life.',
  openGraph: {
    title: 'About | David Blatt',
    description: 'Learn more about David Blatt and his perspective on AI in everyday life.',
    url: 'https://davidblatt.ca/about',
    type: 'profile',
  },
}

type AboutMeData = {
  content: SerializedEditorState
}

export default async function AboutPage() {
  const data = await fetchData<AboutMeData>('/api/globals/about-me')

  return (
    <PageContainer>
      <RichContent content={data.content} />
    </PageContainer>
  )
}
