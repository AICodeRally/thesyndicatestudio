import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../auth'
import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'
import { isAdminUser } from '@/lib/authz'

const CUT_FORMATS = {
  YT_LONG: { duration: 600, name: 'YouTube Long-Form', specs: '7-10 minutes, educational deep dive' },
  YT_SHORT: { duration: 35, name: 'YouTube Shorts', specs: '30-60 seconds, vertical, hook-first' },
  TIKTOK: { duration: 35, name: 'TikTok', specs: '15-60 seconds, fast-paced, pattern interrupt' },
  X: { duration: 60, name: 'X (Twitter)', specs: '30-90 seconds, punchy, quotable' },
  LINKEDIN: { duration: 120, name: 'LinkedIn', specs: '1-3 minutes, professional, actionable' },
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    if (!episode.canonicalScript) {
      return NextResponse.json(
        { error: 'No canonical script found. Generate script first.' },
        { status: 400 }
      )
    }

    const { formats = ['YT_SHORT', 'TIKTOK', 'LINKEDIN'] } = await request.json()

    const cuts = []

    // Generate each cut format
    for (const format of formats) {
      const formatConfig = CUT_FORMATS[format as keyof typeof CUT_FORMATS]

      if (!formatConfig) continue

      const prompt = `Adapt this video script for ${formatConfig.name}.

Original Script:
${episode.canonicalScript.content}

Platform Requirements:
- Duration: ${formatConfig.duration} seconds (${formatConfig.specs})
- Keep the core message and Toddfather voice
- Optimize for ${formatConfig.name} audience and format

Output ONLY the adapted script. No meta-commentary.`

      const { text } = await generateText({
        model: gateway('openai/gpt-4o'),
        prompt,
        providerOptions: getProviderOptions('content'),
      })

      // Create script for this cut
      const cutScript = await prisma.script.create({
        data: {
          episodeId: episode.id,
          content: text,
          isCanonical: false,
          version: 1,
        },
      })

      // Create cut record
      const cut = await prisma.cut.create({
        data: {
          episodeId: episode.id,
          scriptId: cutScript.id,
          format: format as any,
          durationTarget: formatConfig.duration,
          status: 'DRAFT',
        },
      })

      cuts.push(cut)
    }

    return NextResponse.json({ cuts, count: cuts.length })
  } catch (error) {
    console.error('Error generating cuts:', error)
    return NextResponse.json(
      { error: 'Failed to generate cuts' },
      { status: 500 }
    )
  }
}
