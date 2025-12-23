"use client"

import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  description: string
  variant?: 'inline' | 'modal' | 'banner'
}

export function UpgradePrompt({
  feature,
  description,
  variant = 'inline'
}: UpgradePromptProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Upgrade to SPARCC</h3>
            <p className="text-sm text-purple-100">
              {description}
            </p>
          </div>
          <Link
            href="/settings/billing"
            className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors whitespace-nowrap"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className="text-center py-8 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          {feature} is a SPARCC Feature
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
        <Link
          href="/settings/billing"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
        >
          Upgrade to SPARCC - $29/month
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">
          Cancel anytime. No commitment.
        </p>
      </div>
    )
  }

  // Inline variant (default)
  return (
    <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
            {feature} requires SPARCC
          </h4>
          <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
            {description}
          </p>
          <Link
            href="/settings/billing"
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Upgrade for $29/month
          </Link>
        </div>
      </div>
    </div>
  )
}
