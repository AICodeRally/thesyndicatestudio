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
    <div className="min-h-screen bg-[#0A0A0F]">
      <PublicHeader currentPage="counsel" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Counsel Library
          </h1>
          <p className="text-lg text-gray-400">
            Intelligent SPM guidance from The Toddfather
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counsel.map((item) => (
            <Link
              key={item.id}
              href={`/counsel/${item.slug}`}
              className="cosmic-card block p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    {item.type}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                    {item.difficulty}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {item.timeToApplyMin}min
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400 mb-3">
                {item.oneLiner}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="uppercase tracking-wide">{item.channelPrimary.replace('_', ' ')}</span>
                <span className="text-purple-400">→</span>
              </div>
            </Link>
          ))}
        </div>

        {counsel.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No Counsel items found. Run the seed script to populate the database.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
