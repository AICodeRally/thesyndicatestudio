import { NextResponse } from 'next/server'
import { auth } from '../../../../../../auth'
import { prisma } from '@/lib/db'

export async function GET(
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

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
        scripts: {
          orderBy: { createdAt: 'desc' },
        },
        cuts: {
          orderBy: { createdAt: 'desc' },
        },
        assets: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ episode })
  } catch (error) {
    console.error('Error fetching episode:', error)
    return NextResponse.json(
      { error: 'Failed to fetch episode' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const updates = await request.json()

    const episode = await prisma.episode.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ episode })
  } catch (error) {
    console.error('Error updating episode:', error)
    return NextResponse.json(
      { error: 'Failed to update episode' },
      { status: 500 }
    )
  }
}
