import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Replace with your Stripe checkout code
    // ============================================
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    //
    // const checkoutSession = await stripe.checkout.sessions.create({
    //   customer_email: session.user.email,
    //   line_items: [{
    //     price: process.env.STRIPE_PRICE_ID_SPARCC, // $29/month
    //     quantity: 1,
    //   }],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXTAUTH_URL}/settings/billing?success=true`,
    //   cancel_url: `${process.env.NEXTAUTH_URL}/settings/billing?canceled=true`,
    //   metadata: {
    //     userId: session.user.id,
    //   },
    // })
    //
    // return NextResponse.json({ url: checkoutSession.url })
    // ============================================

    // STUB: Return fake checkout URL for now
    console.log('STUB: Stripe checkout requested for user:', session.user.id)

    return NextResponse.json({
      url: '/settings/billing?stub=true',
      message: 'STUB: Replace with real Stripe checkout',
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
