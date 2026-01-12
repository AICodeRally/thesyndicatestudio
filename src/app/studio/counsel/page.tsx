'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface CounselItem {
  id: string
  slug: string
  title: string
  oneLiner: string
  type: string
  channelPrimary: string
  difficulty: string
  status: string
  createdAt: string
}

const STATUS_OPTIONS = ['ALL', 'DRAFT', 'PUBLISHED'] as const
const TYPE_OPTIONS = ['All Types', 'NOTE', 'CHECKLIST', 'TEMPLATE', 'MODEL', 'PROTOCOL', 'DIAGNOSTIC'] as const

const statusColors: Record<string, string> = {
  DRAFT: 'bg-amber-900/30 text-amber-400',
  PUBLISHED: 'bg-emerald-900/30 text-emerald-400',
}

const difficultyColors: Record<string, string> = {
  INTRO: 'bg-blue-900/30 text-blue-400',
  OPERATOR: 'bg-purple-900/30 text-purple-400',
  ARCHITECT: 'bg-rose-900/30 text-rose-400',
}

export default function CounselPage() {
  const { user } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'
  const [counsel, setCounsel] = useState<CounselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('All Types')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [publishing, setPublishing] = useState<string | null>(null)

  useEffect(() => {
    loadCounsel()
  }, [])

  const loadCounsel = async () => {
    try {
      const res = await fetch('/api/studio/counsel')
      if (res.ok) {
        const data = await res.json()
        setCounsel(data.counsel || [])
      }
    } catch (error) {
      console.error('Failed to load counsel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/studio/counsel/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setCounsel(counsel.filter(c => c.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete counsel:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handlePublish = async (id: string) => {
    setPublishing(id)
    try {
      const res = await fetch(`/api/studio/counsel/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })
      if (res.ok) {
        setCounsel(counsel.map(c => c.id === id ? { ...c, status: 'PUBLISHED' } : c))
      }
    } catch (error) {
      console.error('Failed to publish counsel:', error)
    } finally {
      setPublishing(null)
    }
  }

  const filteredCounsel = counsel.filter(item => {
    const matchesSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.oneLiner.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
    const matchesType = typeFilter === 'All Types' || item.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const statusCounts = counsel.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
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
            <h1 className="mt-4 text-4xl md:text-5xl font-serif">Counsel Library</h1>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              Manage counsel items extracted from episodes. {counsel.length} total.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="studio-panel mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or one-liner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="studio-input w-full"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="studio-select"
            >
              {TYPE_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
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
                {status === 'ALL' ? 'All' : status}
                {status === 'ALL' ? ` (${counsel.length})` : statusCounts[status] ? ` (${statusCounts[status]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Counsel List */}
        {filteredCounsel.length === 0 ? (
          <div className="studio-card p-12 text-center">
            <h2 className="text-2xl font-semibold text-[color:var(--studio-text)]">
              {counsel.length === 0 ? 'No counsel items yet' : 'No matching items'}
            </h2>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              {counsel.length === 0
                ? 'Extract counsel items from episodes to populate this library.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCounsel.map((item) => (
              <div
                key={item.id}
                className="studio-card p-6 relative"
              >
                {/* Delete Confirmation Modal */}
                {deleteConfirm === item.id && (
                  <div className="absolute inset-0 bg-[color:var(--studio-bg)]/95 flex items-center justify-center rounded-lg z-10">
                    <div className="text-center p-6">
                      <h3 className="text-lg font-semibold text-[color:var(--studio-text)] mb-2">
                        Delete this counsel item?
                      </h3>
                      <p className="text-sm text-[color:var(--studio-text-muted)] mb-4">
                        This will permanently delete "{item.title}".
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
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`studio-pill ${statusColors[item.status] || ''}`}>
                        {item.status}
                      </span>
                      <span className="studio-pill">{item.type}</span>
                      <span className={`studio-pill ${difficultyColors[item.difficulty] || ''}`}>
                        {item.difficulty}
                      </span>
                      <span className="studio-pill">{item.channelPrimary.replace('_', ' ')}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-[color:var(--studio-text)] mb-1">
                      {item.title}
                    </h2>
                    <p className="text-sm text-[color:var(--studio-text-muted)] mb-2">
                      {item.oneLiner}
                    </p>
                    <p className="text-xs text-[color:var(--studio-text-muted)]">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      {item.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(item.id)}
                          disabled={publishing === item.id}
                          className="studio-cta text-sm"
                        >
                          {publishing === item.id ? 'Publishing...' : 'Publish'}
                        </button>
                      )}
                      {item.status === 'PUBLISHED' && (
                        <Link
                          href={`/counsel/${item.slug}`}
                          className="studio-cta-ghost text-sm"
                          target="_blank"
                        >
                          View
                        </Link>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
