'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function ComponentsAdminPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const isAdmin = session?.user?.tier === 'ENTERPRISE'

  useEffect(() => {
    fetch('/api/content/components')
      .then((res) => res.json())
      .then((data) => setCards(data.cards || []))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this component card?')) return
    await fetch(`/api/content/components/${id}`, { method: 'DELETE' })
    setCards(cards.filter((c) => c.id !== id))
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
            <span className="studio-tag">Components</span>
            <h1 className="mt-4 text-4xl font-serif">Component Cards</h1>
          </div>
          <Link href="/studio/content/components/new" className="studio-cta">
            Add Component
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="studio-card p-6">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">
                  {card.name}
                </h2>
                <span className="studio-pill mt-2">{card.category}</span>
              </div>
              <p className="text-sm text-[color:var(--studio-text-muted)]">
                {card.description?.substring(0, 120)}{card.description?.length > 120 ? '...' : ''}
              </p>
              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <Link href={`/studio/content/components/${card.id}`} className="studio-cta-ghost flex-1 text-center">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="studio-cta-ghost text-[color:var(--studio-accent-3)] border-[color:var(--studio-accent-3)] flex-1"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
