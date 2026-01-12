'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewVendorPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    vendorName: '',
    slug: '',
    overallRating: 3.0,
    bestFor: '',
    worstFor: '',
    implementationReality: '',
    gotchas: '',
    easeScore: 3,
    flexibilityScore: 3,
    scaleScore: 3,
    uxScore: 3,
    integrationScore: 3,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/content/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: formData.vendorName,
          slug: formData.slug || formData.vendorName.toLowerCase().replace(/\s+/g, '-'),
          overallRating: formData.overallRating,
          bestFor: formData.bestFor.split(',').map((b) => b.trim()).filter(Boolean),
          worstFor: formData.worstFor.split(',').map((w) => w.trim()).filter(Boolean),
          implementationReality: formData.implementationReality,
          gotchas: formData.gotchas.split(',').map((g) => g.trim()).filter(Boolean),
          scores: {
            ease: formData.easeScore,
            flexibility: formData.flexibilityScore,
            scale: formData.scaleScore,
            ux: formData.uxScore,
            integration: formData.integrationScore,
          },
        }),
      })

      if (res.ok) {
        router.push('/studio/content/vendors')
      } else {
        setError('Failed to create vendor')
      }
    } catch (error) {
      console.error('Error creating vendor:', error)
      setError('Failed to create vendor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/vendors" className="studio-tag">
          Back to Vendors
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Add Vendor Scorecard</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Capture vendor performance and implementation reality.
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
                <label className="studio-label">Vendor Name</label>
                <input
                  className="studio-input"
                  required
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  placeholder="Xactly"
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
              <label className="studio-label">Overall Rating (1-5)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-2xl text-[color:var(--studio-accent)] font-bold w-16 text-right">
                  {formData.overallRating}
                </span>
              </div>
            </div>

            <div>
              <label className="studio-label">Best For (comma-separated)</label>
              <input
                className="studio-input"
                required
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                placeholder="Enterprise scale, Complex hierarchies"
              />
            </div>

            <div>
              <label className="studio-label">Worst For (comma-separated)</label>
              <input
                className="studio-input"
                required
                value={formData.worstFor}
                onChange={(e) => setFormData({ ...formData, worstFor: e.target.value })}
                placeholder="Fast iteration, Modern UX"
              />
            </div>

            <div>
              <label className="studio-label">Implementation Reality</label>
              <textarea
                className="studio-textarea"
                required
                rows={4}
                value={formData.implementationReality}
                onChange={(e) => setFormData({ ...formData, implementationReality: e.target.value })}
                placeholder="What actually happens during implementation..."
              />
            </div>

            <div>
              <label className="studio-label">Gotchas (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.gotchas}
                onChange={(e) => setFormData({ ...formData, gotchas: e.target.value })}
                placeholder="Long implementation times, Expensive services"
              />
            </div>

            <div className="studio-card p-6">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)] mb-4">
                Detailed Scores (1-5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'easeScore', label: 'Ease of Use' },
                  { key: 'flexibilityScore', label: 'Flexibility' },
                  { key: 'scaleScore', label: 'Scale' },
                  { key: 'uxScore', label: 'User Experience' },
                  { key: 'integrationScore', label: 'Integration' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="studio-label">{label}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-[color:var(--studio-accent)] font-semibold w-8 text-right">
                        {formData[key as keyof typeof formData]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" disabled={saving} className="studio-cta">
                {saving ? 'Creating...' : 'Create Vendor Scorecard'}
              </button>
              <button type="button" onClick={() => router.back()} className="studio-cta-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
