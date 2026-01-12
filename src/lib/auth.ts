import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { randomBytes, createHash } from 'crypto'

export type UserTier = 'FREE' | 'SPARCC' | 'ENTERPRISE'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  tier: UserTier
}

// Generate a secure token
export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

// Hash token for storage (don't store plain tokens)
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

// Get current session from cookie
export async function auth(): Promise<{ userId: string | null }> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (!sessionToken) {
    return { userId: null }
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: hashToken(sessionToken) },
    include: { user: true },
  })

  if (!session || session.expires < new Date()) {
    return { userId: null }
  }

  return { userId: session.userId }
}

// Get full user with tier
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await auth()

  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier as UserTier,
  }
}

// Get user tier from database
export async function getUserTier(userId: string): Promise<UserTier> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true },
  })
  return (user?.tier as UserTier) ?? 'FREE'
}

// Create a magic link token
export async function createMagicLinkToken(email: string): Promise<string> {
  const token = generateToken()
  const hashedToken = hashToken(token)
  const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires,
    },
  })

  return token
}

// Verify magic link and create session
export async function verifyMagicLink(token: string, email: string): Promise<string | null> {
  const hashedToken = hashToken(token)

  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: hashedToken,
      },
    },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    return null
  }

  // Delete the used token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token: hashedToken,
      },
    },
  })

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        emailVerified: new Date(),
      },
    })
  } else if (!user.emailVerified) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })
  }

  // Create session
  const sessionToken = generateToken()
  const hashedSessionToken = hashToken(sessionToken)
  const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await prisma.session.create({
    data: {
      sessionToken: hashedSessionToken,
      userId: user.id,
      expires: sessionExpires,
    },
  })

  return sessionToken
}

// Destroy session
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { sessionToken: hashToken(sessionToken) },
    })
  }
}
