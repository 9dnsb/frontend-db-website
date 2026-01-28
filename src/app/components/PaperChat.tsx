'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type PaperChatProps = {
  vectorStoreId: string | null
  paperTitle: string
}

export function PaperChat({ vectorStoreId, paperTitle }: PaperChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || !vectorStoreId || isLoading) return

      const userMessage = input.trim()
      setInput('')
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            vectorStoreId,
            conversationHistory: messages,
          }),
        })

        if (!response.ok) {
          throw new Error('Chat request failed')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ''

        // Add empty assistant message that we'll update
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === 'delta' && data.text) {
                  assistantMessage += data.text
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    }
                    return updated
                  })
                }

                if (data.type === 'error') {
                  throw new Error(data.message)
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }
      } catch (error) {
        console.error('Chat error:', error)
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove empty assistant message
          {
            role: 'assistant',
            content:
              'Sorry, there was an error processing your question. Please try again.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [input, vectorStoreId, isLoading, messages]
  )

  // Don't render if no vector store
  if (!vectorStoreId) return null

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50">
      {/* Toggle Button - Pill style with text */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white
                     rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Ask AI about the paper"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="text-sm font-medium whitespace-nowrap">Ask AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed sm:absolute bottom-0 right-0 left-0 sm:left-auto sm:bottom-16
                      w-full sm:w-[380px] h-[70vh] sm:h-[520px] max-h-[600px]
                      bg-[var(--background)] border border-[var(--foreground)]/10
                      rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden
                      animate-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Ask about the paper
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-[var(--foreground)]/10 transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5 text-[var(--foreground)]/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[var(--foreground)]/60 truncate mt-1">
              {paperTitle}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-[var(--foreground)]/50 text-sm py-8 px-4">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">Have questions about this research?</p>
                <p className="mt-1 text-xs">
                  Ask anything about the methodology, findings, or conclusions...
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-[var(--foreground)]/10 rounded-bl-sm'
                  }`}
                >
                  {msg.content ||
                    (isLoading && i === messages.length - 1 ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <span
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </span>
                    ) : (
                      ''
                    ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-[var(--foreground)]/10"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 text-sm border border-[var(--foreground)]/20
                           rounded-lg bg-transparent focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500/20 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
