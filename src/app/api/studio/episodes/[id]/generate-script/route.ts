import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'
import { isAdminUser } from '@/lib/authz'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(userId))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params

    const episode = await prisma.episode.findUnique({
      where: { id },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Update status to GENERATING
    await prisma.episode.update({
      where: { id },
      data: { status: 'GENERATING' },
    })

    // Generate script with AI
    const prompt = `Generate a video script for a YouTube video about Sales Performance Management (SPM).

Series: ${episode.series}
Title: ${episode.title}
Premise: ${episode.premise}

Structure the script with these sections:
1. **Hook** (15 seconds) - Grab attention immediately
2. **Intro** (30 seconds) - Set context and preview
3. **Body** (3-5 main points, 6-8 minutes total)
4. **Summary** (1 minute) - Recap key takeaways
5. **CTA** (15 seconds) - What to do next

Tone: Direct, authoritative, no-nonsense. Like a film noir detective explaining how things really work.
Voice: "The Toddfather" - experienced SPM practitioner who's seen it all.

Write ONLY the script content. No meta-commentary. Use clear section headers.`

    const { text } = await generateText({
      model: gateway('openai/gpt-4o'),
      prompt,
      providerOptions: getProviderOptions('content'),
    })

    // Save script to database
    const script = await prisma.script.create({
      data: {
        episodeId: episode.id,
        content: text,
        isCanonical: true,
        version: 1,
      },
    })

    // Link as canonical script
    await prisma.episode.update({
      where: { id },
      data: {
        canonicalScriptId: script.id,
        status: 'PENDING_REVIEW',
      },
    })

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Error generating script:', error)

    // Reset status on error
    const { id } = await params
    await prisma.episode.update({
      where: { id },
      data: { status: 'DRAFT' },
    })

    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    )
  }
}
