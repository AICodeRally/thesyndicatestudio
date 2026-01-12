'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function GlossaryAdminPage() {
  const [terms, setTerms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'

  useEffect(() => {
    loadTerms()
  }, [])

  const loadTerms = async () => {
    try {
      const res = await fetch('/api/content/glossary')
      if (res.ok) {
        const data = await res.json()
        setTerms(data.terms || [])
      }
    } catch (error) {
      console.error('Failed to load glossary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this term?')) return

    try {
      const res = await fetch(`/api/content/glossary/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setTerms(terms.filter((t) => t.id !== id))
      } else {
        alert('Failed to delete term')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete term')
    }
  }

  if (loading) {
    return (
      <div className="studio-shell min-h-screen flex items-center justify-center">
        <div className="text-[color:var(--studio-text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <span className="studio-tag">Glossary</span>
            <h1 className="mt-4 text-4xl font-serif">SPM Vocabulary</h1>
            <p className="mt-2 text-[color:var(--studio-text-muted)]">
              {terms.length} terms in rotation
            </p>
          </div>
          <Link href="/studio/content/glossary/new" className="studio-cta">
            Add Term
          </Link>
        </div>

        {terms.length === 0 ? (
          <div className="studio-card p-12 text-center">
            <h2 className="text-xl font-semibold text-[color:var(--studio-text)]">
              No terms yet
            </h2>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              Start building the syndicate glossary with your first definition.
            </p>
            <Link href="/studio/content/glossary/new" className="mt-6 inline-flex studio-cta">
              Add First Term
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {terms.map((term) => (
              <div key={term.id} className="studio-card p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-[color:var(--studio-text)]">
                        {term.term}
                      </h3>
                      <span className="studio-pill">{term.category}</span>
                    </div>
                    <p className="text-sm text-[color:var(--studio-text-muted)] mb-3">
                      {term.definition.substring(0, 200)}{term.definition.length > 200 ? '...' : ''}
                    </p>
                    {term.aliases.length > 0 && (
                      <p className="text-xs text-[color:var(--studio-text-muted)]">
                        Aliases: {term.aliases.join(', ')}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Link
                        href={`/studio/content/glossary/${term.id}`}
                        className="studio-cta-ghost"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(term.id)}
                        className="studio-cta-ghost text-[color:var(--studio-accent-3)] border-[color:var(--studio-accent-3)]"
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
      </div>
    </div>
  )
}
