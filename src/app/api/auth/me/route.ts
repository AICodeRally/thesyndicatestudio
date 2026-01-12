import { NextResponse } from 'next/server'
import { auth, getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const user = await getCurrentUser()

    return NextResponse.json({
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      } : null
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ user: null })
  }
}
