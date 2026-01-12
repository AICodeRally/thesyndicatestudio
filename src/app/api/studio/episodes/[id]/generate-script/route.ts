import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const prompt = `Generate a video script for The Toddfather - a noir-styled SPM expert.

Series: ${episode.series}
Title: ${episode.title}
Premise: ${episode.premise}

THE TODDFATHER CHARACTER:
- 30 years in Sales Performance Management and AI
- Direct, authoritative, no-nonsense delivery
- Film noir aesthetic: desk lamp, rain on window, purple-black palette
- Speaks like a seasoned operator briefing you late at night
- Uses clear evidence-based frameworks

FORMAT (60-75 seconds total, 9:16 vertical):
Structure as SHOTS with timing, visuals, on-screen text, and voiceover (VO):

SHOT 1 (0:00-0:04): Lamp click-on intro
SHOT 2 (0:04-0:12): Direct-to-camera credentials
SHOT 3 (0:12-0:22): Desk inserts showing core concepts
SHOT 4 (0:22-0:34): The problem with status quo
SHOT 5 (0:34-0:52): The framework/solution reveal
SHOT 6 (0:52-1:06): AI capabilities demo
SHOT 7 (1:06-1:12): CTA

For each shot include:
- Visual: what we see
- On-screen: text overlays
- VO: exact voiceover script

Also include a MASTER SORA PROMPT at the end for video generation.

Tone: Premium, confident founder briefing - not gimmicky noir, but stylish authority.
Write the complete production script with all shots.`

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
