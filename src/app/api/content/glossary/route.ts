import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

// GET all glossary terms
export async function GET(request: Request) {
  try {
    const terms = await prisma.glossaryTerm.findMany({
      orderBy: { term: 'asc' },
    })

    return NextResponse.json({ terms })
  } catch (error) {
    console.error('Error fetching glossary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch glossary terms' },
      { status: 500 }
    )
  }
}

// POST create new term
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { term, definition, category, aliases, relatedTerms, examples } = body

    const newTerm = await prisma.glossaryTerm.create({
      data: {
        term,
        definition,
        category,
        aliases: aliases || [],
        relatedTerms: relatedTerms || [],
        examples: examples || null,
      },
    })

    return NextResponse.json({ term: newTerm })
  } catch (error) {
    console.error('Error creating glossary term:', error)
    return NextResponse.json(
      { error: 'Failed to create term' },
      { status: 500 }
    )
  }
}
