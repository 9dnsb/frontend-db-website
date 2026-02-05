import { createElement } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes | SerializedBlockNode> = ({
  defaultConverters,
}) => {
  return {
    ...defaultConverters,
    // Override list converter to handle missing tag field
    list: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      // Fallback to ul/ol based on listType if tag is missing
      const tag = node.tag || (node.listType === 'number' ? 'ol' : 'ul')
      return createElement(tag, { className: `list-${node.listType}` }, children)
    },
  }
}

// Helper to find all unique node types in the content
function findNodeTypes(node: unknown, types: Set<string> = new Set()): Set<string> {
  if (node && typeof node === 'object') {
    const n = node as Record<string, unknown>
    if (typeof n.type === 'string') {
      types.add(n.type)
      // Check for headings without tag or lists without tag
      if (n.type === 'heading' && !n.tag) {
        console.error('FOUND HEADING WITHOUT TAG:', n)
      }
      if (n.type === 'list' && !n.tag) {
        console.error('FOUND LIST WITHOUT TAG:', n)
      }
    }
    if (Array.isArray(n.children)) {
      n.children.forEach((child) => findNodeTypes(child, types))
    }
  }
  return types
}

export function RichContent({ content }: { content: SerializedEditorState }) {
  if (!content) {
    return null
  }

  // Debug: log all node types used in content
  const nodeTypes = findNodeTypes(content.root)
  console.log('Node types in content:', Array.from(nodeTypes))

  return (
    <div className="prose prose-lg">
      <RichText data={content} converters={jsxConverters} />
    </div>
  )
}
