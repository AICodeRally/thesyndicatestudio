import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const episodes = await prisma.episode.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        series: true,
        title: true,
        premise: true,
        youtubeVideoId: true,
        publishDateTarget: true,
        createdAt: true,
        counselRefs: true,
      },
    })

    return NextResponse.json({ episodes, count: episodes.length })
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    )
  }
}
