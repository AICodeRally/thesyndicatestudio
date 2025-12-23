"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { VideoRenderer } from "@/components/studio/VideoRenderer"

interface Episode {
  id: string
  series: string
  title: string
  premise: string
  status: string
  publishDateTarget: string | null
  canonicalScript: any | null
  scripts: any[]
  cuts: any[]
  assets: any[]
  counselRefs: string[] | null
  createdAt: string
  updatedAt: string
}

export default function EpisodeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [extractedCounsel, setExtractedCounsel] = useState<any[]>([])
  const [publishing, setPublishing] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  useEffect(() => {
    loadEpisode()
  }, [params.id])

  const loadEpisode = async () => {
    try {
      const res = await fetch(`/api/studio/episodes/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setEpisode(data.episode)
      }
    } catch (error) {
      console.error('Failed to load episode:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateScript = async () => {
    setGenerating('script')
    try {
      const res = await fetch(`/api/studio/episodes/${params.id}/generate-script`, {
        method: 'POST',
      })
      if (res.ok) {
        await loadEpisode()
      }
    } catch (error) {
      console.error('Failed to generate script:', error)
    } finally {
      setGenerating(null)
    }
  }

  const generateCuts = async () => {
    setGenerating('cuts')
    try {
      const res = await fetch(`/api/studio/episodes/${params.id}/generate-cuts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formats: ['YT_SHORT', 'TIKTOK', 'LINKEDIN'],
        }),
      })
      if (res.ok) {
        await loadEpisode()
      }
    } catch (error) {
      console.error('Failed to generate cuts:', error)
    } finally {
      setGenerating(null)
    }
  }

  const extractCounsel = async () => {
    setGenerating('counsel')
    try {
      const res = await fetch(`/api/studio/episodes/${params.id}/validate`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setExtractedCounsel(data.counselItems || [])
        await loadEpisode()
      }
    } catch (error) {
      console.error('Failed to extract Counsel:', error)
    } finally {
      setGenerating(null)
    }
  }

  const publishEpisode = async () => {
    setPublishing(true)
    try {
      const res = await fetch(`/api/studio/episodes/${params.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeVideoId: youtubeUrl ? new URL(youtubeUrl).searchParams.get('v') || youtubeUrl : null,
        }),
      })
      if (res.ok) {
        await loadEpisode()
        alert('Episode published! It now appears in /episodes public library.')
      }
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading episode...</div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Episode not found</div>
      </div>
    )
  }

  const statusColors = {
    DRAFT: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    GENERATING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PENDING_REVIEW: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/studio"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Studio
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {episode.title}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                {episode.premise}
              </p>
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500">
                <span className="uppercase tracking-wide">{episode.series}</span>
                {episode.publishDateTarget && (
                  <>
                    <span>·</span>
                    <span>Target: {new Date(episode.publishDateTarget).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[episode.status as keyof typeof statusColors]}`}>
              {episode.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* 4-Step Pipeline */}
        <div className="space-y-6">
          {/* Step 1: Script */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.canonicalScript ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {episode.canonicalScript ? '✓' : '1'}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Generate Script
                </h3>
              </div>
              {!episode.canonicalScript && (
                <button
                  onClick={generateScript}
                  disabled={generating === 'script'}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {generating === 'script' ? 'Generating...' : 'Generate Script'}
                </button>
              )}
            </div>

            {episode.canonicalScript && (
              <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Canonical Script (v{episode.canonicalScript.version})
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(episode.canonicalScript.createdAt).toLocaleString()}
                  </span>
                </div>
                <pre className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {episode.canonicalScript.content.substring(0, 500)}...
                </pre>
              </div>
            )}
          </div>

          {/* Step 2: Cuts */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.cuts.length > 0 ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {episode.cuts.length > 0 ? '✓' : '2'}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Generate Platform Cuts
                </h3>
              </div>
              {episode.canonicalScript && episode.cuts.length === 0 && (
                <button
                  onClick={generateCuts}
                  disabled={generating === 'cuts'}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {generating === 'cuts' ? 'Generating...' : 'Generate Cuts'}
                </button>
              )}
            </div>

            {episode.cuts.length > 0 && (
              <div className="mt-4 space-y-4">
                {episode.cuts.map((cut: any) => (
                  <div
                    key={cut.id}
                    className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {cut.format.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 ml-3">
                          Target: {cut.durationTarget}s
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        {cut.status}
                      </span>
                    </div>

                    {/* Video Generation for this cut */}
                    <VideoRenderer
                      episodeId={episode.id}
                      cutId={cut.id}
                      cutFormat={cut.format}
                      onComplete={() => loadEpisode()}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: Extract Counsel */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.counselRefs && episode.counselRefs.length > 0 ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {episode.counselRefs && episode.counselRefs.length > 0 ? '✓' : '3'}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Extract Counsel Items
                </h3>
              </div>
              {episode.canonicalScript && (
                <button
                  onClick={extractCounsel}
                  disabled={generating === 'counsel'}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {generating === 'counsel' ? 'Extracting...' : 'Extract Counsel'}
                </button>
              )}
            </div>

            {extractedCounsel.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  AI extracted {extractedCounsel.length} Counsel items from this script:
                </p>
                {extractedCounsel.map((counsel: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {counsel.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {counsel.difficulty}
                      </span>
                    </div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {counsel.title}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {counsel.oneLiner}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {counsel.problemStatement}
                    </p>
                  </div>
                ))}
                <p className="text-xs text-zinc-500 dark:text-zinc-500 italic mt-4">
                  Note: These are AI-generated drafts. Review, edit, and manually publish to Counsel library.
                </p>
              </div>
            )}

            {episode.counselRefs && episode.counselRefs.length > 0 && extractedCounsel.length === 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ {episode.counselRefs.length} Counsel items extracted and linked
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Publish */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {episode.status === 'PUBLISHED' ? '✓' : '4'}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Publish Episode
                </h3>
              </div>
            </div>

            {episode.status === 'PUBLISHED' ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    ✓ Episode published and live in public library
                  </p>
                  <Link
                    href={`/episodes/${episode.id}`}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
                  >
                    View public page →
                  </Link>
                </div>
                {episode.youtubeVideoId && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      YouTube: {episode.youtubeVideoId}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Ready to publish? Your episode will appear in the public library at <span className="font-mono">/episodes</span>
                </p>

                {/* Optional YouTube Video ID */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    YouTube Video URL (optional)
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    If you've uploaded to YouTube, paste the URL here to embed on the public page
                  </p>
                </div>

                <button
                  onClick={publishEpisode}
                  disabled={publishing || !episode.canonicalScript}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {publishing ? 'Publishing...' : 'Publish Episode'}
                </button>

                {!episode.canonicalScript && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Generate a script first before publishing
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Script Preview */}
        {episode.canonicalScript && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Script
            </h2>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <pre className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                {episode.canonicalScript.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
