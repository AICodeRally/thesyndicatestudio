import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../auth'
import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

export async function GET(
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

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
        cuts: {
          include: {
            script: true,
          },
        },
        assets: true,
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Generate manifest JSON
    const manifest = {
      id: episode.id,
      version: '1.0.0',
      metadata: {
        series: episode.series,
        title: episode.title,
        premise: episode.premise,
        status: episode.status,
        publishDateTarget: episode.publishDateTarget,
        createdAt: episode.createdAt,
        updatedAt: episode.updatedAt,
      },
      script: {
        canonicalId: episode.canonicalScriptId,
        content: episode.canonicalScript?.content || null,
        version: episode.canonicalScript?.version || null,
      },
      cuts: episode.cuts.map(cut => ({
        id: cut.id,
        format: cut.format,
        durationTarget: cut.durationTarget,
        status: cut.status,
        script: cut.script?.content || null,
      })),
      assets: {
        broll: episode.assets.filter(a => a.type === 'BROLL').map(a => ({
          id: a.id,
          prompt: a.prompt,
          url: a.url,
          status: a.status,
        })),
        thumbnails: episode.assets.filter(a => a.type === 'THUMBNAIL').map(a => ({
          id: a.id,
          prompt: a.prompt,
          url: a.url,
          status: a.status,
        })),
        other: episode.assets.filter(a => !['BROLL', 'THUMBNAIL'].includes(a.type)),
      },
      counsel: {
        refs: (episode.counselRefs as any) || [],
        count: ((episode.counselRefs as any)?.length) || 0,
      },
      production: {
        readyForProduction: !!episode.canonicalScript && episode.cuts.length > 0,
        readyForPublish: episode.status === 'PENDING_REVIEW',
        assetsGenerated: episode.assets.length > 0,
      },
    }

    return NextResponse.json(manifest)

  } catch (error) {
    console.error('Error exporting episode:', error)
    return NextResponse.json(
      { error: 'Failed to export episode' },
      { status: 500 }
    )
  }
}
