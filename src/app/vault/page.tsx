import { auth, getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { AppNav } from "@/components/navigation/AppNav"

export default async function VaultPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await getCurrentUser()

  // Fetch user's collections
  const collections = await prisma.vaultCollection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      sections: {
        include: {
          items: {
            include: {
              counsel: {
                select: {
                  slug: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  })

  // Fetch user's saved Counsel
  const savedCounsel = await prisma.counselSave.findMany({
    where: { userId },
    include: {
      counsel: {
        select: {
          slug: true,
          title: true,
          oneLiner: true,
          type: true,
          channelPrimary: true,
          difficulty: true,
          timeToApplyMin: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalItems = collections.reduce(
    (sum, col) => sum + col.sections.reduce((s, sec) => s + sec.items.length, 0),
    0
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppNav currentPath="/vault" userEmail={user?.email || ""} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Your Family Vault
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {savedCounsel.length} saved Counsel · {collections.length} collections · {totalItems} items organized
          </p>
        </div>

        {/* Collections */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Collections
            </h2>
            <Link
              href="/vault/collections/new"
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              + New Collection
            </Link>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                No collections yet. Create your first collection to organize Counsel.
              </p>
              <Link
                href="/vault/collections/new"
                className="inline-block px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Create Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => {
                const itemCount = collection.sections.reduce(
                  (sum, sec) => sum + sec.items.length,
                  0
                )
                return (
                  <Link
                    key={collection.id}
                    href={`/vault/collections/${collection.id}`}
                    className="block p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      {collection.title}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500">
                      <span>{itemCount} items</span>
                      <span>{collection.sections.length} sections</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Saved Counsel */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Saved Counsel
            </h2>
            <Link
              href="/counsel"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Browse all →
            </Link>
          </div>

          {savedCounsel.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                No saved Counsel yet. Browse the library and save items to your Vault.
              </p>
              <Link
                href="/counsel"
                className="inline-block px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Browse Counsel
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCounsel.map((save) => (
                <Link
                  key={save.id}
                  href={`/counsel/${save.counsel.slug}`}
                  className="block p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {save.counsel.type}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {save.counsel.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                    {save.counsel.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {save.counsel.oneLiner}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
