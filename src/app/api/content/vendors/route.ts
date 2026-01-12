import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const vendors = await prisma.vendorScorecard.findMany({
      orderBy: { vendorName: 'asc' },
    })
    return NextResponse.json({ vendors })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const vendor = await prisma.vendorScorecard.create({ data: body })
    return NextResponse.json({ vendor })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
