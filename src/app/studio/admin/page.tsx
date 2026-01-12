import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { isAdminUser } from '@/lib/authz'

export default async function AdminConsolePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const isAdmin = await isAdminUser(session.user.id)

  if (!isAdmin) {
    redirect('/studio')
  }

  const [episodeQueue, glossaryCount, vendorCount, benchmarkCount, componentCount] = await Promise.all([
    prisma.episode.findMany({
      where: { status: { not: 'PUBLISHED' } },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    }),
    prisma.glossaryTerm.count(),
    prisma.vendorScorecard.count(),
    prisma.benchmark.count(),
    prisma.componentCard.count(),
  ])

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <span className="studio-tag">Admin console</span>
        <h1 className="mt-4 text-4xl font-serif">Syndicate Control</h1>
        <p className="mt-2 text-[color:var(--studio-text-muted)]">
          Admin-only oversight for publishing, exports, and content governance.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="studio-card p-6">
            <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">
              Publishing Queue
            </h2>
            <p className="mt-2 text-sm text-[color:var(--studio-text-muted)]">
              Episodes awaiting final review or publish.
            </p>
            <div className="mt-4 space-y-3">
              {episodeQueue.length === 0 && (
                <p className="text-sm text-[color:var(--studio-text-muted)]">
                  No pending episodes.
                </p>
              )}
              {episodeQueue.map((episode) => (
                <div key={episode.id} className="studio-card p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--studio-text)]">
                        {episode.title}
                      </p>
                      <p className="text-xs text-[color:var(--studio-text-muted)]">
                        {episode.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/studio/episodes/${episode.id}`} className="studio-cta-ghost">
                        Review
                      </Link>
                      <a
                        href={`/api/studio/episodes/${episode.id}/export`}
                        className="studio-cta-ghost"
                      >
                        Export
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="studio-card p-6">
            <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">
              Content Inventory
            </h2>
            <p className="mt-2 text-sm text-[color:var(--studio-text-muted)]">
              Current counts across the syndicate library.
            </p>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--studio-text-muted)]">
              <div className="flex items-center justify-between">
                <span>Glossary terms</span>
                <span className="text-[color:var(--studio-accent)] font-semibold">{glossaryCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vendor scorecards</span>
                <span className="text-[color:var(--studio-accent)] font-semibold">{vendorCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Benchmarks</span>
                <span className="text-[color:var(--studio-accent)] font-semibold">{benchmarkCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Component cards</span>
                <span className="text-[color:var(--studio-accent)] font-semibold">{componentCount}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Link href="/studio/content" className="studio-cta-ghost">
                Content Desk
              </Link>
              <Link href="/studio" className="studio-cta-ghost">
                Studio Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 studio-card p-6">
          <h2 className="text-lg font-semibold text-[color:var(--studio-text)]">Role Rules</h2>
          <p className="mt-2 text-sm text-[color:var(--studio-text-muted)]">
            Admins are users with tier ENTERPRISE. Creators can draft and generate content, but only admins can publish or export.
          </p>
        </div>
      </div>
    </div>
  )
}
