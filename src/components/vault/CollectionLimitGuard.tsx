"use client"

import { hasReachedLimit, getFeatureLimit } from '@/lib/features'
import { UpgradePrompt } from '@/components/UpgradePrompt'
import Link from 'next/link'

interface CollectionLimitGuardProps {
  userTier: string
  currentCount: number
  children: React.ReactNode
}

export function CollectionLimitGuard({
  userTier,
  currentCount,
  children
}: CollectionLimitGuardProps) {
  const tier = userTier as 'FREE' | 'SPARCC' | 'ENTERPRISE'
  const limit = getFeatureLimit(tier, 'collections')
  const atLimit = hasReachedLimit(tier, 'collections', currentCount)

  if (atLimit) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="max-w-md mx-auto px-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            Collection Limit Reached
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            You've created {currentCount} of {limit} collections available on the free tier.
            Upgrade to SPARCC for unlimited collections.
          </p>
          <Link
            href="/settings/billing"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Upgrade to SPARCC
          </Link>
        </div>
      </div>
    )
  }

  if (limit !== null && currentCount >= limit - 1) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            ⚠️ {currentCount === limit - 1 ? 'Last collection available' : `${limit - currentCount} collection${limit - currentCount === 1 ? '' : 's'} remaining`} on free tier.{' '}
            <Link href="/settings/billing" className="font-semibold underline">
              Upgrade to SPARCC
            </Link>{' '}
            for unlimited.
          </p>
        </div>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
