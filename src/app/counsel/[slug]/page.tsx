import { prisma } from '@/lib/db'
import { auth, getUserTier } from '@/lib/auth'
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
  const { userId } = await auth()

  const counsel = await prisma.counsel.findUnique({
    where: { slug },
  })

  if (!counsel) {
    notFound()
  }

  // Check if user has saved this counsel and get tier
  let isSaved = false
  let userTier = 'FREE'
  if (userId) {
    const saved = await prisma.counselSave.findUnique({
      where: {
        userId_counselId: {
          userId,
          counselId: counsel.id,
        },
      },
    })
    isSaved = !!saved
    userTier = await getUserTier(userId)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/counsel"
          className="inline-flex items-center text-sm text-gray-500 hover:text-purple-400 mb-8 transition-colors"
        >
          ← Back to Counsel Library
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-100 mb-3">
            {counsel.title}
          </h1>

          <p className="text-xl text-gray-300 mb-6">
            {counsel.oneLiner}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400">
              {counsel.type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
              {counsel.channelPrimary.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-400">
              {counsel.difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300">
              {counsel.timeToApplyMin} min to apply
            </span>
          </div>

          {/* Save Button */}
          <SaveButton counselId={counsel.id} initialSaved={isSaved} />
        </header>

        {/* Main Content */}
        <article className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-gray-100 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-gray-100 prose-a:text-purple-400 hover:prose-a:text-purple-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {counsel.bodyMd}
          </ReactMarkdown>
        </article>

        {/* Footer with metadata */}
        <footer className="mt-12 pt-8 border-t border-[#2A2A3A]">
          <div className="flex items-center justify-between text-sm text-gray-600">
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
      {userId && (
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
