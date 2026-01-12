import { NextResponse } from 'next/server'
import { auth, getUserTier } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { userId } = await auth()

    const model = await prisma.workingModel.findUnique({
      where: { slug },
    })

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Get user tier if logged in
    let userTier = 'FREE'
    if (userId) {
      userTier = await getUserTier(userId)
    }

    return NextResponse.json({ model, userTier })
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
}
