import { prisma } from '@/lib/db'
import { auth } from '../../../../auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SaveButton } from '@/components/counsel/SaveButton'
import { CounselWithChat } from '@/components/counsel/CounselWithChat'

export default async function CounselDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  const counsel = await prisma.counsel.findUnique({
    where: { slug },
  })

  if (!counsel) {
    notFound()
  }

  // Check if user has saved this counsel and get tier
  let isSaved = false
  let userTier = 'FREE'
  if (session?.user?.id) {
    const [saved, user] = await Promise.all([
      prisma.counselSave.findUnique({
        where: {
          userId_counselId: {
            userId: session.user.id,
            counselId: counsel.id,
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tier: true },
      }),
    ])
    isSaved = !!saved
    userTier = user?.tier || 'FREE'
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/counsel"
          className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-8"
        >
          ← Back to Counsel Library
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {counsel.title}
          </h1>

          <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-6">
            {counsel.oneLiner}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {counsel.type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {counsel.channelPrimary.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {counsel.difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              {counsel.timeToApplyMin} min to apply
            </span>
          </div>

          {/* Save Button */}
          <SaveButton counselId={counsel.id} initialSaved={isSaved} />
        </header>

        {/* Main Content */}
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {counsel.bodyMd}
          </ReactMarkdown>
        </article>

        {/* Footer with metadata */}
        <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              Published {new Date(counsel.createdAt).toLocaleDateString()}
            </div>
            <div>
              Version {counsel.version}
            </div>
          </div>
        </footer>
      </div>

      {/* Ask Toddfather Chat */}
      {session?.user && (
        <CounselWithChat
          counselTitle={counsel.title}
          counselOneLiner={counsel.oneLiner}
          counselChannel={counsel.channelPrimary}
          userTier={userTier}
        />
      )}
    </div>
  )
}
