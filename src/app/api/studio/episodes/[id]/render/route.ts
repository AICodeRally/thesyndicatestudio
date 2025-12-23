import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../auth'
import { prisma } from '@/lib/db'
import { generateHeyGenVideo, checkHeyGenVideoStatus } from '@/lib/video/heygen'
import { put } from '@vercel/blob'

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

    const { id } = await params
    const { cutId, avatarId, voiceId, aspectRatio = '9:16' } = await request.json()

    // Get episode and cut
    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
        cuts: {
          where: cutId ? { id: cutId } : undefined,
          include: { script: true },
        },
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Determine which script to use
    let scriptText = ''
    let cutFormat = 'FULL'

    if (cutId && episode.cuts && episode.cuts.length > 0) {
      const cut = episode.cuts[0]
      scriptText = cut.script?.content || ''
      cutFormat = cut.format
    } else if (episode.canonicalScript) {
      scriptText = episode.canonicalScript.content
    } else {
      return NextResponse.json(
        { error: 'No script found for this episode' },
        { status: 400 }
      )
    }

    if (!scriptText) {
      return NextResponse.json(
        { error: 'Script is empty' },
        { status: 400 }
      )
    }

    // Check if HeyGen is configured
    if (!process.env.HEYGEN_API_KEY) {
      return NextResponse.json({
        error: 'HEYGEN_API_KEY not configured',
        message: 'Add your HeyGen API key to .env to enable video generation',
        stub: true,
      }, { status: 503 })
    }

    // Resolve avatar ID - if database ID provided, look up the HeyGen providerId
    let heygenAvatarId = avatarId
    if (avatarId && avatarId.startsWith('cmj')) {
      // This is a database ID, need to look up the actual HeyGen providerId
      const avatarRecord = await prisma.toddStudioAsset.findUnique({
        where: { id: avatarId },
      })
      heygenAvatarId = avatarRecord?.metadataJson?.providerId || null
    }

    // Generate video with HeyGen
    const result = await generateHeyGenVideo({
      scriptText,
      avatarId: heygenAvatarId, // Use HeyGen avatar ID or null for default
      voiceId,
      aspectRatio: aspectRatio as '16:9' | '9:16' | '1:1',
      background: '#000000', // Noir black background
    })

    // Create asset record to track this video
    const asset = await prisma.asset.create({
      data: {
        episodeId: episode.id,
        cutId: cutId || null,
        type: 'BROLL', // We'll use BROLL for now, could add AROLL type
        prompt: `HeyGen render: ${cutFormat}`,
        url: null, // Will be updated when video is ready
        status: 'PROCESSING',
      },
    })

    return NextResponse.json({
      videoId: result.videoId,
      assetId: asset.id,
      status: 'processing',
      message: 'Video generation started. Poll /api/studio/videos/[videoId]/status to check progress.',
      pollUrl: `/api/studio/videos/${result.videoId}/status`,
    })

  } catch (error: any) {
    console.error('Error rendering video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to render video' },
      { status: 500 }
    )
  }
}
