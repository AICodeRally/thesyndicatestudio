import { prisma } from '@/lib/db'
import Link from 'next/link'
import { PublicHeader } from '@/components/PublicHeader'

export default async function CounselPage() {
  const counsel = await prisma.counsel.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      oneLiner: true,
      type: true,
      channelPrimary: true,
      difficulty: true,
      timeToApplyMin: true,
      createdAt: true,
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PublicHeader currentPage="counsel" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Counsel Library
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Intelligent SPM guidance from The Toddfather
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counsel.map((item) => (
            <Link
              key={item.id}
              href={`/counsel/${item.slug}`}
              className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {item.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.difficulty}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {item.timeToApplyMin}min
                </span>
              </div>

              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                {item.oneLiner}
              </p>

              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="uppercase tracking-wide">{item.channelPrimary.replace('_', ' ')}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {counsel.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No Counsel items found. Run the seed script to populate the database.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
