'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { VideoRenderer } from '@/components/studio/VideoRenderer'

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
  const { user } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'
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
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Loading episode...</div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Episode not found</div>
      </div>
    )
  }

  const statusLabels: Record<string, string> = {
    DRAFT: 'Draft',
    GENERATING: 'Generating',
    PENDING_REVIEW: 'Pending Review',
    PUBLISHED: 'Published',
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link href="/studio" className="studio-tag">
          Back to Studio
        </Link>

        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif">{episode.title}</h1>
              <p className="mt-3 text-[color:var(--studio-text-muted)]">
                {episode.premise}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[color:var(--studio-text-muted)]">
                <span className="uppercase tracking-[0.2em]">{episode.series}</span>
                {episode.publishDateTarget && (
                  <>
                    <span>•</span>
                    <span>Target: {new Date(episode.publishDateTarget).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
            <span className="studio-pill">{statusLabels[episode.status] || episode.status}</span>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="studio-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.canonicalScript ? 'bg-[color:var(--studio-accent)] text-black' : 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]'}`}>
                  {episode.canonicalScript ? '✓' : '1'}
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                  Generate Script
                </h3>
              </div>
              {!episode.canonicalScript && (
                isAdmin ? (
                  <button
                    onClick={generateScript}
                    disabled={generating === 'script'}
                    className="studio-cta"
                  >
                    {generating === 'script' ? 'Generating...' : 'Generate Script'}
                  </button>
                ) : (
                  <div className="studio-card p-3 text-sm text-[color:var(--studio-text-muted)]">
                    Admin access required to generate scripts.
                  </div>
                )
              )}
            </div>

            {episode.canonicalScript && (
              <div className="mt-6 studio-card p-4">
                <div className="flex items-center justify-between mb-2 text-xs text-[color:var(--studio-text-muted)]">
                  <span>Canonical Script (v{episode.canonicalScript.version})</span>
                  <span>{new Date(episode.canonicalScript.createdAt).toLocaleString()}</span>
                </div>
                <pre className="text-xs text-[color:var(--studio-text-muted)] whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {episode.canonicalScript.content}
                </pre>
              </div>
            )}
          </div>

          <div className="studio-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.cuts.length > 0 ? 'bg-[color:var(--studio-accent)] text-black' : 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]'}`}>
                  {episode.cuts.length > 0 ? '✓' : '2'}
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                  Generate Cuts
                </h3>
              </div>
              {episode.canonicalScript && (
                isAdmin ? (
                  <button
                    onClick={generateCuts}
                    disabled={generating === 'cuts'}
                    className="studio-cta"
                  >
                    {generating === 'cuts' ? 'Generating...' : 'Generate Cuts'}
                  </button>
                ) : (
                  <div className="studio-card p-3 text-sm text-[color:var(--studio-text-muted)]">
                    Admin access required to generate cuts.
                  </div>
                )
              )}
            </div>

            {episode.cuts.length > 0 && (
              <div className="mt-6 space-y-4">
                {episode.cuts.map((cut) => (
                  <div key={cut.id} className="studio-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--studio-text)]">
                          {cut.format}
                        </p>
                        <p className="text-xs text-[color:var(--studio-text-muted)]">
                          {cut.status}
                        </p>
                      </div>
                      {cut.videoUrl && (
                        <VideoRenderer url={cut.videoUrl} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="studio-card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.counselRefs && episode.counselRefs.length > 0 ? 'bg-[color:var(--studio-accent)] text-black' : 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]'}`}>
                  {episode.counselRefs && episode.counselRefs.length > 0 ? '✓' : '3'}
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                  Extract Counsel Items
                </h3>
              </div>
              {episode.canonicalScript && (
                isAdmin ? (
                  <button
                    onClick={extractCounsel}
                    disabled={generating === 'counsel'}
                    className="studio-cta"
                  >
                    {generating === 'counsel' ? 'Extracting...' : 'Extract Counsel'}
                  </button>
                ) : (
                  <div className="studio-card p-3 text-sm text-[color:var(--studio-text-muted)]">
                    Admin access required to extract counsel.
                  </div>
                )
              )}
            </div>

            {extractedCounsel.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-[color:var(--studio-text-muted)]">
                  AI extracted {extractedCounsel.length} Counsel items:
                </p>
                {extractedCounsel.map((counsel: any, idx: number) => (
                  <div key={idx} className="studio-card p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="studio-pill">{counsel.type}</span>
                      <span className="studio-pill">{counsel.difficulty}</span>
                    </div>
                    <h4 className="font-semibold text-[color:var(--studio-text)] mb-1">
                      {counsel.title}
                    </h4>
                    <p className="text-sm text-[color:var(--studio-text-muted)] mb-2">
                      {counsel.oneLiner}
                    </p>
                    <p className="text-xs text-[color:var(--studio-text-muted)]">
                      {counsel.problemStatement}
                    </p>
                  </div>
                ))}
                <p className="text-xs text-[color:var(--studio-text-muted)] italic">
                  Review and publish these drafts into the Counsel library.
                </p>
              </div>
            )}

            {episode.counselRefs && episode.counselRefs.length > 0 && extractedCounsel.length === 0 && (
              <div className="mt-4 studio-card p-3">
                <p className="text-sm text-[color:var(--studio-accent)]">
                  ✓ {episode.counselRefs.length} Counsel items extracted and linked
                </p>
              </div>
            )}
          </div>

          <div className="studio-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${episode.status === 'PUBLISHED' ? 'bg-[color:var(--studio-accent)] text-black' : 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]'}`}>
                {episode.status === 'PUBLISHED' ? '✓' : '4'}
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--studio-text)]">
                Publish Episode
              </h3>
            </div>

            {episode.status === 'PUBLISHED' ? (
              <div className="space-y-3">
                <div className="studio-card p-3">
                  <p className="text-sm text-[color:var(--studio-accent)] mb-2">
                    ✓ Episode published and live in public library
                  </p>
                  <Link
                    href={`/episodes/${episode.id}`}
                    className="text-xs text-[color:var(--studio-accent)] hover:underline font-semibold"
                  >
                    View public page →
                  </Link>
                </div>
                {episode.youtubeVideoId && (
                  <div className="studio-card p-3">
                    <p className="text-xs text-[color:var(--studio-text-muted)]">
                      YouTube: {episode.youtubeVideoId}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[color:var(--studio-text-muted)]">
                  Ready to publish? This episode will appear in the public library.
                </p>

                <div>
                  <label className="studio-label">YouTube Video URL (optional)</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="studio-input"
                  />
                  <p className="mt-1 text-xs text-[color:var(--studio-text-muted)]">
                    Paste the URL to embed the public page.
                  </p>
                </div>

                {isAdmin ? (
                  <button
                    onClick={publishEpisode}
                    disabled={publishing || !episode.canonicalScript}
                    className="studio-cta w-full"
                  >
                    {publishing ? 'Publishing...' : 'Publish Episode'}
                  </button>
                ) : (
                  <div className="studio-card p-4 text-sm text-[color:var(--studio-text-muted)]">
                    Admin access required to publish this episode.
                  </div>
                )}

                {!episode.canonicalScript && (
                  <p className="text-xs text-[color:var(--studio-accent-3)]">
                    Generate a script first before publishing.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {episode.canonicalScript && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-[color:var(--studio-text)] mb-4">
              Script Preview
            </h2>
            <div className="studio-card p-6">
              <pre className="text-sm text-[color:var(--studio-text-muted)] whitespace-pre-wrap font-mono">
                {episode.canonicalScript.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
