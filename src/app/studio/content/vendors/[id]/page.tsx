'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export default function EditVendorPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoaded } = useUser()
  const isAdmin = user?.publicMetadata?.tier === 'ENTERPRISE'
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    loadVendor()
  }, [])

  const loadVendor = async () => {
    try {
      const res = await fetch(`/api/content/vendors/${params.id}`)
      if (res.ok) {
        const { vendor } = await res.json()
        const scores = vendor.scores as any
        setFormData({
          vendorName: vendor.vendorName,
          slug: vendor.slug,
          overallRating: vendor.overallRating,
          bestFor: vendor.bestFor.join(', '),
          worstFor: vendor.worstFor.join(', '),
          implementationReality: vendor.implementationReality,
          gotchas: vendor.gotchas.join(', '),
          easeScore: scores?.ease || 3,
          flexibilityScore: scores?.flexibility || 3,
          scaleScore: scores?.scale || 3,
          uxScore: scores?.ux || 3,
          integrationScore: scores?.integration || 3,
        })
      } else {
        setError('Vendor not found')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/content/vendors/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName: formData.vendorName,
          slug: formData.slug,
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
        setError('Failed to update vendor')
      }
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
          <p className="text-[color:var(--studio-text-muted)]">Sign in to edit vendor scorecards.</p>
          <Link href="/auth/signin" className="mt-4 inline-flex studio-cta">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Admin access required to edit vendors.</p>
          <Link href="/studio/content/vendors" className="mt-4 inline-flex studio-cta-ghost">Back to Vendors</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/vendors" className="studio-tag">
          Back to Vendors
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Edit Vendor Scorecard</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Tune the vendor record and keep the scorecard clean.
        </p>

        {error && (
          <div className="mt-6 studio-card p-4 text-sm text-[color:var(--studio-accent-3)]">
            {error}
          </div>
        )}

        <div className="mt-8 studio-panel">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="studio-label">Vendor Name</label>
              <input
                className="studio-input"
                required
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
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

            <div>
              <label className="studio-label">Overall Rating</label>
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
              <label className="studio-label">Best For</label>
              <input
                className="studio-input"
                required
                value={formData.bestFor}
                onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Worst For</label>
              <input
                className="studio-input"
                required
                value={formData.worstFor}
                onChange={(e) => setFormData({ ...formData, worstFor: e.target.value })}
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
                {saving ? 'Saving...' : 'Save Changes'}
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
