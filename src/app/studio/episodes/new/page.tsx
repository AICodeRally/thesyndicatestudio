'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewEpisodePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    series: 'Intelligent Sales',
    title: '',
    premise: '',
    publishDateTarget: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/studio/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          publishDateTarget: formData.publishDateTarget || null,
        }),
      })

      if (response.ok) {
        const { episode } = await response.json()
        router.push(`/studio/episodes/${episode.id}`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create episode')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/studio" className="studio-tag">
          Back to Studio
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-serif">Create New Episode</h1>
          <p className="mt-2 text-[color:var(--studio-text-muted)]">
            Open the pipeline with a new syndicate story.
          </p>
        </div>

        {error && (
          <div className="mt-6 studio-card p-4 text-sm text-[color:var(--studio-accent-3)]">
            {error}
          </div>
        )}

        <div className="mt-8 studio-panel">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="series" className="studio-label">Series</label>
              <select
                id="series"
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                className="studio-select"
              >
                <option value="Intelligent Sales">Intelligent Sales</option>
                <option value="Todd Takes">Todd Takes</option>
                <option value="The Week in Intelligent Sales">The Week in Intelligent Sales</option>
                <option value="Ask Todd Live">Ask Todd Live</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="studio-label">Episode Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="What Intelligent Sales Actually Means"
                className="studio-input"
              />
            </div>

            <div>
              <label htmlFor="premise" className="studio-label">Premise / Core Idea</label>
              <textarea
                id="premise"
                value={formData.premise}
                onChange={(e) => setFormData({ ...formData, premise: e.target.value })}
                required
                rows={4}
                placeholder="The core argument or insight this episode will communicate."
                className="studio-textarea"
              />
              <p className="mt-2 text-xs text-[color:var(--studio-text-muted)]">
                Be specific. "Most accelerators hide exponential cost risks" beats "Talk about accelerators".
              </p>
            </div>

            <div>
              <label htmlFor="publishDateTarget" className="studio-label">Target Publish Date (optional)</label>
              <input
                id="publishDateTarget"
                type="date"
                value={formData.publishDateTarget}
                onChange={(e) => setFormData({ ...formData, publishDateTarget: e.target.value })}
                className="studio-input"
              />
            </div>

            <div className="pt-4 border-t border-[color:var(--studio-border)]">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)] mb-3">
                What happens next
              </h3>
              <ol className="space-y-2 text-sm text-[color:var(--studio-text-muted)]">
                <li>1. Episode created in DRAFT status</li>
                <li>2. AI generates canonical script from your premise</li>
                <li>3. AI creates platform-specific cuts</li>
                <li>4. AI extracts Counsel items for review</li>
              </ol>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.premise}
                className="studio-cta"
              >
                {loading ? 'Creating Episode...' : 'Create Episode'}
              </button>

              <Link href="/studio" className="studio-cta-ghost text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
