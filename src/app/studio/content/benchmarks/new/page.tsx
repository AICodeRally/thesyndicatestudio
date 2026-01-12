'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewBenchmarkPage() {
  const router = useRouter()
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

      const res = await fetch('/api/content/benchmarks', {
        method: 'POST',
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
        setError(data.error || 'Failed to create benchmark')
      }
    } catch (err) {
      setError('Failed to create benchmark')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/benchmarks" className="studio-tag">
          Back to Benchmarks
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Add Benchmark</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Capture benchmark data and insights for the syndicate library.
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
                placeholder="Quota Attainment Distribution"
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
                  placeholder="quota-patterns"
                />
              </div>
              <div>
                <label className="studio-label">Category</label>
                <input
                  className="studio-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enterprise"
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
                placeholder="Describe the benchmark and how to interpret it."
              />
            </div>

            <div>
              <label className="studio-label">Insights (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.insights}
                onChange={(e) => setFormData({ ...formData, insights: e.target.value })}
                placeholder="Top 20% drive 60% of payout"
              />
            </div>

            <div>
              <label className="studio-label">Data (JSON)</label>
              <textarea
                className="studio-textarea font-mono text-sm"
                value={formData.dataJson}
                onChange={(e) => setFormData({ ...formData, dataJson: e.target.value })}
              />
              <p className="mt-2 text-xs text-[color:var(--studio-text-muted)]">
                Keep this JSON clean for chart rendering.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="studio-cta" disabled={saving}>
                {saving ? 'Saving...' : 'Create Benchmark'}
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
