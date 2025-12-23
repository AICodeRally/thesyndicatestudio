import { prisma } from '../src/lib/db'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import * as matter from 'gray-matter'

interface CounselFrontmatter {
  slug: string
  title: string
  oneLiner: string
  type: string
  channel: string
  tags: string[]
  difficulty: string
  timeToApplyMin: number
}

async function seedCounsel() {
  const counselDir = join(process.cwd(), 'content', 'counsel')
  const files = readdirSync(counselDir).filter(f => f.endsWith('.md'))

  console.log(`📚 Found ${files.length} Counsel files to seed`)

  for (const file of files) {
    const filePath = join(counselDir, file)
    const fileContent = readFileSync(filePath, 'utf-8')

    // Parse frontmatter and body
    const { data, content } = matter.default(fileContent)
    const frontmatter = data as CounselFrontmatter

    // Extract sections from markdown body
    const sections = parseCounselSections(content)

    try {
      const counsel = await prisma.counsel.upsert({
        where: { slug: frontmatter.slug },
        update: {
          title: frontmatter.title,
          oneLiner: frontmatter.oneLiner,
          type: frontmatter.type as any,
          channelPrimary: frontmatter.channel as any,
          tags: frontmatter.tags || [],
          difficulty: frontmatter.difficulty as any,
          timeToApplyMin: frontmatter.timeToApplyMin,
          problemStatement: sections.problemStatement || '',
          mechanism: sections.mechanism || '',
          bodyMd: content,
          recommendedActions: sections.recommendedActions || [],
          pitfalls: sections.pitfalls || [],
          assumptions: sections.assumptions || [],
          videoRefs: sections.videoRefs || [],
        },
        create: {
          slug: frontmatter.slug,
          title: frontmatter.title,
          oneLiner: frontmatter.oneLiner,
          type: frontmatter.type as any,
          channelPrimary: frontmatter.channel as any,
          tags: frontmatter.tags || [],
          difficulty: frontmatter.difficulty as any,
          timeToApplyMin: frontmatter.timeToApplyMin,
          problemStatement: sections.problemStatement || '',
          mechanism: sections.mechanism || '',
          bodyMd: content,
          recommendedActions: sections.recommendedActions || [],
          pitfalls: sections.pitfalls || [],
          assumptions: sections.assumptions || [],
          videoRefs: sections.videoRefs || [],
        },
      })

      console.log(`✅ Seeded: ${counsel.slug}`)
    } catch (error) {
      console.error(`❌ Error seeding ${frontmatter.slug}:`, error)
    }
  }
}

function parseCounselSections(markdown: string) {
  const sections: any = {
    recommendedActions: [],
    pitfalls: [],
    assumptions: [],
    videoRefs: [],
  }

  // Extract Problem Statement
  const problemMatch = markdown.match(/## Problem Statement\n\n([\s\S]*?)(?=\n## )/m)
  if (problemMatch) {
    sections.problemStatement = problemMatch[1].trim()
  }

  // Extract Mechanism
  const mechanismMatch = markdown.match(/## Mechanism.*?\n\n([\s\S]*?)(?=\n## )/m)
  if (mechanismMatch) {
    sections.mechanism = mechanismMatch[1].trim()
  }

  // Extract Recommended Actions (as array of action items)
  const actionsMatch = markdown.match(/## Recommended Actions([\s\S]*?)(?=\n## |$)/m)
  if (actionsMatch) {
    const actionsText = actionsMatch[1]
    // Extract numbered or bulleted items
    const actionItems = actionsText.match(/###\s+(.*?)(?=\n###|\n##|$)/gs)
    if (actionItems) {
      sections.recommendedActions = actionItems.map((item: string) => {
        const titleMatch = item.match(/###\s+(.+)/)
        const title = titleMatch ? titleMatch[1].trim() : ''
        const content = item.replace(/###\s+.+/, '').trim()
        return { title, content }
      })
    }
  }

  // Extract Pitfalls
  const pitfallsMatch = markdown.match(/## Common Pitfalls([\s\S]*?)(?=\n## |$)/m)
  if (pitfallsMatch) {
    const pitfallsText = pitfallsMatch[1]
    const pitfallItems = pitfallsText.match(/\*\*"([^"]+)"\*\*\n([^\n*]+)/g)
    if (pitfallItems) {
      sections.pitfalls = pitfallItems.map((item: string) => {
        const match = item.match(/\*\*"([^"]+)"\*\*\n(.+)/)
        if (match) {
          return { pitfall: match[1], why: match[2].trim() }
        }
        return { pitfall: item.trim(), why: '' }
      })
    }
  }

  // Extract Assumptions
  const assumptionsMatch = markdown.match(/## Assumptions([\s\S]*?)(?=\n## |$)/m)
  if (assumptionsMatch) {
    const assumptionsText = assumptionsMatch[1]
    const assumptionItems = assumptionsText.match(/^-\s+(.+)$/gm)
    if (assumptionItems) {
      sections.assumptions = assumptionItems.map((item: string) =>
        item.replace(/^-\s+/, '').trim()
      )
    }
  }

  // Extract Video References
  const videoMatch = markdown.match(/\*\*Videos\*\*:\n([\s\S]*?)(?=\n\*\*|$)/m)
  if (videoMatch) {
    const videoText = videoMatch[1]
    const videoItems = videoText.match(/^-\s+(.+)$/gm)
    if (videoItems) {
      sections.videoRefs = videoItems.map((item: string) => {
        const text = item.replace(/^-\s+/, '').trim()
        const match = text.match(/Episode (\d+): "([^"]+)"/)
        if (match) {
          return { episode: match[1], title: match[2] }
        }
        return { text }
      })
    }
  }

  return sections
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  try {
    await seedCounsel()

    const count = await prisma.counsel.count()
    console.log(`\n✨ Seed complete! ${count} Counsel items in database.`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
