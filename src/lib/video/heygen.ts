// HeyGen API Integration for Avatar Video Generation
// Docs: https://docs.heygen.com/reference/api-overview

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY
const HEYGEN_API_BASE = 'https://api.heygen.com'

export interface HeyGenAvatarOptions {
  avatarId?: string // Use uploaded avatar or default
  voiceId?: string // AI voice or custom voice
  scriptText: string
  background?: string // Background style
  aspectRatio?: '16:9' | '9:16' | '1:1'
}

export interface HeyGenVideoStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  videoUrl?: string
  thumbnailUrl?: string
  error?: string
}

/**
 * Upload avatar image to HeyGen
 * Returns avatar_id to use in video generation
 */
export async function uploadAvatarToHeyGen(imageBuffer: Buffer, avatarName: string) {
  if (!HEYGEN_API_KEY) {
    throw new Error('HEYGEN_API_KEY not configured')
  }

  const formData = new FormData()
  formData.append('file', new Blob([imageBuffer]), 'avatar.png')
  formData.append('avatar_name', avatarName)

  const response = await fetch(`${HEYGEN_API_BASE}/v1/avatar.upload`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HeyGen avatar upload failed: ${error}`)
  }

  const data = await response.json()
  return {
    avatarId: data.data.avatar_id,
    status: data.data.status,
  }
}

/**
 * Generate talking head video with HeyGen
 * Returns video_id to poll for completion
 */
export async function generateHeyGenVideo(options: HeyGenAvatarOptions) {
  if (!HEYGEN_API_KEY) {
    throw new Error('HEYGEN_API_KEY not configured')
  }

  const requestBody = {
    video_inputs: [
      {
        character: {
          type: 'avatar',
          avatar_id: options.avatarId || process.env.HEYGEN_DEFAULT_AVATAR_ID,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text',
          input_text: options.scriptText,
          voice_id: options.voiceId || process.env.HEYGEN_DEFAULT_VOICE_ID || 'wayne', // Default professional voice
          speed: 1.0,
        },
        background: {
          type: 'color',
          value: options.background || '#000000', // Black for noir
        },
      },
    ],
    dimension: {
      width: options.aspectRatio === '9:16' ? 1080 : options.aspectRatio === '1:1' ? 1080 : 1920,
      height: options.aspectRatio === '9:16' ? 1920 : options.aspectRatio === '1:1' ? 1080 : 1080,
    },
    aspect_ratio: options.aspectRatio || '9:16',
  }

  const response = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HeyGen video generation failed: ${error}`)
  }

  const data = await response.json()
  return {
    videoId: data.data.video_id,
    status: 'pending' as const,
  }
}

/**
 * Check video generation status
 * Poll this until status === 'completed'
 */
export async function checkHeyGenVideoStatus(videoId: string): Promise<HeyGenVideoStatus> {
  if (!HEYGEN_API_KEY) {
    throw new Error('HEYGEN_API_KEY not configured')
  }

  const response = await fetch(`${HEYGEN_API_BASE}/v1/video_status.get?video_id=${videoId}`, {
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to check video status: ${error}`)
  }

  const data = await response.json()

  return {
    id: videoId,
    status: data.data.status,
    videoUrl: data.data.video_url,
    thumbnailUrl: data.data.thumbnail_url,
    error: data.data.error,
  }
}

/**
 * List available voices in HeyGen
 */
export async function listHeyGenVoices() {
  if (!HEYGEN_API_KEY) {
    throw new Error('HEYGEN_API_KEY not configured')
  }

  const response = await fetch(`${HEYGEN_API_BASE}/v1/voices.list`, {
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch voices')
  }

  const data = await response.json()
  return data.data.voices
}

/**
 * Upload custom voice to HeyGen
 * Requires audio samples (5+ minutes recommended)
 */
export async function uploadCustomVoice(audioBuffer: Buffer, voiceName: string) {
  if (!HEYGEN_API_KEY) {
    throw new Error('HEYGEN_API_KEY not configured')
  }

  const formData = new FormData()
  formData.append('audio', new Blob([audioBuffer]), 'voice-sample.mp3')
  formData.append('voice_name', voiceName)

  const response = await fetch(`${HEYGEN_API_BASE}/v1/voice.upload`, {
    method: 'POST',
    headers: {
      'X-Api-Key': HEYGEN_API_KEY,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Voice upload failed: ${error}`)
  }

  const data = await response.json()
  return {
    voiceId: data.data.voice_id,
    status: data.data.status,
  }
}
