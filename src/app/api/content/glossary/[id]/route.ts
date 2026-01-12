import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

// GET single term
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const term = await prisma.glossaryTerm.findUnique({
      where: { id },
    })

    if (!term) {
      return NextResponse.json(
        { error: 'Term not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ term })
  } catch (error) {
    console.error('Error fetching term:', error)
    return NextResponse.json(
      { error: 'Failed to fetch term' },
      { status: 500 }
    )
  }
}

// PUT update term
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { term, definition, category, aliases, relatedTerms, examples } = body

    const updatedTerm = await prisma.glossaryTerm.update({
      where: { id },
      data: {
        term,
        definition,
        category,
        aliases: aliases || [],
        relatedTerms: relatedTerms || [],
        examples: examples || null,
      },
    })

    return NextResponse.json({ term: updatedTerm })
  } catch (error) {
    console.error('Error updating term:', error)
    return NextResponse.json(
      { error: 'Failed to update term' },
      { status: 500 }
    )
  }
}

// DELETE term
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.glossaryTerm.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting term:', error)
    return NextResponse.json(
      { error: 'Failed to delete term' },
      { status: 500 }
    )
  }
}
