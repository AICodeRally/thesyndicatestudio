import Link from 'next/link'

interface AppHeaderProps {
  userEmail: string
  userTier?: string
  currentPage?: 'vault' | 'counsel' | 'studio' | 'settings'
}

export function AppHeader({ userEmail, userTier = 'FREE', currentPage }: AppHeaderProps) {
  const tierColors = {
    FREE: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    SPARCC: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    ENTERPRISE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/start" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              The Toddfather
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/vault"
                className={currentPage === 'vault' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Vault
              </Link>
              <Link
                href="/counsel"
                className={currentPage === 'counsel' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Counsel
              </Link>
              <Link
                href="/studio"
                className={currentPage === 'studio' ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}
              >
                Studio
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColors[userTier as keyof typeof tierColors] || tierColors.FREE}`}>
              {userTier}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {userEmail}
            </span>
            <Link
              href="/settings/billing"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Settings
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
