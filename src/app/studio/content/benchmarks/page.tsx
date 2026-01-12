'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function BenchmarksAdminPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const isAdmin = user?.tier === 'ENTERPRISE'

  useEffect(() => {
    fetch('/api/content/benchmarks')
      .then((res) => res.json())
      .then((data) => setBenchmarks(data.benchmarks || []))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this benchmark?')) return
    await fetch(`/api/content/benchmarks/${id}`, { method: 'DELETE' })
    setBenchmarks(benchmarks.filter((b) => b.id !== id))
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
            <span className="studio-tag">Benchmarks</span>
            <h1 className="mt-4 text-4xl font-serif">Benchmark Library</h1>
          </div>
          <Link href="/studio/content/benchmarks/new" className="studio-cta">
            Add Benchmark
          </Link>
        </div>

        {benchmarks.length === 0 ? (
          <div className="studio-card p-12 text-center">
            <p className="text-[color:var(--studio-text-muted)]">
              No benchmarks yet. Add your first benchmark to get started.
            </p>
            <Link href="/studio/content/benchmarks/new" className="mt-6 inline-flex studio-cta">
              Add First Benchmark
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benchmarks.map((benchmark) => (
              <div key={benchmark.id} className="studio-card p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">
                      {benchmark.title}
                    </h2>
                    <span className="studio-pill mt-2">{benchmark.type}</span>
                  </div>
                </div>
                <p className="text-sm text-[color:var(--studio-text-muted)]">
                  {benchmark.description?.substring(0, 150)}{benchmark.description?.length > 150 ? '...' : ''}
                </p>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <Link href={`/studio/content/benchmarks/${benchmark.id}`} className="studio-cta-ghost flex-1 text-center">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(benchmark.id)}
                      className="studio-cta-ghost text-[color:var(--studio-accent-3)] border-[color:var(--studio-accent-3)] flex-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
