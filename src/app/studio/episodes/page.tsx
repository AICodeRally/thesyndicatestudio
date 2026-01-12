'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Episode {
  id: string
  series: string
  title: string
  premise: string
  status: string
  publishDateTarget: string | null
  createdAt: string
  canonicalScript: { id: string; content: string } | null
  scripts: { id: string }[]
  cuts: { id: string; format: string }[]
  assets: { id: string; type: string }[]
}

const STATUS_OPTIONS = ['ALL', 'DRAFT', 'GENERATING', 'PENDING_REVIEW', 'PUBLISHED'] as const
const SERIES_OPTIONS = ['All Series', 'Intelligent Sales', 'Todd Takes', 'The Week in Intelligent Sales', 'Ask Todd Live'] as const

const statusColors: Record<string, string> = {
  DRAFT: 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]',
  GENERATING: 'bg-amber-900/30 text-amber-400',
  PENDING_REVIEW: 'bg-purple-900/30 text-purple-400',
  PUBLISHED: 'bg-emerald-900/30 text-emerald-400',
}

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [seriesFilter, setSeriesFilter] = useState<string>('All Series')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEpisodes()
  }, [])

  const loadEpisodes = async () => {
    try {
      const res = await fetch('/api/studio/episodes')
      if (res.ok) {
        const data = await res.json()
        setEpisodes(data.episodes || [])
      }
    } catch (error) {
      console.error('Failed to load episodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/studio/episodes/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setEpisodes(episodes.filter(e => e.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete episode:', error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = !search ||
      episode.title.toLowerCase().includes(search.toLowerCase()) ||
      episode.premise.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || episode.status === statusFilter
    const matchesSeries = seriesFilter === 'All Series' || episode.series === seriesFilter
    return matchesSearch && matchesStatus && matchesSeries
  })

  const statusCounts = episodes.reduce((acc, ep) => {
    acc[ep.status] = (acc[ep.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="studio-shell min-h-screen">
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-[color:var(--studio-surface-2)] rounded w-1/3"></div>
            <div className="h-6 bg-[color:var(--studio-surface-2)] rounded w-1/2"></div>
            <div className="h-32 bg-[color:var(--studio-surface-2)] rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <Link href="/studio" className="studio-tag">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-4 text-4xl md:text-5xl font-serif">Episodes</h1>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              Manage all your episodes. {episodes.length} total.
            </p>
          </div>
          <Link href="/studio/episodes/new" className="studio-cta">
            New Episode
          </Link>
        </div>

        {/* Filters */}
        <div className="studio-panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or premise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="studio-input w-full"
              />
            </div>

            {/* Series Filter */}
            <select
              value={seriesFilter}
              onChange={(e) => setSeriesFilter(e.target.value)}
              className="studio-select"
            >
              {SERIES_OPTIONS.map(series => (
                <option key={series} value={series}>{series}</option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-[color:var(--studio-accent)] text-[color:var(--studio-bg)]'
                    : 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)] hover:text-[color:var(--studio-text)]'
                }`}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                {status === 'ALL' ? ` (${episodes.length})` : statusCounts[status] ? ` (${statusCounts[status]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes List */}
        {filteredEpisodes.length === 0 ? (
          <div className="studio-card p-12 text-center">
            <h2 className="text-2xl font-semibold text-[color:var(--studio-text)]">
              {episodes.length === 0 ? 'No episodes yet' : 'No matching episodes'}
            </h2>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              {episodes.length === 0
                ? 'Create your first episode to get started.'
                : 'Try adjusting your search or filters.'}
            </p>
            {episodes.length === 0 && (
              <Link href="/studio/episodes/new" className="mt-6 inline-flex studio-cta">
                Create First Episode
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className="studio-card p-6 relative"
              >
                {/* Delete Confirmation Modal */}
                {deleteConfirm === episode.id && (
                  <div className="absolute inset-0 bg-[color:var(--studio-bg)]/95 flex items-center justify-center rounded-lg z-10">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-semibold text-[color:var(--studio-text)] mb-2">
                        Delete this episode?
                      </h3>
                      <p className="text-sm text-[color:var(--studio-text-muted)] mb-4">
                        This will permanently delete "{episode.title}" and all its scripts, cuts, and assets.
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="studio-cta-ghost"
                          disabled={deleting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(episode.id)}
                          disabled={deleting}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-4">
                  <Link href={`/studio/episodes/${episode.id}`} className="flex-1 group">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-[color:var(--studio-text)] group-hover:text-[color:var(--studio-accent)] transition-colors">
                        {episode.title}
                      </h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[episode.status] || statusColors.DRAFT}`}>
                        {episode.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-[color:var(--studio-text-muted)] mb-2 line-clamp-2">
                      {episode.premise}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--studio-text-muted)]">
                      <span className="uppercase tracking-[0.2em]">{episode.series}</span>
                      <span>•</span>
                      <span>{new Date(episode.createdAt).toLocaleDateString()}</span>
                      {episode.publishDateTarget && (
                        <>
                          <span>•</span>
                          <span>Target: {new Date(episode.publishDateTarget).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/studio/episodes/${episode.id}`}
                      className="studio-cta-ghost text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(episode.id)}
                      className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="studio-pill">
                    {episode.canonicalScript ? '1 Script' : 'No Script'}
                  </span>
                  <span className="studio-pill">
                    {episode.cuts.length} Cuts
                  </span>
                  <span className="studio-pill">
                    {episode.assets.length} Assets
                  </span>
                  {episode.cuts.length > 0 && (
                    <span className="studio-pill text-[color:var(--studio-accent)]">
                      {episode.cuts.map(c => c.format).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
