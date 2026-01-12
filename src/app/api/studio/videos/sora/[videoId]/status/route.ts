import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 503 }
      )
    }

    const { videoId } = await params

    const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to check Sora status: ${errorText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    const status = data.status || data.state || 'processing'

    const telemetry = {
      videoId,
      status,
      timestamp: new Date().toISOString(),
      soraResponse: data,
    }

    if (status === 'completed') {
      const asset = await prisma.asset.findFirst({
        where: {
          prompt: { contains: videoId },
          status: 'PROCESSING',
        },
      })

      if (asset && !asset.url) {
        const download = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        })

        if (!download.ok) {
          const errorText = await download.text()
          return NextResponse.json(
            { error: `Failed to download Sora video: ${errorText}` },
            { status: 500 }
          )
        }

        const buffer = Buffer.from(await download.arrayBuffer())

        // Save to local public/videos directory
        const videoDir = path.join(process.cwd(), 'public', 'videos', asset.episodeId)
        await mkdir(videoDir, { recursive: true })

        const videoPath = path.join(videoDir, `${asset.id}.mp4`)
        await writeFile(videoPath, buffer)

        // URL accessible via Next.js public folder
        const localUrl = `/videos/${asset.episodeId}/${asset.id}.mp4`

        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            url: localUrl,
            status: 'COMPLETED',
          },
        })

        return NextResponse.json({
          status: 'completed',
          assetId: asset.id,
          finalUrl: localUrl,
          telemetry,
        })
      }
    }

    return NextResponse.json({
      status,
      telemetry,
    })
  } catch (error: any) {
    console.error('Error checking Sora status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check Sora status' },
      { status: 500 }
    )
  }
}
