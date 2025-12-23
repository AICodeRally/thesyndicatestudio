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

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const subscription = user?.subscriptions[0]

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // TODO: Replace with your Stripe portal code
    // ============================================
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    //
    // const portalSession = await stripe.billingPortal.sessions.create({
    //   customer: subscription.stripeCustomerId,
    //   return_url: `${process.env.NEXTAUTH_URL}/settings/billing`,
    // })
    //
    // return NextResponse.redirect(portalSession.url)
    // ============================================

    // STUB: Return fake portal redirect
    console.log('STUB: Stripe portal requested for customer:', subscription.stripeCustomerId)

    return NextResponse.redirect(new URL('/settings/billing?portal=stub', request.url))

  } catch (error) {
    console.error('Stripe portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
