import OpenAI from 'openai'
import { NextRequest } from 'next/server'

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
      // Low verbosity for conversational, concise responses
      text: {
        verbosity: 'low',
      },
      instructions: `You are a friendly research assistant having a conversation about an academic paper. Answer using ONLY information from the paper.

<response_style>
- Keep responses short and conversational—1-3 sentences is ideal.
- Answer like you're chatting, not writing an essay. No long paragraphs.
- If more detail is needed, the user will ask follow-up questions.
- Skip formalities and filler phrases. Get to the point.
- Use simple language. Avoid academic jargon unless necessary.
</response_style>

<accuracy>
- If you can't find it in the paper, say so briefly.
- Never make things up.
</accuracy>

<formatting>
- Only use markdown (bullets, bold) when it genuinely helps clarity.
- Prefer plain text for short answers.
</formatting>`,
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
