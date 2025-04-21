'use client'

type CTAProps = {
  text: string
}

export function CTA({ text }: CTAProps) {
  return (
    <span
      className="inline-block mt-3 px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 
                 dark:bg-blue-900 dark:text-blue-200 transition-all duration-200 transform group-hover:translate-x-1 group-hover:opacity-90"
    >
      {text}
    </span>
  )
}
