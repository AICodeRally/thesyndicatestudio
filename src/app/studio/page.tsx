import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function StudioPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
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
    DRAFT: 'bg-[color:var(--studio-surface-2)] text-[color:var(--studio-text-muted)]',
    GENERATING: 'bg-[color:var(--studio-accent-soft)] text-[color:var(--studio-accent)]',
    PENDING_REVIEW: 'bg-[color:var(--studio-accent-soft)] text-[color:var(--studio-accent-2)]',
    PUBLISHED: 'bg-[color:var(--studio-accent-soft)] text-[color:var(--studio-accent)]',
  }

  return (
    <div className="studio-shell min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <span className="studio-tag">Syndicate control</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-serif">Studio Dashboard</h1>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              Keep the production line tight across scripts, cuts, and releases.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/studio/content" className="studio-cta-ghost">
              Content Control
            </Link>
            <Link href="/studio/library" className="studio-cta-ghost">
              Asset Library
            </Link>
            <Link href="/studio/episodes/new" className="studio-cta">
              Start Episode
            </Link>
          </div>
        </div>

        {episodes.length === 0 ? (
          <div className="studio-card p-12 text-center">
            <h2 className="text-2xl font-semibold text-[color:var(--studio-text)]">
              No episodes yet
            </h2>
            <p className="mt-3 text-[color:var(--studio-text-muted)]">
              Open the line by creating the first episode draft.
            </p>
            <Link href="/studio/episodes/new" className="mt-6 inline-flex studio-cta">
              Create First Episode
            </Link>
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
                  className="studio-card p-6 block"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold text-[color:var(--studio-text)]">
                          {episode.title}
                        </h2>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[episode.status as keyof typeof statusColors]}`}
                        >
                          {episode.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-[color:var(--studio-text-muted)] mb-2">
                        {episode.premise}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[color:var(--studio-text-muted)]">
                        <span className="uppercase tracking-[0.2em]">{episode.series}</span>
                        {episode.publishDateTarget && (
                          <>
                            <span>•</span>
                            <span>Target: {new Date(episode.publishDateTarget).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-[color:var(--studio-text-muted)]">
                    <span className="studio-pill">Script {scriptCount || 0}</span>
                    <span className="studio-pill">Cuts {cutCount || 0}</span>
                    <span className="studio-pill">Assets {assetCount || 0}</span>
                    <span className="studio-pill">
                      {episode.status === 'PUBLISHED' ? 'Published' : 'Not Published'}
                    </span>
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
