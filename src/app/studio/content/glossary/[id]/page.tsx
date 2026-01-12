'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function EditGlossaryTermPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.tier === 'ENTERPRISE'
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    loadTerm()
  }, [])

  const loadTerm = async () => {
    try {
      const res = await fetch(`/api/content/glossary/${params.id}`)
      if (res.ok) {
        const { term } = await res.json()
        setFormData({
          term: term.term,
          definition: term.definition,
          category: term.category,
          aliases: term.aliases.join(', '),
          relatedTerms: term.relatedTerms.join(', '),
          examples: term.examples || '',
        })
      } else {
        setError('Term not found')
      }
    } catch (error) {
      console.error('Failed to load term:', error)
      setError('Failed to load term')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/content/glossary/${params.id}`, {
        method: 'PUT',
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
        setError('Failed to update term')
      }
    } catch (error) {
      console.error('Error updating term:', error)
      setError('Failed to update term')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Loading...</div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Sign in to edit glossary terms.</p>
          <Link href="/auth/signin" className="mt-4 inline-flex studio-cta">Sign In</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="studio-card p-6 text-center">
          <p className="text-[color:var(--studio-text-muted)]">Admin access required to edit glossary terms.</p>
          <Link href="/studio/content/glossary" className="mt-4 inline-flex studio-cta-ghost">Back to Glossary</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/studio/content/glossary" className="studio-tag">
          Back to Glossary
        </Link>

        <h1 className="mt-6 text-4xl font-serif">Edit Glossary Term</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Keep the vocabulary clean and consistent.
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
              />
            </div>

            <div>
              <label className="studio-label">Definition</label>
              <textarea
                className="studio-textarea"
                required
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
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
              />
            </div>

            <div>
              <label className="studio-label">Related Terms (comma-separated)</label>
              <input
                className="studio-input"
                value={formData.relatedTerms}
                onChange={(e) => setFormData({ ...formData, relatedTerms: e.target.value })}
              />
            </div>

            <div>
              <label className="studio-label">Example</label>
              <textarea
                className="studio-textarea"
                rows={3}
                value={formData.examples}
                onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              />
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
