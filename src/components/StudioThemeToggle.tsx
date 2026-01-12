'use client'

import { useEffect, useState } from 'react'

type StudioTheme = 'luxury-noir' | 'industrial-ops'

export default function StudioThemeToggle() {
  const [theme, setTheme] = useState<StudioTheme>('luxury-noir')

  useEffect(() => {
    const stored = window.localStorage.getItem('studio-theme')
    const initial = stored === 'industrial-ops' ? 'industrial-ops' : 'luxury-noir'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  const toggleTheme = () => {
    const next = theme === 'luxury-noir' ? 'industrial-ops' : 'luxury-noir'
    setTheme(next)
    document.documentElement.dataset.theme = next
    window.localStorage.setItem('studio-theme', next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="studio-tag border border-[color:var(--studio-border)]"
    >
      Theme: {theme === 'luxury-noir' ? 'Noir' : 'Ops'}
    </button>
  )
}
