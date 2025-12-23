import Link from 'next/link'

interface PublicHeaderProps {
  currentPage?: 'counsel' | 'episodes' | 'models'
}

export function PublicHeader({ currentPage }: PublicHeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              The Toddfather
            </Link>
            <nav className="hidden sm:flex gap-6 text-sm">
              <Link
                href="/counsel"
                className={currentPage === 'counsel' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Counsel
              </Link>
              <Link
                href="/episodes"
                className={currentPage === 'episodes' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Videos
              </Link>
              <Link
                href="/models"
                className={currentPage === 'models' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Models
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
