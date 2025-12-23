import { prisma } from '@/lib/db'
import { auth } from '../../../auth'
import Link from 'next/link'
import { UpgradePrompt } from '@/components/UpgradePrompt'
import { PublicHeader } from '@/components/PublicHeader'

export default async function ModelsPage() {
  const session = await auth()

  const models = await prisma.workingModel.findMany({
    orderBy: { createdAt: 'asc' },
  })

  // Get user tier if logged in
  let userTier = 'FREE'
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    })
    userTier = user?.tier || 'FREE'
  }

  const canUseModels = userTier === 'SPARCC' || userTier === 'ENTERPRISE'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PublicHeader currentPage="models" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Working Models
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Interactive calculators for SPM professionals
          </p>
        </div>

        {/* Upgrade prompt for free users */}
        {!canUseModels && (
          <div className="mb-8">
            <UpgradePrompt
              feature="Working Models"
              description="Run calculations, export results, and save scenarios to your Vault. Available with SPARCC subscription."
              variant="banner"
            />
          </div>
        )}

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/models/${model.slug}`}
              className={`block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
                canUseModels
                  ? 'hover:border-zinc-300 dark:hover:border-zinc-700'
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mb-3">
                    {model.category.replace('_', ' ')}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    {model.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {model.description}
                  </p>
                </div>
                {!canUseModels && (
                  <svg className="w-5 h-5 text-zinc-400 dark:text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>

              {canUseModels && (
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mt-4">
                  <span>Run Calculator</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
