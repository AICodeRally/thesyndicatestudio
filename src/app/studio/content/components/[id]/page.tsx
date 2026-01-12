'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export default function EditComponentCardPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const isAdmin = user?.publicMetadata?.tier === 'ENTERPRISE'
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    loadCard()
  }, [])

  const loadCard = async () => {
    try {
      const res = await fetch(`/api/content/components/${params.id}`)
      if (res.ok) {
        const { card } = await res.json()
        setFormData({
          name: card.name,
          slug: card.slug,
          category: card.category,
          description: card.description,
          bestFor: card.bestFor.join(', '),
          gotchas: card.gotchas.join(', '),
          examples: card.examples.join(', '),
          relatedCards: card.relatedCards.join(', '),
        })
      } else {
        setError('Component card not found')
      }
    } catch (err) {
      setError('Failed to load component card')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/content/components/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
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
        setError(data.error || 'Failed to update component card')
      }
    } catch (err) {
      setError('Failed to update component card')
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
          <p className="text-[color:var(--studio-text-muted)]">Sign in to edit component cards.</p>
          <Link href="/auth/signin" className="mt-4 inline-flex studio-cta">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Admin access required to edit component cards.</p>
          <Link href="/studio/content/components" className="mt-4 inline-flex studio-cta-ghost">Back to Components</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/components" className="studio-tag">
          Back to Components
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Edit Component Card</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Update details and keep the library clean.
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
                />
              </div>
              <div>
                <label className="studio-label">Slug</label>
                <input
                  className="studio-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
              />
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
              <label className="studio-label">Best For (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Gotchas (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.gotchas}
                onChange={(e) => setFormData({ ...formData, gotchas: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Examples (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Related Cards (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.relatedCards}
                onChange={(e) => setFormData({ ...formData, relatedCards: e.target.value })}
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
