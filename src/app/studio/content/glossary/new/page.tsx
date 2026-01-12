'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewGlossaryTermPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    category: 'Comp Design',
    aliases: '',
    relatedTerms: '',
    examples: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/content/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aliases: formData.aliases.split(',').map((a) => a.trim()).filter(Boolean),
          relatedTerms: formData.relatedTerms.split(',').map((r) => r.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        router.push('/studio/content/glossary')
      } else {
        setError('Failed to create term')
      }
    } catch (error) {
      console.error('Error creating term:', error)
      setError('Failed to create term')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/glossary" className="studio-tag">
          Back to Glossary
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Add Glossary Term</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Define the language the syndicate uses.
        </p>

        {error && (
          <div className="mt-6 studio-card p-4 text-sm text-[color:var(--studio-accent-3)]">
            {error}
          </div>
        )}

        <div className="mt-8 studio-panel">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="studio-label">Term</label>
              <input
                className="studio-input"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                placeholder="Accelerator"
              />
            </div>

            <div>
              <label className="studio-label">Definition</label>
              <textarea
                className="studio-textarea"
                required
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                placeholder="Clear, concise definition..."
              />
            </div>

            <div>
              <label className="studio-label">Category</label>
              <select
                className="studio-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Comp Design">Comp Design</option>
                <option value="Admin">Admin</option>
                <option value="Governance">Governance</option>
                <option value="Analytics">Analytics</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div>
              <label className="studio-label">Aliases (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                placeholder="Kicker, Multiplier, Uplift"
              />
            </div>

            <div>
              <label className="studio-label">Related Terms (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.relatedTerms}
                onChange={(e) => setFormData({ ...formData, relatedTerms: e.target.value })}
                placeholder="Quota, Payout Curve, Attainment"
              />
            </div>

            <div>
              <label className="studio-label">Example</label>
              <textarea
                className="studio-textarea"
                rows={3}
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                placeholder="Concrete example of this term in use..."
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button type="submit" disabled={saving} className="studio-cta">
                {saving ? 'Creating...' : 'Create Term'}
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
