"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface SaveButtonProps {
  counselId: string
  initialSaved?: boolean
}

export function SaveButton({ counselId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/counsel/save', {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counselId }),
      })

      if (response.status === 401) {
        router.push('/auth/signin')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setSaved(data.saved)
        router.refresh()
      }
    } catch (error) {
      console.error('Error saving counsel:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
        saved
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800'
          : 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
      }`}
    >
      {loading ? 'Saving...' : saved ? '✓ Saved to Vault' : 'Save to Vault'}
    </button>
  )
}
