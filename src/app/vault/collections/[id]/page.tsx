import { prisma } from '@/lib/db'
import { auth } from '../../../../../auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const collection = await prisma.vaultCollection.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          items: {
            orderBy: { order: 'asc' },
            include: {
              counsel: {
                select: {
                  slug: true,
                  title: true,
                  oneLiner: true,
                  type: true,
                  difficulty: true,
                  channelPrimary: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!collection) {
    notFound()
  }

  const totalItems = collection.sections.reduce(
    (sum, sec) => sum + sec.items.length,
    0
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/vault"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Vault
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
              {collection.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            <span>{totalItems} items</span>
            <span>·</span>
            <span>{collection.sections.length} sections</span>
            <span>·</span>
            <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Sections */}
        {collection.sections.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              This collection is empty. Add sections and Counsel to organize your knowledge.
            </p>
            <button className="inline-block px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              + Add Section
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {collection.sections.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
              >
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  {section.title}
                </h2>

                {section.items.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    No items in this section yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/counsel/${item.counsel?.slug}`}
                        className="block p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                {item.counsel?.type}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {item.counsel?.difficulty}
                              </span>
                            </div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                              {item.counsel?.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {item.counsel?.oneLiner}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 italic">
                                Note: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            href={`/vault/collections/${collection.id}/export`}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Export as Markdown
          </Link>
        </div>
      </div>
    </div>
  )
}
