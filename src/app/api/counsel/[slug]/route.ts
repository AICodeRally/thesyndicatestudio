import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const counsel = await prisma.counsel.findUnique({
      where: { slug },
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
