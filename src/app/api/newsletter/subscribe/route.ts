import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Force dynamic to prevent build-time evaluation (AUTH_RESEND_KEY not available at build)
export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    // Add to Resend audience (you'll need to create audience in Resend dashboard)
    // For now, just send welcome email
    await resend.emails.send({
      from: 'The Syndicate Studio <noreply@thesyndicatestudio.com>',
      to: email,
      subject: 'Welcome to The SPM Syndicate',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #E5E5E5; padding: 40px;">
          <h1 style="color: #7C3AED; font-size: 32px; margin-bottom: 20px;">Welcome to The Syndicate</h1>

          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
            You're now part of The SPM Syndicate - the community that knows the reality.
          </p>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            Every week, you'll get:
          </p>

          <ul style="line-height: 1.8; margin-bottom: 30px;">
            <li>Vendor scorecards (who's good at what, who breaks where)</li>
            <li>Implementation reality (what actually happens)</li>
            <li>Comp design patterns (what works, what breaks)</li>
            <li>Governance truth (how to prevent chaos)</li>
          </ul>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            No vendor spin. No consultant theater. No "best practice" bullshit.
          </p>

          <p style="line-height: 1.6; margin-bottom: 30px;">
            Just the truth about what works, what breaks, and why.
          </p>

          <a href="https://www.intelligentspm.com" style="display: inline-block; background: #7C3AED; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Visit Intelligent SPM
          </a>

          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 14px;">
            The Syndicate Studio
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent!'
    })

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
