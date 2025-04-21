import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichContent({ content }: { content: SerializedEditorState }) {
  return (
    <div className="prose prose-lg">
      <RichText data={content} />
    </div>
  )
}
