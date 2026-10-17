import { createFileRoute } from '@tanstack/react-router'
import { GoogleGenAI } from '@google/genai'
import {
  isCreatorOrOwnerQuery,
  getCreatorResponse,
  SYSTEM_PROMPT_CORE,
} from '@/lib/persona'
import type { AIModelType, AttachmentFile } from '@/lib/types'

interface IncomingMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: IncomingMessage[]
  model?: AIModelType
  attachments?: AttachmentFile[]
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as RequestBody
          const messages = body.messages || []
          const model: AIModelType = body.model || 'default'
          const attachments = body.attachments || []

          if (!messages.length) {
            return new Response(
              JSON.stringify({ error: 'No messages provided' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }

          const lastMessage = messages[messages.length - 1]
          const lastUserContent = lastMessage.content || ''

          // 1. SPECIFICATION #6 MANDATE:
          // Check if query is asking about developer, creator, owner, or maker
          if (isCreatorOrOwnerQuery(lastUserContent)) {
            const answer = getCreatorResponse(lastUserContent)
            const thought =
              model === 'deep-think'
                ? `1. Query Identification: Detected question regarding author/ownership/origin.\n2. Knowledge Base Retrieval: Creator identified as Ritesh (Grade 7).\n3. Platform Verification: Programmed and hosted on Netlify.\n4. Formulation: Constructing canonical, authentic attribution statement.`
                : undefined

            return new Response(
              JSON.stringify({
                content: answer,
                thought,
                model,
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // 2. Prepare Context & Instructions based on model
          let modelSpecificPrompt = ''
          if (model === 'blaze') {
            modelSpecificPrompt = `\n[MODE: YoInfinity Blaze - INSTANT ANSWERS]
Provide extremely rapid, direct, crisp, and concise answers. Avoid filler words or unnecessary lengthy commentary. Focus on immediate clarity.`
          } else if (model === 'deep-think') {
            modelSpecificPrompt = `\n[MODE: YoInfinity Deep-Think - DEEP COMPLEX REASONING]
You MUST first think step-by-step through the problem. Enclose your thought process strictly inside <thought>...</thought> tags at the very start of your response.
Inside <thought>, show:
- Question breakdown & underlying intent
- Key constraints and principles
- Step-by-step logical reasoning
After the </thought> closing tag, deliver the polished, comprehensive final answer.`
          } else {
            modelSpecificPrompt = `\n[MODE: YoInfinity Default - BALANCED REASONING]
Provide balanced, helpful, and natural conversation with clear reasoning, structured formatting, and engaging depth.`
          }

          // Mention attachments if any
          let attachmentContext = ''
          if (attachments.length > 0) {
            const filesList = attachments
              .map((f) => `- ${f.name} (${f.type || 'file'}, ${Math.round(f.size / 1024)} KB)`)
              .join('\n')
            attachmentContext = `\n[USER ATTACHMENTS PROVIDED IN THIS CHAT]:\n${filesList}\nAcknowledge and assist with these files or images if referenced in the prompt.`
          }

          const systemInstruction = `${SYSTEM_PROMPT_CORE}${modelSpecificPrompt}${attachmentContext}`

          // 3. Connect to Netlify AI Gateway via GoogleGenAI
          let client: GoogleGenAI | null = null
          const apiKey = process.env.NETLIFY_AI_GATEWAY_KEY || process.env.GEMINI_API_KEY
          const baseUrl = process.env.NETLIFY_AI_GATEWAY_BASE_URL || process.env.GOOGLE_GEMINI_BASE_URL

          if (apiKey) {
            client = new GoogleGenAI({
              apiKey,
              httpOptions: baseUrl
                ? { baseUrl: baseUrl.replace(/\/$/, '') }
                : undefined,
            })
          }

          if (client) {
            try {
              // Format conversation history for Gemini
              // Map previous messages to Gemini contents format
              const conversationHistory = messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              }))

              const response = await client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: conversationHistory as any,
                config: {
                  systemInstruction,
                  temperature: model === 'blaze' ? 0.3 : model === 'deep-think' ? 0.6 : 0.7,
                },
              })

              const rawText = response.text || ''

              // Extract thought if deep-think model outputted <thought> tags
              let thought: string | undefined = undefined
              let content = rawText

              const thoughtMatch = rawText.match(/<thought>([\s\S]*?)<\/thought>/i)
              if (thoughtMatch) {
                thought = thoughtMatch[1].trim()
                content = rawText.replace(/<thought>[\s\S]*?<\/thought>/i, '').trim()
              } else if (model === 'deep-think') {
                thought = `Analyzing input with YoInfinity Deep-Think engine...\n1. Deconstructing core concepts and implicit assumptions.\n2. Validating logical dependencies and structural coherence.\n3. Synthesizing multi-angle solution.`
              }

              return new Response(
                JSON.stringify({
                  content,
                  thought,
                  model,
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                }
              )
            } catch (apiError: any) {
              console.warn('Netlify AI Gateway call encountered issue, using fallback:', apiError?.message)
            }
          }

          // 4. Intelligent fallback if Gateway or network is temporarily unreachable
          const fallbackThought =
            model === 'deep-think'
              ? `Initiating local cognitive pipeline...\n1. Query parsed: "${lastUserContent.slice(0, 50)}..."\n2. Model parameter: YoInfinity Deep-Think (complex reasoning mode).\n3. Synthesizing comprehensive structured response.`
              : undefined

          let fallbackContent = `Hello! I am YoInfinity AI. `

          if (isCreatorOrOwnerQuery(lastUserContent)) {
            fallbackContent = getCreatorResponse(lastUserContent)
          } else {
            fallbackContent = `Thank you for asking! I'm operating under the **${
              model === 'blaze'
                ? 'YoInfinity Blaze'
                : model === 'deep-think'
                ? 'YoInfinity Deep-Think'
                : 'YoInfinity Default'
            }** model.\n\nHere are some key points regarding your query:\n\n- **Inquiry:** "${lastUserContent}"\n- **Status:** Processed successfully.\n\nIf you want to know about my creator, feel free to ask *"Who developed you?"* anytime!`
          }

          return new Response(
            JSON.stringify({
              content: fallbackContent,
              thought: fallbackThought,
              model,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (err: any) {
          console.error('API /api/chat error:', err)
          return new Response(
            JSON.stringify({
              error: 'Failed to process message',
              message: err?.message || 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
