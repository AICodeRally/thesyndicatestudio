'use client'

import { useState } from 'react'

interface SignOutButtonProps {
  children?: React.ReactNode
  className?: string
}

export function SignOutButton({ children, className }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
    }
  }

  if (children) {
    return (
      <div onClick={handleSignOut} className={className}>
        {children}
      </div>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className || 'text-sm text-gray-500 hover:text-gray-100'}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
