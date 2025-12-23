import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const episodes = await prisma.episode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        canonicalScript: true,
        scripts: true,
        cuts: true,
        assets: true,
      },
    })

    return NextResponse.json({ episodes })
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { series, title, premise, publishDateTarget } = await request.json()

    if (!title || !premise) {
      return NextResponse.json(
        { error: 'Title and premise are required' },
        { status: 400 }
      )
    }

    const episode = await prisma.episode.create({
      data: {
        series,
        title,
        premise,
        publishDateTarget: publishDateTarget ? new Date(publishDateTarget) : null,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ episode })
  } catch (error) {
    console.error('Error creating episode:', error)
    return NextResponse.json(
      { error: 'Failed to create episode' },
      { status: 500 }
    )
  }
}
