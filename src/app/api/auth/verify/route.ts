import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyMagicLink } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(new URL('/sign-in?error=invalid', request.url))
    }

    // Verify token and create session
    const sessionToken = await verifyMagicLink(token, email.toLowerCase())

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/sign-in?error=expired', request.url))
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Redirect to studio
    return NextResponse.redirect(new URL('/studio', request.url))
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.redirect(new URL('/sign-in?error=failed', request.url))
  }
}
