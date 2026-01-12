import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../../auth'
import { prisma } from '@/lib/db'
import { put } from '@vercel/blob'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

        const blob = await put(
          `videos/${asset.episodeId}/${asset.id}.mp4`,
          buffer,
          {
            access: 'public',
            contentType: 'video/mp4',
          }
        )

        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            url: blob.url,
            status: 'COMPLETED',
          },
        })

        return NextResponse.json({
          status: 'completed',
          assetId: asset.id,
          finalUrl: blob.url,
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
