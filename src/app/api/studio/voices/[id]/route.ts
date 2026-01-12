import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

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

    // Delete from ToddStudioAsset table
    await prisma.toddStudioAsset.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting voice:', error)
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    )
  }
}
