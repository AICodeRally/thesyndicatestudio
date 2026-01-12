import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createMagicLinkToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, redirect } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Default redirect to /studio if not provided
    const redirectPath = redirect || '/studio'

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check for API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Create magic link token
    const token = await createMagicLinkToken(email.toLowerCase())

    // Build magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intelligentspm.com'
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email.toLowerCase())}&redirect=${encodeURIComponent(redirectPath)}`

    console.log('Sending magic link to:', email)
    console.log('Magic link URL:', magicLink)

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'The Syndicate Studio <noreply@intelligentspm.com>',
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

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 })
    }

    console.log('Email sent successfully:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to send magic link'
    }, { status: 500 })
  }
}
