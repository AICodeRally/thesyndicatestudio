import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const collection = await prisma.vaultCollection.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              orderBy: { order: 'asc' },
              include: {
                counsel: true,
              },
            },
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Generate Markdown
    let markdown = `# ${collection.title}\n\n`

    if (collection.description) {
      markdown += `${collection.description}\n\n`
    }

    markdown += `---\n\n`

    for (const section of collection.sections) {
      markdown += `## ${section.title}\n\n`

      for (const item of section.items) {
        const counsel = item.counsel
        if (counsel) {
          markdown += `### ${counsel.title}\n\n`
          markdown += `**Type**: ${counsel.type} | **Difficulty**: ${counsel.difficulty} | **Channel**: ${counsel.channelPrimary}\n\n`
          markdown += `${counsel.oneLiner}\n\n`

          if (item.notes) {
            markdown += `**Notes**: ${item.notes}\n\n`
          }

          markdown += `[Read full Counsel](/counsel/${counsel.slug})\n\n`
          markdown += `---\n\n`
        }
      }
    }

    markdown += `\n*Exported from The Toddfather on ${new Date().toLocaleDateString()}*\n`

    // Return as downloadable file
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${collection.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md"`,
      },
    })
  } catch (error) {
    console.error('Error exporting collection:', error)
    return NextResponse.json(
      { error: 'Failed to export collection' },
      { status: 500 }
    )
  }
}
