import { auth } from '../../../../auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function BillingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  const subscription = user?.subscriptions[0]
  const isSubscribed = subscription && subscription.status === 'active'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <Link href="/start" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                The Toddfather
              </Link>
              <nav className="flex gap-6 text-sm">
                <Link
                  href="/vault"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Vault
                </Link>
                <Link
                  href="/settings/billing"
                  className="font-medium text-zinc-900 dark:text-zinc-100"
                >
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {session.user.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Billing & Subscription
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your subscription and billing settings
          </p>
        </div>

        {/* Current Plan */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                Current Plan
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isSubscribed ? 'SPARCC Tier' : 'Free Tier'}
              </p>
            </div>
            {isSubscribed ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                Free
              </span>
            )}
          </div>

          {isSubscribed ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500">Status</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                    {subscription.status}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500">Current Period Ends</span>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                <form action="/api/stripe/portal" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Manage Subscription
                  </button>
                </form>

                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Cancels at period end
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                You're currently on the free tier. Upgrade to SPARCC for unlimited access to all features.
              </p>
              <form action="/api/stripe/checkout" method="POST">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Upgrade to SPARCC - $29/month
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            Plan Features
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                {isSubscribed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Ask The Toddfather (AI Chat)
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {isSubscribed ? 'Unlimited messages' : '3 messages total (Free)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-500">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Family Vault Collections
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {isSubscribed ? 'Unlimited collections' : '3 collections max (Free)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                {isSubscribed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Working Models (Calculators)
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {isSubscribed ? 'All models + exports' : 'View only (Free)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                {isSubscribed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Collection Export
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {isSubscribed ? 'PDF + Markdown' : 'Not available (Free)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-green-500">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Counsel Library Access
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Full access to all Counsel
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
