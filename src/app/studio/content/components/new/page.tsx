'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewComponentCardPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    bestFor: '',
    gotchas: '',
    examples: '',
    relatedCards: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/content/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          description: formData.description,
          bestFor: formData.bestFor.split(',').map((item) => item.trim()).filter(Boolean),
          gotchas: formData.gotchas.split(',').map((item) => item.trim()).filter(Boolean),
          examples: formData.examples.split(',').map((item) => item.trim()).filter(Boolean),
          relatedCards: formData.relatedCards.split(',').map((item) => item.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        router.push('/studio/content/components')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create component card')
      }
    } catch (err) {
      setError('Failed to create component card')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/components" className="studio-tag">
          Back to Components
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Add Component Card</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Define a plan component, ruleset, or admin object for the library.
        </p>

        {error && (
          <div className="mt-6 studio-card p-4 text-sm text-[color:var(--studio-accent-3)]">
            {error}
          </div>
        )}

        <div className="mt-8 studio-panel">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="studio-label">Name</label>
                <input
                  className="studio-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Accelerator"
                />
              </div>
              <div>
                <label className="studio-label">Slug</label>
                <input
                  className="studio-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated"
                />
              </div>
            </div>

            <div>
              <label className="studio-label">Category</label>
              <input
                className="studio-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="Plan Mechanics"
              />
            </div>

            <div>
              <label className="studio-label">Description</label>
              <textarea
                className="studio-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe how this component behaves in plan design."
              />
            </div>

            <div>
              <label className="studio-label">Best For (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                placeholder="Enterprise scale, Predictable attainment"
              />
            </div>

            <div>
              <label className="studio-label">Gotchas (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.gotchas}
                onChange={(e) => setFormData({ ...formData, gotchas: e.target.value })}
                placeholder="Cliff risk, Cost exposure"
              />
            </div>

            <div>
              <label className="studio-label">Examples (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                placeholder="2x accelerator over 120%"
              />
            </div>

            <div>
              <label className="studio-label">Related Cards (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.relatedCards}
                onChange={(e) => setFormData({ ...formData, relatedCards: e.target.value })}
                placeholder="Thresholds, Draws"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" className="studio-cta" disabled={saving}>
                {saving ? 'Saving...' : 'Create Component Card'}
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
