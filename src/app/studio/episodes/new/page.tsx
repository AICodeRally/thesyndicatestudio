"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewEpisodePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    series: "Intelligent Sales",
    title: "",
    premise: "",
    publishDateTarget: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

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

      if (response.status === 401) {
        router.push('/auth/signin')
        return
      }

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/studio"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Studio
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Create New Episode
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Start the AI-driven video production pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="series"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Series
            </label>
            <select
              id="series"
              value={formData.series}
              onChange={(e) => setFormData({ ...formData, series: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            >
              <option value="Intelligent Sales">Intelligent Sales</option>
              <option value="Todd Takes">Todd Takes</option>
              <option value="The Week in Intelligent Sales">The Week in Intelligent Sales</option>
              <option value="Ask Todd Live">Ask Todd Live</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Episode Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., What Intelligent Sales Actually Means"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="premise"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Premise / Core Idea
            </label>
            <textarea
              id="premise"
              value={formData.premise}
              onChange={(e) => setFormData({ ...formData, premise: e.target.value })}
              required
              rows={4}
              placeholder="The core argument or insight this episode will communicate. This becomes the AI prompt for script generation."
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Tip: Be specific. "Most accelerators hide exponential cost risks" is better than "Talk about accelerators"
            </p>
          </div>

          <div>
            <label
              htmlFor="publishDateTarget"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Target Publish Date (optional)
            </label>
            <input
              id="publishDateTarget"
              type="date"
              value={formData.publishDateTarget}
              onChange={(e) => setFormData({ ...formData, publishDateTarget: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              What happens next?
            </h3>
            <ol className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">1.</span>
                <span>Episode created in DRAFT status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">2.</span>
                <span>AI generates canonical script from your premise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">3.</span>
                <span>AI creates platform-specific cuts (YouTube, Shorts, TikTok, LinkedIn)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">4.</span>
                <span>AI extracts 3-7 Counsel items from the script</span>
              </li>
            </ol>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.premise}
              className="flex-1 px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Episode...' : 'Create Episode'}
            </button>

            <Link
              href="/studio"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
