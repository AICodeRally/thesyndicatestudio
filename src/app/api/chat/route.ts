import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { auth } from '../../../../auth'
import { prisma } from '@/lib/db'
import { isLocalLLMAvailable, callLocalLLM } from '@/lib/ai/local'
import { getChatContext } from '@/lib/rag/service'

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages, context } = await req.json()

    // Get user tier and message count
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    })

    const messageCount = await prisma.chatMessage.count({
      where: { userId: session.user.id },
    })

    // Enforce free tier limits (3 messages total)
    if (user?.tier === 'FREE' && messageCount >= 3) {
      return new Response(
        JSON.stringify({
          error: 'MESSAGE_LIMIT_REACHED',
          message: 'You have reached the free tier limit of 3 messages. Upgrade to SPARCC for unlimited chat.',
          upgradeUrl: '/settings/billing',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Build system prompt
    const systemPrompt = `You are The Toddfather, an expert in Intelligent Sales Performance Management (SPM).

Your expertise covers:
- Sales compensation design (payout curves, accelerators, thresholds, draws)
- Sales planning (capacity models, quota setting, territory design)
- Governance (exception handling, dispute resolution, audit trails)
- AI in SPM (when to use AI, governance frameworks, risk assessment)
- Enablement alignment (making training match incentives)

Voice and tone:
- Direct, authoritative, no-nonsense
- Film noir detective explaining how things really work
- Zero tolerance for sales theater or buzzwords
- Focus on mechanics, not motivation
- "Behavior follows pay. Always."

Rules:
1. Answer ONLY SPM-related questions. Refuse off-topic questions politely.
2. Cite specific Counsel when relevant (e.g., "See Counsel: accelerator-timing-risk")
3. Be specific and actionable. No generic advice.
4. If you don't have enough information, ask clarifying questions.
5. Keep answers concise (2-3 paragraphs max unless asked for detail).

${context?.counselTitle ? `\n\nCurrent Context:\nThe user is viewing Counsel: "${context.counselTitle}"\nTopic: ${context.counselOneLiner}\nChannel: ${context.counselChannel}\n` : ''}

${context?.collectionTitle ? `\n\nCurrent Context:\nThe user is viewing Collection: "${context.collectionTitle}"\n` : ''}`

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        role: 'user',
        content: messages[messages.length - 1].content,
        context: context || null,
      },
    })

    // Get RAG context from Counsel library
    const userQuery = messages[messages.length - 1].content
    const ragContext = await getChatContext(userQuery, {
      limit: 3,
      currentCounsel: context?.counselTitle,
    })

    // Add RAG context to system prompt
    const enhancedSystemPrompt = ragContext
      ? `${systemPrompt}\n\n${ragContext}`
      : systemPrompt

    // Try local LLM first (Ollama) for fast, free responses
    const useLocalLLM = await isLocalLLMAvailable()

    if (useLocalLLM && process.env.USE_LOCAL_LLM !== 'false') {
      console.log('Using local Llama + RAG for SPM query')

      try {
        // Use local LLM for response
        const fullPrompt = `${enhancedSystemPrompt}\n\n${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n\n')}`

        const localResponse = await callLocalLLM(fullPrompt, {
          temperature: 0.7,
          maxTokens: 1500,
        })

        // Save assistant message
        await prisma.chatMessage.create({
          data: {
            userId: session.user.id,
            role: 'assistant',
            content: localResponse,
            context: context || null,
          },
        })

        // Return as plain text response (local LLM doesn't stream well)
        return new Response(localResponse, {
          headers: { 'Content-Type': 'text/plain' },
        })
      } catch (error) {
        console.error('Local LLM failed, falling back to OpenAI:', error)
        // Fall through to OpenAI
      }
    }

    // Fallback to OpenAI with streaming
    console.log('Using OpenAI GPT-4o for SPM query')

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      system: enhancedSystemPrompt,
      temperature: 0.7,
      maxSteps: 5,
      onFinish: async ({ text }) => {
        // Save assistant message to database
        await prisma.chatMessage.create({
          data: {
            userId: session.user.id,
            role: 'assistant',
            content: text,
            context: context || null,
          },
        })
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
