import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

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
    const { youtubeVideoId } = await request.json()

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
        cuts: true,
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Validate episode is ready to publish
    if (!episode.canonicalScript) {
      return NextResponse.json(
        { error: 'Episode needs a script before publishing' },
        { status: 400 }
      )
    }

    // Update episode to PUBLISHED
    const published = await prisma.episode.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        youtubeVideoId: youtubeVideoId || null,
      },
    })

    return NextResponse.json({
      episode: published,
      message: 'Episode published successfully! It now appears in the public library.',
    })

  } catch (error) {
    console.error('Error publishing episode:', error)
    return NextResponse.json(
      { error: 'Failed to publish episode' },
      { status: 500 }
    )
  }
}
