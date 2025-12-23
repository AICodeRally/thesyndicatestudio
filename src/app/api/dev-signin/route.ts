import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

/**
 * DEV ONLY - Quick signin for testing
 * Remove this in production!
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    // Create or get test user
    const testUser = await prisma.user.upsert({
      where: { email: 'todd.lebaron@gmail.com' },
      update: {},
      create: {
        email: 'todd.lebaron@gmail.com',
        name: 'Todd LeBaron',
        tier: 'SPARCC', // Give yourself SPARCC for testing
      },
    })

    // Create a simple session (simplified for dev)
    const sessionToken = `dev-session-${Date.now()}`
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: testUser.id,
        expires: expiresAt,
      },
    })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('next-auth.session-token', sessionToken, {
      expires: expiresAt,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
    })

    return NextResponse.redirect(new URL('/studio', request.url))
  } catch (error) {
    console.error('Dev signin error:', error)
    return NextResponse.json({ error: 'Failed to create dev session' }, { status: 500 })
  }
}
