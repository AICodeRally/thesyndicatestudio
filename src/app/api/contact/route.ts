import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Force dynamic to prevent build-time evaluation (AUTH_RESEND_KEY not available at build)
export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    // Send notification to Todd
    await resend.emails.send({
      from: 'The Syndicate Studio <noreply@thesyndicatestudio.com>',
      to: 'todd@intelligentspm.com',
      replyTo: email,
      subject: `[Contact Form] ${name} from ${company || 'Unknown Company'}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0A0A0A; color: #E5E5E5;">
          <h1 style="color: #7C3AED; font-size: 24px; margin-bottom: 20px;">New Contact Form Submission</h1>

          <div style="background: #1A1A2E; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #A855F7;">Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong style="color: #A855F7;">Email:</strong> <a href="mailto:${email}" style="color: #EC4899;">${email}</a></p>
            <p style="margin: 0;"><strong style="color: #A855F7;">Company:</strong> ${company || 'Not provided'}</p>
          </div>

          <div style="background: #1A1A2E; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; color: #A855F7;"><strong>Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    })

    // Send confirmation to the user
    await resend.emails.send({
      from: 'The Syndicate Studio <noreply@thesyndicatestudio.com>',
      to: email,
      subject: 'Message Received - Intelligent SPM',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #E5E5E5; padding: 40px;">
          <h1 style="color: #7C3AED; font-size: 28px; margin-bottom: 20px;">Message Received</h1>

          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
            ${name}, your message has landed.
          </p>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            No auto-responder theater here. I actually read these and respond personally.
            Usually within 24 hours, unless I'm knee-deep in someone's governance disaster.
          </p>

          <p style="line-height: 1.6; margin-bottom: 30px;">
            If it's urgent, just reply with "URGENT" in the subject and I'll prioritize it.
          </p>

          <div style="background: #1A1A2E; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; color: #A855F7;"><strong>Your message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #999;">${message}</p>
          </div>

          <p style="line-height: 1.6;">
            Talk soon,<br>
            <span style="color: #7C3AED; font-weight: bold;">The Syndicate Studio</span>
          </p>

          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 14px;">
            Intelligent SPM<br>
            <a href="https://www.intelligentspm.com" style="color: #7C3AED;">www.intelligentspm.com</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try emailing directly.' },
      { status: 500 }
    )
  }
}
