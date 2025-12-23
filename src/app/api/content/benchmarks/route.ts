import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const benchmarks = await prisma.benchmark.findMany({ orderBy: { title: 'asc' } })
  return NextResponse.json({ benchmarks })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  const benchmark = await prisma.benchmark.create({ data: body })
  return NextResponse.json({ benchmark })
}
