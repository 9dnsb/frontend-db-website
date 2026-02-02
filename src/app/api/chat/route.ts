import OpenAI from 'openai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type ChatRequest = {
  message: string
  vectorStoreId: string
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
}

export async function POST(request: NextRequest) {
  try {
    const { message, vectorStoreId, conversationHistory }: ChatRequest =
      await request.json()

    if (!vectorStoreId) {
      return Response.json(
        { error: 'No paper associated with this post' },
        { status: 400 }
      )
    }

    if (!message?.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build input messages from conversation history
    const input = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await openai.responses.create({
      model: 'gpt-5.2',
      max_output_tokens: 16384,
      truncation: 'auto',
      // GPT-5.2 settings: reasoning effort 'none' for fast responses (matching gpt-4.1 behavior)
      reasoning: {
        effort: 'none',
      },
      // Medium verbosity for balanced, informative responses
      text: {
        verbosity: 'medium',
      },
      instructions: `You are a helpful research assistant. Answer questions about the academic paper using ONLY information found in the paper.

<uncertainty_and_ambiguity>
- If the answer isn't in the paper, clearly state that you couldn't find that information.
- Never fabricate quotes, statistics, or details not present in the source material.
- When uncertain, use language like "Based on the provided context..." rather than absolute claims.
</uncertainty_and_ambiguity>

<output_verbosity_spec>
- Be concise but thorough - aim for focused, well-structured answers.
- Use markdown formatting for clarity when appropriate.
- When citing information, reference the specific section or page when possible.
- Avoid unnecessary preamble or repetition of the question.
</output_verbosity_spec>

Guidelines:
- If asked about topics outside the paper's scope, politely redirect to what the paper does cover.
- Provide concrete examples and specific findings from the paper when available.`,
      input,
      tools: [
        {
          type: 'file_search',
          vector_store_ids: [vectorStoreId],
        },
      ],
      stream: true,
    })

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of response) {
            // Handle text deltas
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'delta', text: event.delta })}\n\n`
                )
              )
            }

            // Handle completion
            if (event.type === 'response.completed') {
              const response = event.response
              console.log('Response completed:', {
                status: response.status,
                incomplete_details: response.incomplete_details,
                usage: response.usage,
              })

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: 'done',
                    responseId: response.id,
                    status: response.status,
                    incomplete_details: response.incomplete_details,
                  })}\n\n`
                )
              )
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`
            )
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Failed to process question' },
      { status: 500 }
    )
  }
}
