import { auth } from '../../../auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { AppNav } from '@/components/navigation/AppNav'

export default async function StudioPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const episodes = await prisma.episode.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      canonicalScript: true,
      scripts: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
      cuts: true,
      assets: true,
    },
  })

  const statusColors = {
    DRAFT: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    GENERATING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PENDING_REVIEW: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav currentPath="/studio" userEmail={session.user.email || ""} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Toddfather Studio
            </h1>
            <div className="flex items-center gap-3">
              <Link
                href="/studio/library"
                className="px-4 py-2 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                Library
              </Link>
              <Link
                href="/studio/episodes/new"
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                + New Episode
              </Link>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            AI-powered video production pipeline for Intelligent Sales
          </p>
        </div>

        {/* Episode List */}
        {episodes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                No episodes yet
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Create your first episode to start the AI-driven video production pipeline.
              </p>
              <Link
                href="/studio/episodes/new"
                className="inline-block px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Create First Episode
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => {
              const scriptCount = episode.scripts.length
              const cutCount = episode.cuts.length
              const assetCount = episode.assets.length

              return (
                <Link
                  key={episode.id}
                  href={`/studio/episodes/${episode.id}`}
                  className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                          {episode.title}
                        </h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[episode.status]}`}>
                          {episode.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        {episode.premise}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                        <span className="uppercase tracking-wide">{episode.series}</span>
                        {episode.publishDateTarget && (
                          <>
                            <span>·</span>
                            <span>Target: {new Date(episode.publishDateTarget).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Progress */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${scriptCount > 0 ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Script {scriptCount > 0 ? `(${scriptCount})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cutCount > 0 ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Cuts {cutCount > 0 ? `(${cutCount})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${assetCount > 0 ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Assets {assetCount > 0 ? `(${assetCount})` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${episode.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Published
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
