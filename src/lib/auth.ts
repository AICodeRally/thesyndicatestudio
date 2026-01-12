import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export type UserTier = 'FREE' | 'PRO' | 'ENTERPRISE'

export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  image: string | null
  tier: UserTier
}

/**
 * Get the current user ID from Clerk
 * Use this for simple auth checks
 */
export async function auth() {
  return clerkAuth()
}

/**
 * Get current user with tier information from database
 * Creates user record if it doesn't exist
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await clerkAuth()

  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    return null
  }

  // Get or create user in our database to maintain tier info
  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  })

  // Create user if doesn't exist
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
        name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
        image: clerkUser.imageUrl,
      },
      select: { tier: true },
    })
  }

  return {
    id: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
    name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
    image: clerkUser.imageUrl,
    tier: dbUser.tier as UserTier,
  }
}

/**
 * Get user tier from database
 * Returns 'FREE' if user not found
 */
export async function getUserTier(userId: string): Promise<UserTier> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  })
  return (user?.tier as UserTier) ?? 'FREE'
}

// Re-export currentUser for cases that need full Clerk user data
export { currentUser }
