import { RichText } from '@payloadcms/richtext-lexical/react'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes | SerializedBlockNode> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
})

export function RichContent({ content }: { content: SerializedEditorState }) {
  if (!content) {
    return null
  }

  return (
    <div className="prose prose-lg">
      <RichText data={content} converters={jsxConverters} />
    </div>
  )
}
