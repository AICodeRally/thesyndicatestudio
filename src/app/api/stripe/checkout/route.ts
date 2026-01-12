import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import Stripe from 'stripe'

export async function POST() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID_SPARCC) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3005'

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.email!,
      line_items: [{
        price: process.env.STRIPE_PRICE_ID_SPARCC,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${baseUrl}/settings/billing?success=true`,
      cancel_url: `${baseUrl}/settings/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
