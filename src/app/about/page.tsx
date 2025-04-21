import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichContent } from '../components/RichContent'
import { PageContainer } from '../components/PageContainer'
import { fetchData } from '@/lib/fetchData'

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
