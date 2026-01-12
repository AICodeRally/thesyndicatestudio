import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

import { prisma } from '@/lib/db'

// Load local image as Buffer with mime type
async function loadImageFile(imagePath: string): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const fullPath = path.join(process.cwd(), 'public', imagePath)
  const buffer = await readFile(fullPath)
  const ext = path.extname(imagePath).toLowerCase().slice(1)
  const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`
  const filename = path.basename(imagePath)
  return { buffer, mimeType, filename }
}

function getSize(aspectRatio: '16:9' | '9:16' | '1:1') {
  switch (aspectRatio) {
    case '9:16':
      return '720x1280'
    case '1:1':
      return '720x720'
    case '16:9':
    default:
      return '1280x720'
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 503 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      cutId,
      aspectRatio = '9:16',
      seconds = '8', // Must be "4", "8", or "12"
      model = 'sora-2',
      promptOverride,
      referenceImages = [], // Array of paths like '/images/noir/toddfather_noir_panel_1_left.png'
    } = body

    // Validate seconds is a valid duration
    const validSeconds = ['4', '8', '12']
    const durationStr = String(seconds)
    if (!validSeconds.includes(durationStr)) {
      return NextResponse.json(
        { error: `Invalid duration. Must be one of: ${validSeconds.join(', ')}` },
        { status: 400 }
      )
    }

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

    let scriptText = ''
    let cutFormat = 'FULL'

    if (cutId && episode.cuts.length > 0) {
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

    const prompt = typeof promptOverride === 'string' && promptOverride.trim().length > 0
      ? promptOverride.trim()
      : `Create a cinematic film noir video inspired by this script.\n\n${scriptText.substring(0, 1200)}\n\nStyle: high-contrast noir lighting, moody urban environments, dramatic shadows, stylish camera moves. Keep it abstract and atmospheric.`

    let response: Response

    // If reference images provided, use multipart/form-data with input_reference
    if (referenceImages && referenceImages.length > 0) {
      try {
        // Load the first reference image (Sora only supports one input_reference)
        const { buffer, mimeType, filename } = await loadImageFile(referenceImages[0])

        // Create FormData for multipart upload
        const formData = new FormData()
        formData.append('prompt', prompt)
        formData.append('model', model)
        formData.append('size', getSize(aspectRatio))
        formData.append('seconds', durationStr)

        // Add the reference image as input_reference
        const blob = new Blob([buffer], { type: mimeType })
        formData.append('input_reference', blob, filename)

        response = await fetch('https://api.openai.com/v1/videos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: formData,
        })
      } catch (imgError: any) {
        console.warn('Failed to load reference image, falling back to text-only:', imgError.message)
        // Fall back to JSON request without image
        response = await fetch('https://api.openai.com/v1/videos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            model,
            size: getSize(aspectRatio),
            seconds: durationStr,
          }),
        })
      }
    } else {
      // No reference images - use JSON request
      response = await fetch('https://api.openai.com/v1/videos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          size: getSize(aspectRatio),
          seconds: durationStr,
        }),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Sora video generation failed: ${errorText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const videoId = data.id || data.video_id || data.data?.id

    if (!videoId) {
      return NextResponse.json(
        { error: 'Failed to start Sora job' },
        { status: 500 }
      )
    }

    const asset = await prisma.asset.create({
      data: {
        episodeId: episode.id,
        cutId: cutId || null,
        type: 'SORA',
        prompt: `Sora render: ${cutFormat} videoId=${videoId}\n\n${prompt}`,
        url: null,
        status: 'PROCESSING',
      },
    })

    return NextResponse.json({
      provider: 'sora',
      videoId,
      assetId: asset.id,
      status: 'processing',
      message: 'Sora generation started. Poll status to check progress.',
      pollUrl: `/api/studio/videos/sora/${videoId}/status`,
    })
  } catch (error: any) {
    console.error('Error rendering Sora video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to render Sora video' },
      { status: 500 }
    )
  }
}
