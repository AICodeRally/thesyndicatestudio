import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'
import type { Episode, Script, EpisodeStatus } from '@/generated/prisma'

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export interface CreateEpisodeInput {
  title: string
  premise: string
  series?: string
  publishDateTarget?: string | Date
}

export interface ListEpisodesOptions {
  status?: EpisodeStatus
  limit?: number
}

export class EpisodeService {
  async list(options: ListEpisodesOptions = {}): Promise<Episode[]> {
    const { status, limit = 50 } = options

    return prisma.episode.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        canonicalScript: true,
        cuts: true,
        assets: true,
      },
    })
  }

  async get(id: string): Promise<Episode & { canonicalScript: Script | null }> {
    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
        cuts: {
          include: { script: true, assets: true },
        },
        assets: true,
        scripts: true,
      },
    })

    if (!episode) {
      throw new NotFoundError('Episode')
    }

    return episode
  }

  async create(input: CreateEpisodeInput): Promise<Episode> {
    const { title, premise, series = 'General', publishDateTarget } = input

    if (!title || !premise) {
      throw new ValidationError('Title and premise are required')
    }

    return prisma.episode.create({
      data: {
        title,
        premise,
        series,
        status: 'DRAFT',
        publishDateTarget: publishDateTarget ? new Date(publishDateTarget) : null,
      },
    })
  }

  async delete(id: string): Promise<void> {
    const episode = await prisma.episode.findUnique({ where: { id } })
    if (!episode) {
      throw new NotFoundError('Episode')
    }

    await prisma.episode.delete({ where: { id } })
  }

  async generateScript(episodeId: string): Promise<Script> {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    })

    if (!episode) {
      throw new NotFoundError('Episode')
    }

    // Update status to GENERATING
    await prisma.episode.update({
      where: { id: episodeId },
      data: { status: 'GENERATING' },
    })

    try {
      const prompt = `Generate a video script for a YouTube video about Sales Performance Management (SPM).

Series: ${episode.series}
Title: ${episode.title}
Premise: ${episode.premise}

Structure the script with these sections:
1. **Hook** (15 seconds) - Grab attention immediately
2. **Intro** (30 seconds) - Set context and preview
3. **Body** (3-5 main points, 6-8 minutes total)
4. **Summary** (1 minute) - Recap key takeaways
5. **CTA** (15 seconds) - What to do next

Tone: Direct, authoritative, no-nonsense. Like a film noir detective explaining how things really work.
Voice: "The Syndicate" - experienced SPM practitioners who've seen it all.

Write ONLY the script content. No meta-commentary. Use clear section headers.`

      const { text } = await generateText({
        model: gateway('openai/gpt-4o'),
        prompt,
        providerOptions: getProviderOptions('content'),
      })

      // Save script to database
      const script = await prisma.script.create({
        data: {
          episodeId: episode.id,
          content: text,
          isCanonical: true,
          version: 1,
        },
      })

      // Link as canonical script
      await prisma.episode.update({
        where: { id: episodeId },
        data: {
          canonicalScriptId: script.id,
          status: 'PENDING_REVIEW',
        },
      })

      return script
    } catch (error) {
      // Reset status on error
      await prisma.episode.update({
        where: { id: episodeId },
        data: { status: 'DRAFT' },
      })
      throw error
    }
  }

  async updateStatus(episodeId: string, status: EpisodeStatus): Promise<Episode> {
    const episode = await prisma.episode.findUnique({ where: { id: episodeId } })
    if (!episode) {
      throw new NotFoundError('Episode')
    }

    return prisma.episode.update({
      where: { id: episodeId },
      data: { status },
    })
  }
}

export const episodeService = new EpisodeService()
