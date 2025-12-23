import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // TODO: Replace with your Stripe webhook code
    // ============================================
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    //
    // let event
    // try {
    //   event = stripe.webhooks.constructEvent(
    //     body,
    //     signature!,
    //     process.env.STRIPE_WEBHOOK_SECRET!
    //   )
    // } catch (err) {
    //   return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    // }
    //
    // switch (event.type) {
    //   case 'checkout.session.completed': {
    //     const session = event.data.object
    //     const userId = session.metadata.userId
    //     const customerId = session.customer
    //     const subscriptionId = session.subscription
    //
    //     // Upgrade user to SPARCC
    //     await prisma.user.update({
    //       where: { id: userId },
    //       data: { tier: 'SPARCC' },
    //     })
    //
    //     // Create subscription record
    //     await prisma.subscription.create({
    //       data: {
    //         userId,
    //         stripeCustomerId: customerId as string,
    //         stripeSubscriptionId: subscriptionId as string,
    //         stripePriceId: session.line_items.data[0].price.id,
    //         status: 'active',
    //         currentPeriodEnd: new Date(session.expires_at * 1000),
    //       },
    //     })
    //     break
    //   }
    //
    //   case 'customer.subscription.updated': {
    //     const subscription = event.data.object
    //     await prisma.subscription.update({
    //       where: { stripeSubscriptionId: subscription.id },
    //       data: {
    //         status: subscription.status,
    //         currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    //         cancelAtPeriodEnd: subscription.cancel_at_period_end,
    //       },
    //     })
    //     break
    //   }
    //
    //   case 'customer.subscription.deleted': {
    //     const subscription = event.data.object
    //     const sub = await prisma.subscription.findUnique({
    //       where: { stripeSubscriptionId: subscription.id },
    //     })
    //
    //     if (sub) {
    //       // Downgrade user to FREE
    //       await prisma.user.update({
    //         where: { id: sub.userId },
    //         data: { tier: 'FREE' },
    //       })
    //
    //       await prisma.subscription.update({
    //         where: { stripeSubscriptionId: subscription.id },
    //         data: { status: 'canceled' },
    //       })
    //     }
    //     break
    //   }
    // }
    // ============================================

    // STUB: Log webhook event
    console.log('STUB: Stripe webhook received')
    console.log('Signature:', signature)
    console.log('Body length:', body.length)

    return NextResponse.json({ received: true, stub: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
