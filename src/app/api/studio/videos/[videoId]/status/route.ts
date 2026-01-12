import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkHeyGenVideoStatus } from '@/lib/video/heygen'
import { put } from '@vercel/blob'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { videoId } = await params

    if (!process.env.HEYGEN_API_KEY) {
      return NextResponse.json({
        error: 'HEYGEN_API_KEY not configured',
        stub: true,
      }, { status: 503 })
    }

    // Check status with HeyGen
    const status = await checkHeyGenVideoStatus(videoId)

    // Return telemetry data for debugging
    const telemetry = {
      videoId,
      status: status.status,
      timestamp: new Date().toISOString(),
      heygenResponse: status,
    }

    // If completed, download and save to Vercel Blob
    if (status.status === 'completed' && status.videoUrl) {
      // Find the asset record
      const asset = await prisma.asset.findFirst({
        where: {
          prompt: {
            contains: videoId,
          },
          status: 'PROCESSING',
        },
      })

      if (asset && !asset.url) {
        // Download video from HeyGen
        const videoResponse = await fetch(status.videoUrl)
        const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())

        // Upload to Vercel Blob
        const blob = await put(
          `videos/${asset.episodeId}/${asset.id}.mp4`,
          videoBuffer,
          {
            access: 'public',
            contentType: 'video/mp4',
          }
        )

        // Update asset with final URL
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            url: blob.url,
            status: 'COMPLETED',
          },
        })

        return NextResponse.json({
          ...status,
          assetId: asset.id,
          finalUrl: blob.url,
          telemetry,
        })
      }
    }

    return NextResponse.json({
      ...status,
      telemetry,
    })

  } catch (error: any) {
    console.error('Error checking video status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check video status' },
      { status: 500 }
    )
  }
}
