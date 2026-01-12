import Link from 'next/link'
import { auth, getCurrentUser } from '@/lib/auth'
import { SignOutButton } from '@clerk/nextjs'

interface PublicHeaderProps {
  currentPage?: 'counsel' | 'episodes' | 'models'
}

export async function PublicHeader({ currentPage }: PublicHeaderProps) {
  const { userId } = await auth()
  const isLoggedIn = !!userId
  const user = isLoggedIn ? await getCurrentUser() : null

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
                  {user?.email}
                </span>
                <Link
                  href="/vault"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  My Vault
                </Link>
                <SignOutButton>
                  <button className="text-sm text-gray-500 hover:text-gray-100">
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-gray-500 hover:text-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
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
