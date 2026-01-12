"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  const [selectedVoice, setSelectedVoice] = useState('1bd001e7e50f421d891986aad5158bc8')
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16')
  const [provider, setProvider] = useState<'heygen' | 'sora'>('heygen')
  const [soraSeconds, setSoraSeconds] = useState(8)
  const [soraModel, setSoraModel] = useState<'sora-2' | 'sora-2-pro'>('sora-2')
  const [soraPrompt, setSoraPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [telemetry, setTelemetry] = useState<any>(null)
  const [showTelemetry, setShowTelemetry] = useState(false)

  useEffect(() => {
    loadAssets()
  }, [])

  useEffect(() => {
    if (videoId && (status === 'processing' || status === 'waiting' || status === 'pending')) {
      const interval = setInterval(checkStatus, 10000) // Poll every 10s
      return () => clearInterval(interval)
    }
  }, [videoId, status])

  const loadAssets = async () => {
    // Load avatars
    try {
      const avatarsRes = await fetch('/api/studio/avatars')
      if (avatarsRes.ok) {
        const data = await avatarsRes.json()
        setAvatars(data.avatars || [])
        if (data.avatars.length > 0) {
          // Use providerId if available, otherwise use id as fallback
          setSelectedAvatar(data.avatars[0].providerId || data.avatars[0].id || 'default')
        } else {
          // Set a default avatar ID even if none uploaded
          setSelectedAvatar('default')
        }
      }
    } catch (error) {
      console.error('Failed to load avatars:', error)
      // Set default even on error so button works
      setSelectedAvatar('default')
    }

    // Load voices (don't block on failure)
    try {
      const voicesRes = await fetch('/api/studio/voices')
      if (voicesRes.ok) {
        const data = await voicesRes.json()
        setVoices(data.voices || [])
      }
    } catch (error) {
      console.error('Failed to load voices:', error)
      // Voice failure is non-critical - hardcoded voices will work
    }
  }

  const checkStatus = async () => {
    if (!videoId) return

    try {
      const statusUrl = provider === 'sora'
        ? `/api/studio/videos/sora/${videoId}/status`
        : `/api/studio/videos/${videoId}/status`
      const res = await fetch(statusUrl)
      const data = await res.json()

      setStatus(data.status)
      setTelemetry(data.telemetry || data)

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
    setStatus('waiting')

    try {
      const endpoint = provider === 'sora'
        ? `/api/studio/episodes/${episodeId}/render-sora`
        : `/api/studio/episodes/${episodeId}/render`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cutId,
            avatarId: provider === 'heygen' ? selectedAvatar : undefined,
            voiceId: provider === 'heygen' ? selectedVoice : undefined,
            aspectRatio,
            seconds: provider === 'sora' ? soraSeconds : undefined,
            model: provider === 'sora' ? soraModel : undefined,
            promptOverride: provider === 'sora' ? soraPrompt : undefined,
          }),
        })

      if (res.ok) {
        const data = await res.json()
        setVideoId(data.videoId)
        setTelemetry({
          videoId: data.videoId,
          status: 'initiated',
          timestamp: new Date().toISOString(),
          request: { cutId, avatarId: selectedAvatar, voiceId: selectedVoice, aspectRatio, provider, soraModel },
          response: data,
        })
        setShowOptions(false)
      } else {
        const error = await res.json()
        setTelemetry({
          status: 'failed',
          timestamp: new Date().toISOString(),
          error: error,
        })
        if (error.stub) {
          alert('HeyGen not configured. Add HEYGEN_API_KEY to .env to generate videos.')
        } else if (error.error === 'OPENAI_API_KEY not configured') {
          alert('OpenAI API key not configured. Add OPENAI_API_KEY to .env to generate Sora videos.')
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

  if (status === 'failed') {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-sm text-red-800 dark:text-red-200 mb-2 font-medium">
            ✗ Video generation failed
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">
            {telemetry?.heygenResponse?.error?.message ||
              telemetry?.soraResponse?.error?.message ||
              'Unknown error occurred'}
          </p>
          {(telemetry?.heygenResponse?.error?.code || telemetry?.soraResponse?.error?.code) && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
              Error Code: {telemetry?.heygenResponse?.error?.code || telemetry?.soraResponse?.error?.code}
            </p>
          )}
        </div>

        {/* Telemetry Panel */}
        {telemetry && (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="w-full px-4 py-3 text-left text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
            >
              <span>🔍 API Telemetry</span>
              <span>{showTelemetry ? '▼' : '▶'}</span>
            </button>
            {showTelemetry && (
              <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
                <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                  {JSON.stringify(telemetry, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => {
            setVideoUrl(null)
            setVideoId(null)
            setStatus('idle')
            setTelemetry(null)
          }}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

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
              setTelemetry(null)
            }}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Regenerate
          </button>
        </div>

        {/* Telemetry Panel */}
        {telemetry && (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="w-full px-4 py-3 text-left text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
            >
              <span>🔍 API Telemetry</span>
              <span>{showTelemetry ? '▼' : '▶'}</span>
            </button>
            {showTelemetry && (
              <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
                <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                  {JSON.stringify(telemetry, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (status === 'processing' || status === 'waiting' || status === 'pending') {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-medium">
            {status === 'waiting'
              ? provider === 'sora'
                ? 'Queued for Sora...'
                : 'In HeyGen Queue...'
              : 'Generating video...'}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {provider === 'sora'
              ? 'Sora is rendering a cinematic clip. This can take a few minutes.'
              : 'This takes 5-10 minutes. HeyGen is creating your talking head video.'}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Status: <span className="font-semibold">{status}</span>
          </p>
          {videoId && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono">
              Video ID: {videoId}
            </p>
          )}
        </div>

        {/* Telemetry Panel */}
        {telemetry && (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="w-full px-4 py-3 text-left text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
            >
              <span>🔍 API Telemetry</span>
              <span>{showTelemetry ? '▼' : '▶'}</span>
            </button>
            {showTelemetry && (
              <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
                <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                  {JSON.stringify(telemetry, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
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

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as 'heygen' | 'sora')}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="heygen">HeyGen (Talking head)</option>
          <option value="sora">Sora (Cinematic)</option>
        </select>
      </div>

      {provider === 'heygen' && (
        <>
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
              <option value="1bd001e7e50f421d891986aad5158bc8">Default Voice (Professional Male)</option>
              <option value="f38a635bee7a4d1f9b0a654a31d050d2">Chill Brian (Male)</option>
              <option value="acff30ce1e944de8ac429d26fa9367ad">Mark (Male)</option>
              {voices.filter(v => v.provider === 'heygen').map((voice) => (
                <option key={voice.id} value={voice.providerId}>
                  {voice.name} (HeyGen)
                </option>
              ))}
              {voices.filter(v => v.provider === 'custom').map((voice) => (
                <option key={voice.id} value={voice.providerId}>
                  {voice.name} (Custom)
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {provider === 'sora' && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Sora Model
            </label>
            <select
              value={soraModel}
              onChange={(e) => setSoraModel(e.target.value as 'sora-2' | 'sora-2-pro')}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="sora-2">sora-2 (standard)</option>
              <option value="sora-2-pro">sora-2-pro (higher fidelity)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Clip Duration (seconds)
            </label>
            <input
              type="number"
              min={4}
              max={20}
              value={soraSeconds}
              onChange={(e) => setSoraSeconds(parseInt(e.target.value || '8', 10))}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Prompt Override (optional)
            </label>
            <textarea
              rows={4}
              value={soraPrompt}
              onChange={(e) => setSoraPrompt(e.target.value)}
              placeholder="Describe the exact cinematic shot you want."
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Leave empty to use the script-derived prompt.
            </p>
          </div>
        </>
      )}

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
          disabled={generating}
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
