import { prisma } from '@/lib/db'
import Link from 'next/link'
import { PublicHeader } from '@/components/PublicHeader'

export default async function EpisodesPage() {
  const episodes = await prisma.episode.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      series: true,
      title: true,
      premise: true,
      youtubeVideoId: true,
      publishDateTarget: true,
      createdAt: true,
      counselRefs: true,
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PublicHeader currentPage="episodes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Video Library
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Intelligent Sales videos from The Toddfather
          </p>
        </div>

        {episodes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400">
              No published episodes yet. Check back soon for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <Link
                key={episode.id}
                href={`/episodes/${episode.id}`}
                className="block bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-zinc-900 flex items-center justify-center">
                  {episode.youtubeVideoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${episode.youtubeVideoId}/maxresdefault.jpg`}
                      alt={episode.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/50 text-sm">Video coming soon</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2">
                    {episode.series}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    {episode.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                    {episode.premise}
                  </p>

                  {episode.counselRefs && episode.counselRefs.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{episode.counselRefs.length} Counsel items</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
