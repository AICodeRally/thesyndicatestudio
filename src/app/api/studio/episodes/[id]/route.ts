import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if episode exists
    const episode = await prisma.episode.findUnique({
      where: { id },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Delete episode (cascades to scripts, cuts, assets via Prisma schema)
    await prisma.episode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting episode:', error)
    return NextResponse.json(
      { error: 'Failed to delete episode' },
      { status: 500 }
    )
  }
}
