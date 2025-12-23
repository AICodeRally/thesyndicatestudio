import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const episode = await prisma.episode.findUnique({
    where: {
      id,
      status: 'PUBLISHED',
    },
  })

  if (!episode) {
    notFound()
  }

  // Fetch linked Counsel if counselRefs exist
  let linkedCounsel: any[] = []
  if (episode.counselRefs && Array.isArray(episode.counselRefs) && episode.counselRefs.length > 0) {
    linkedCounsel = await prisma.counsel.findMany({
      where: {
        slug: {
          in: episode.counselRefs as string[],
        },
        status: 'PUBLISHED',
      },
      select: {
        slug: true,
        title: true,
        oneLiner: true,
        type: true,
        difficulty: true,
        channelPrimary: true,
        timeToApplyMin: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/episodes"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Video Library
        </Link>

        {/* Video Section */}
        <div className="mb-12">
          <div className="mb-6">
            <div className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-2">
              {episode.series}
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              {episode.title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {episode.premise}
            </p>
          </div>

          {/* Video Embed */}
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            {episode.youtubeVideoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${episode.youtubeVideoId}`}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500 dark:text-zinc-500">
                Video coming soon
              </div>
            )}
          </div>
        </div>

        {/* Linked Counsel */}
        {linkedCounsel.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Counsel from this Episode
              </h2>
              <span className="text-sm text-zinc-500 dark:text-zinc-500">
                {linkedCounsel.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedCounsel.map((counsel) => (
                <Link
                  key={counsel.slug}
                  href={`/counsel/${counsel.slug}`}
                  className="block p-5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {counsel.type}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {counsel.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      {counsel.timeToApplyMin}min
                    </span>
                  </div>

                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    {counsel.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {counsel.oneLiner}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                Save these Counsel items to your Family Vault to organize and reference them later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
