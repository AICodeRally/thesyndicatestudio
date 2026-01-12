import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function GET() {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch avatars from ToddStudioAsset table
    const avatars = await prisma.toddStudioAsset.findMany({
      where: { type: 'CHARACTER' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      avatars: avatars.map(a => {
        const metadata = a.metadataJson as any
        return {
          id: a.id,
          name: a.slug,
          imageUrl: a.url,
          provider: metadata?.provider || 'local',
          providerId: metadata?.providerId,
          createdAt: a.createdAt,
        }
      }),
    })
  } catch (error) {
    console.error('Error fetching avatars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch avatars' },
      { status: 500 }
    )
  }
}
