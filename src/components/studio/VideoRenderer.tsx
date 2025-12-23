"use client"

import { useState, useEffect } from 'react'

interface VideoRendererProps {
  episodeId: string
  cutId?: string
  cutFormat?: string
  onComplete?: (videoUrl: string) => void
}

export function VideoRenderer({ episodeId, cutId, cutFormat, onComplete }: VideoRendererProps) {
  const [avatars, setAvatars] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('wayne')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16')
  const [generating, setGenerating] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    loadAssets()
  }, [])

  useEffect(() => {
    if (videoId && status === 'processing') {
      const interval = setInterval(checkStatus, 10000) // Poll every 10s
      return () => clearInterval(interval)
    }
  }, [videoId, status])

  const loadAssets = async () => {
    try {
      const [avatarsRes, voicesRes] = await Promise.all([
        fetch('/api/studio/avatars'),
        fetch('/api/studio/voices'),
      ])

      if (avatarsRes.ok) {
        const data = await avatarsRes.json()
        setAvatars(data.avatars || [])
        if (data.avatars.length > 0) {
          setSelectedAvatar(data.avatars[0].providerId || '')
        }
      }

      if (voicesRes.ok) {
        const data = await voicesRes.json()
        setVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Failed to load assets:', error)
    }
  }

  const checkStatus = async () => {
    if (!videoId) return

    try {
      const res = await fetch(`/api/studio/videos/${videoId}/status`)
      const data = await res.json()

      setStatus(data.status)

      if (data.status === 'completed' && data.finalUrl) {
        setVideoUrl(data.finalUrl)
        setStatus('completed')
        if (onComplete) {
          onComplete(data.finalUrl)
        }
      } else if (data.status === 'failed') {
        setStatus('failed')
      }
    } catch (error) {
      console.error('Failed to check status:', error)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setStatus('processing')

    try {
      const res = await fetch(`/api/studio/episodes/${episodeId}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cutId,
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
          aspectRatio,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setVideoId(data.videoId)
        setShowOptions(false)
      } else {
        const error = await res.json()
        if (error.stub) {
          alert('HeyGen not configured. Add HEYGEN_API_KEY to .env to generate videos.')
        } else {
          alert(error.message || 'Failed to generate video')
        }
        setStatus('idle')
      }
    } catch (error) {
      console.error('Failed to generate:', error)
      setStatus('idle')
    } finally {
      setGenerating(false)
    }
  }

  // Determine default aspect ratio from cut format
  useEffect(() => {
    if (cutFormat) {
      if (cutFormat.includes('SHORT') || cutFormat === 'TIKTOK') {
        setAspectRatio('9:16')
      } else if (cutFormat === 'LINKEDIN') {
        setAspectRatio('1:1')
      } else {
        setAspectRatio('16:9')
      }
    }
  }, [cutFormat])

  if (videoUrl) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200 mb-3">
            ✓ Video generated successfully!
          </p>
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg"
          />
        </div>
        <div className="flex gap-3">
          <a
            href={videoUrl}
            download
            className="flex-1 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold text-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Download Video
          </a>
          <button
            onClick={() => {
              setVideoUrl(null)
              setVideoId(null)
              setStatus('idle')
            }}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Regenerate
          </button>
        </div>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-medium">
          Generating video...
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          This takes 5-10 minutes. HeyGen is creating your talking head video.
        </p>
      </div>
    )
  }

  if (!showOptions) {
    return (
      <button
        onClick={() => setShowOptions(true)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        Generate Video
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
        Video Generation Options
      </h4>

      {avatars.length === 0 ? (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
            No avatars uploaded yet
          </p>
          <Link
            href="/studio/library"
            className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300"
          >
            Upload Toddfather avatar in Library →
          </Link>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Avatar
          </label>
          <select
            value={selectedAvatar}
            onChange={(e) => setSelectedAvatar(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            {avatars.map((avatar) => (
              <option key={avatar.id} value={avatar.providerId}>
                {avatar.name} {avatar.provider === 'heygen' ? '(HeyGen)' : '(Local)'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Voice
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="wayne">Wayne (AI - Deep & Professional)</option>
          <option value="marcus">Marcus (AI - Gravelly & Experienced)</option>
          {voices.filter(v => v.provider === 'custom').map((voice) => (
            <option key={voice.id} value={voice.providerId}>
              {voice.name} (Your Voice)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['9:16', '1:1', '16:9'].map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aspectRatio === ratio
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {ratio} {ratio === '9:16' && '(Vertical)'}
              {ratio === '1:1' && '(Square)'}
              {ratio === '16:9' && '(Wide)'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleGenerate}
          disabled={generating || !selectedAvatar}
          className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Starting Generation...' : 'Generate Video'}
        </button>
        <button
          onClick={() => setShowOptions(false)}
          className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
