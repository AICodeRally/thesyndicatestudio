import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const counsel = await prisma.counsel.findUnique({
      where: { id },
    })

    if (!counsel) {
      return NextResponse.json(
        { error: 'Counsel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ counsel })
  } catch (error) {
    console.error('Error fetching counsel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counsel' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = await params
    const updates = await request.json()

    // Remove fields that shouldn't be updated directly
    delete updates.id
    delete updates.createdAt

    const counsel = await prisma.counsel.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ counsel })
  } catch (error) {
    console.error('Error updating counsel:', error)
    return NextResponse.json(
      { error: 'Failed to update counsel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const isAdmin = await isAdminUser(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.counsel.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting counsel:', error)
    return NextResponse.json(
      { error: 'Failed to delete counsel' },
      { status: 500 }
    )
  }
}
