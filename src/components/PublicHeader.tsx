import Link from 'next/link'
import { auth } from '../../auth'

interface PublicHeaderProps {
  currentPage?: 'counsel' | 'episodes' | 'models'
}

export async function PublicHeader({ currentPage }: PublicHeaderProps) {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <header className="border-b border-[#2A2A3A] bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              The Toddfather
            </Link>
            <nav className="hidden sm:flex gap-6 text-sm">
              <Link
                href="/counsel"
                className={currentPage === 'counsel' ? 'font-medium text-purple-400' : 'text-gray-400 hover:text-gray-100'}
              >
                Counsel
              </Link>
              <Link
                href="/episodes"
                className={currentPage === 'episodes' ? 'font-medium text-purple-400' : 'text-gray-400 hover:text-gray-100'}
              >
                Videos
              </Link>
              <Link
                href="/models"
                className={currentPage === 'models' ? 'font-medium text-purple-400' : 'text-gray-400 hover:text-gray-100'}
              >
                Models
              </Link>
              {isLoggedIn && (
                <Link
                  href="/vault"
                  className="text-gray-400 hover:text-gray-100"
                >
                  Vault
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-500">
                  {session.user?.email}
                </span>
                <Link
                  href="/vault"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  My Vault
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="text-sm text-gray-500 hover:text-gray-100"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-500 hover:text-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
