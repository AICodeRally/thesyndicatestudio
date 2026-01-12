import { prisma } from '@/lib/db'
import { put } from '@vercel/blob'
import type { Asset } from '@/generated/prisma'

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

export type VideoProvider = 'sora' | 'heygen'
export type AspectRatio = '16:9' | '9:16' | '1:1'

export type SoraDuration = '4' | '8' | '12'

export interface RenderSoraOptions {
  episodeId: string
  cutId?: string
  aspectRatio?: AspectRatio
  seconds?: SoraDuration
  model?: 'sora-2' | 'sora-2-pro'
  promptOverride?: string
}

export interface RenderResult {
  provider: VideoProvider
  videoId: string
  assetId: string
  status: string
  message: string
  pollUrl: string
}

export interface VideoStatus {
  status: 'processing' | 'completed' | 'failed' | 'waiting' | 'pending'
  videoUrl?: string
  error?: string
  errorCode?: string
}

function getSize(aspectRatio: AspectRatio): string {
  switch (aspectRatio) {
    case '9:16':
      return '720x1280'
    case '1:1':
      return '720x720'
    case '16:9':
    default:
      return '1280x720'
  }
}

export class VideoService {
  async renderSora(options: RenderSoraOptions): Promise<RenderResult> {
    const {
      episodeId,
      cutId,
      aspectRatio = '9:16',
      seconds = '8',
      model = 'sora-2',
      promptOverride,
    } = options

    if (!process.env.OPENAI_API_KEY) {
      throw new ConfigurationError('OPENAI_API_KEY not configured')
    }

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        canonicalScript: true,
        cuts: {
          where: cutId ? { id: cutId } : undefined,
          include: { script: true },
        },
      },
    })

    if (!episode) {
      throw new NotFoundError('Episode')
    }

    let scriptText = ''
    let cutFormat = 'FULL'

    if (cutId && episode.cuts.length > 0) {
      const cut = episode.cuts[0]
      scriptText = cut.script?.content || ''
      cutFormat = cut.format
    } else if (episode.canonicalScript) {
      scriptText = episode.canonicalScript.content
    } else {
      throw new NotFoundError('Script for this episode')
    }

    if (!scriptText) {
      throw new NotFoundError('Script content is empty')
    }

    const prompt = typeof promptOverride === 'string' && promptOverride.trim().length > 0
      ? promptOverride.trim()
      : `Create a cinematic film noir video inspired by this script.\n\n${scriptText.substring(0, 1200)}\n\nStyle: high-contrast noir lighting, moody urban environments, dramatic shadows, stylish camera moves. Keep it abstract and atmospheric.`

    // OpenAI Video API uses JSON, not FormData
    // seconds must be a string: "4", "8", or "12"
    const requestBody = {
      prompt,
      model,
      size: getSize(aspectRatio),
      seconds: seconds,
    }

    const response = await fetch('https://api.openai.com/v1/videos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Sora video generation failed: ${errorText}`)
    }

    const data = await response.json()
    const videoId = data.id || data.video_id || data.data?.id

    if (!videoId) {
      throw new Error('Failed to start Sora job - no video ID returned')
    }

    const asset = await prisma.asset.create({
      data: {
        episodeId: episode.id,
        cutId: cutId || null,
        type: 'SORA',
        prompt: `Sora render: ${cutFormat} videoId=${videoId}\n\n${prompt}`,
        url: null,
        status: 'PROCESSING',
      },
    })

    return {
      provider: 'sora',
      videoId,
      assetId: asset.id,
      status: 'processing',
      message: 'Sora generation started. Poll status to check progress.',
      pollUrl: `/api/studio/videos/sora/${videoId}/status`,
    }
  }

  async checkSoraStatus(videoId: string): Promise<VideoStatus> {
    if (!process.env.OPENAI_API_KEY) {
      throw new ConfigurationError('OPENAI_API_KEY not configured')
    }

    const response = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        status: 'failed',
        error: errorText,
        errorCode: String(response.status),
      }
    }

    const data = await response.json()
    const status = data.status || data.state || 'processing'

    if (status === 'completed' || status === 'succeeded') {
      // Download the video
      const contentResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })

      if (!contentResponse.ok) {
        return {
          status: 'failed',
          error: 'Failed to download video content',
        }
      }

      const videoBlob = await contentResponse.blob()

      // Find the asset by videoId in prompt
      const asset = await prisma.asset.findFirst({
        where: {
          prompt: { contains: videoId },
          status: 'PROCESSING',
        },
      })

      if (asset) {
        // Upload to Vercel Blob
        const { url } = await put(
          `videos/${asset.episodeId}/${asset.id}.mp4`,
          videoBlob,
          { access: 'public', contentType: 'video/mp4' }
        )

        // Update asset with URL
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            url,
            status: 'COMPLETED',
          },
        })

        return {
          status: 'completed',
          videoUrl: url,
        }
      }

      return {
        status: 'completed',
        videoUrl: data.download_url || data.url,
      }
    }

    if (status === 'failed' || status === 'error') {
      return {
        status: 'failed',
        error: data.error || data.message || 'Video generation failed',
        errorCode: data.error_code,
      }
    }

    return {
      status: 'processing',
    }
  }

  async listAssets(episodeId: string, type?: string): Promise<Asset[]> {
    return prisma.asset.findMany({
      where: {
        episodeId,
        type: type as any,
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}

export const videoService = new VideoService()
