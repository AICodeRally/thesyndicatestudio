import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createMagicLinkToken } from '@/lib/auth'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Create magic link token
    const token = await createMagicLinkToken(email.toLowerCase())

    // Build magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://studio.intelligentspm.com'
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`

    // Send email via Resend
    await resend.emails.send({
      from: 'The Syndicate Studio <studio@intelligentspm.com>',
      to: email,
      subject: 'Sign in to The Syndicate Studio',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a1a2f;">Sign in to The Syndicate Studio</h2>
          <p>Click the button below to sign in. This link expires in 15 minutes.</p>
          <a href="${magicLink}"
             style="display: inline-block; background: linear-gradient(to right, #7c3aed, #db2777); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Sign In
          </a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 })
  }
}
