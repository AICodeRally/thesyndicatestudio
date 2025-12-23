import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const channel = searchParams.get('channel')
    const difficulty = searchParams.get('difficulty')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const counsel = await prisma.counsel.findMany({
      where: {
        status: 'PUBLISHED',
        ...(channel && { channelPrimary: channel }),
        ...(difficulty && { difficulty }),
        ...(type && { type }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { oneLiner: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        oneLiner: true,
        type: true,
        channelPrimary: true,
        difficulty: true,
        timeToApplyMin: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ counsel, count: counsel.length })
  } catch (error) {
    console.error('Error fetching counsel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counsel' },
      { status: 500 }
    )
  }
}
