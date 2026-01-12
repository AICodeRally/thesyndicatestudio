import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 50) + '-' + Date.now().toString(36)
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const counsel = await prisma.counsel.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        oneLiner: true,
        type: true,
        channelPrimary: true,
        difficulty: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ counsel })
  } catch (error) {
    console.error('Error fetching counsel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counsel' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

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

    const body = await request.json()

    // Map the extracted counsel data to the schema
    // Extracted counsel from episodes has: type, difficulty, title, oneLiner, problemStatement
    // We need to provide defaults for required fields that aren't extracted
    const counsel = await prisma.counsel.create({
      data: {
        slug: generateSlug(body.title),
        title: body.title,
        oneLiner: body.oneLiner || body.title,
        type: mapCounselType(body.type),
        channelPrimary: body.channelPrimary || 'GOVERNANCE',
        tags: body.tags || [],
        difficulty: mapDifficulty(body.difficulty),
        timeToApplyMin: body.timeToApplyMin || 15,
        problemStatement: body.problemStatement || '',
        mechanism: body.mechanism || 'To be documented',
        bodyMd: body.bodyMd || `# ${body.title}\n\n${body.problemStatement || ''}`,
        recommendedActions: body.recommendedActions || [],
        pitfalls: body.pitfalls || null,
        assumptions: body.assumptions || null,
        videoRefs: body.episodeId ? [body.episodeId] : null,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ counsel })
  } catch (error) {
    console.error('Error creating counsel:', error)
    return NextResponse.json(
      { error: 'Failed to create counsel' },
      { status: 500 }
    )
  }
}

function mapCounselType(type: string): 'NOTE' | 'CHECKLIST' | 'TEMPLATE' | 'MODEL' | 'PROTOCOL' | 'DIAGNOSTIC' {
  const types: Record<string, 'NOTE' | 'CHECKLIST' | 'TEMPLATE' | 'MODEL' | 'PROTOCOL' | 'DIAGNOSTIC'> = {
    NOTE: 'NOTE',
    CHECKLIST: 'CHECKLIST',
    TEMPLATE: 'TEMPLATE',
    MODEL: 'MODEL',
    PROTOCOL: 'PROTOCOL',
    DIAGNOSTIC: 'DIAGNOSTIC',
  }
  return types[type?.toUpperCase()] || 'NOTE'
}

function mapDifficulty(difficulty: string): 'INTRO' | 'OPERATOR' | 'ARCHITECT' {
  const difficulties: Record<string, 'INTRO' | 'OPERATOR' | 'ARCHITECT'> = {
    INTRO: 'INTRO',
    BEGINNER: 'INTRO',
    OPERATOR: 'OPERATOR',
    INTERMEDIATE: 'OPERATOR',
    ARCHITECT: 'ARCHITECT',
    ADVANCED: 'ARCHITECT',
  }
  return difficulties[difficulty?.toUpperCase()] || 'OPERATOR'
}
