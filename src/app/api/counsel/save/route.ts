import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { counselId } = await request.json()

    if (!counselId) {
      return NextResponse.json(
        { error: 'counselId is required' },
        { status: 400 }
      )
    }

    // Check if already saved
    const existing = await prisma.counselSave.findUnique({
      where: {
        userId_counselId: {
          userId: session.user.id,
          counselId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ saved: true, counselSave: existing })
    }

    // Create save
    const counselSave = await prisma.counselSave.create({
      data: {
        userId: session.user.id,
        counselId,
      },
    })

    return NextResponse.json({ saved: true, counselSave })
  } catch (error) {
    console.error('Error saving counsel:', error)
    return NextResponse.json(
      { error: 'Failed to save counsel' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { counselId } = await request.json()

    await prisma.counselSave.delete({
      where: {
        userId_counselId: {
          userId: session.user.id,
          counselId,
        },
      },
    })

    return NextResponse.json({ saved: false })
  } catch (error) {
    console.error('Error unsaving counsel:', error)
    return NextResponse.json(
      { error: 'Failed to unsave counsel' },
      { status: 500 }
    )
  }
}
