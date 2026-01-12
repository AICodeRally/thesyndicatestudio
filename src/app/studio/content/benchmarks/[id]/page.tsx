'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function EditBenchmarkPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: isLoaded } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    insights: '',
    dataJson: '{\n  "series": []\n}',
  })

  useEffect(() => {
    loadBenchmark()
  }, [])

  const loadBenchmark = async () => {
    try {
      const res = await fetch(`/api/content/benchmarks/${params.id}`)
      if (res.ok) {
        const { benchmark } = await res.json()
        setFormData({
          title: benchmark.title,
          type: benchmark.type,
          category: benchmark.category || '',
          description: benchmark.description,
          insights: benchmark.insights.join(', '),
          dataJson: JSON.stringify(benchmark.data, null, 2),
        })
      } else {
        setError('Benchmark not found')
      }
    } catch (err) {
      setError('Failed to load benchmark')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      let dataPayload
      try {
        dataPayload = JSON.parse(formData.dataJson)
      } catch (err) {
        setError('Benchmark data must be valid JSON')
        setSaving(false)
        return
      }

      const res = await fetch(`/api/content/benchmarks/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          category: formData.category || null,
          description: formData.description,
          insights: formData.insights.split(',').map((item) => item.trim()).filter(Boolean),
          data: dataPayload,
        }),
      })

      if (res.ok) {
        router.push('/studio/content/benchmarks')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update benchmark')
      }
    } catch (err) {
      setError('Failed to update benchmark')
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Sign in to edit benchmarks.</p>
          <Link href="/auth/signin" className="mt-4 inline-flex studio-cta">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Admin access required to edit benchmarks.</p>
          <Link href="/studio/content/benchmarks" className="mt-4 inline-flex studio-cta-ghost">Back to Benchmarks</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/benchmarks" className="studio-tag">
          Back to Benchmarks
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Edit Benchmark</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Tune the benchmark data and insights.
        </p>

        {error && (
          <div className="mt-6 studio-card p-4 text-sm text-[color:var(--studio-accent-3)]">
            {error}
          </div>
        )}

        <div className="mt-8 studio-panel">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="studio-label">Title</label>
              <input
                className="studio-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="studio-label">Type</label>
                <input
                  className="studio-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="studio-label">Category</label>
                <input
                  className="studio-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="studio-label">Description</label>
              <textarea
                className="studio-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="studio-label">Insights (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.insights}
                onChange={(e) => setFormData({ ...formData, insights: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Data (JSON)</label>
              <textarea
                className="studio-textarea font-mono text-sm"
                value={formData.dataJson}
                onChange={(e) => setFormData({ ...formData, dataJson: e.target.value })}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="studio-cta" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="studio-cta-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
