'use client'

import { useState, useEffect, useCallback } from 'react'

export type UserTier = 'FREE' | 'SPARCC' | 'ENTERPRISE'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  tier: UserTier
}

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isSignedIn: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchUser()
  }, [fetchUser])

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    signOut,
    refresh,
  }
}
