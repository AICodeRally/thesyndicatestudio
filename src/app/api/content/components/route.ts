import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const cards = await prisma.componentCard.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ cards })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  const card = await prisma.componentCard.create({ data: body })
  return NextResponse.json({ card })
}
