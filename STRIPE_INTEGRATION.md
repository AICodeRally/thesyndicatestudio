# Stripe Integration Guide

This document explains where to add your existing Stripe code to enable real subscriptions.

## Environment Variables Needed

Add these to your `.env` file:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_SPARCC=price_... # $29/month recurring price ID
```

## Files to Update

### 1. Stripe Checkout (`src/app/api/stripe/checkout/route.ts`)

**Current**: Stub that returns fake URL
**Replace with**: Your Stripe Checkout Session code

```typescript
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const checkoutSession = await stripe.checkout.sessions.create({
  customer_email: session.user.email,
  line_items: [{
    price: process.env.STRIPE_PRICE_ID_SPARCC,
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: `${process.env.NEXTAUTH_URL}/settings/billing?success=true`,
  cancel_url: `${process.env.NEXTAUTH_URL}/settings/billing?canceled=true`,
  metadata: {
    userId: session.user.id,
  },
})

return NextResponse.json({ url: checkoutSession.url })
```

### 2. Billing Portal (`src/app/api/stripe/portal/route.ts`)

**Current**: Stub that redirects to settings
**Replace with**: Your Stripe Portal Session code

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const portalSession = await stripe.billingPortal.sessions.create({
  customer: subscription.stripeCustomerId,
  return_url: `${process.env.NEXTAUTH_URL}/settings/billing`,
})

return NextResponse.redirect(portalSession.url)
```

### 3. Webhook Handler (`src/app/api/webhooks/stripe/route.ts`)

**Current**: Stub that logs events
**Replace with**: Your Stripe webhook verification and handling

The stub already has commented code showing:
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellation

Key actions:
- Update user tier in database
- Create/update Subscription records
- Handle cancellations

### 4. Install Stripe SDK

```bash
pnpm add stripe @stripe/stripe-js
```

## Database Schema

Already created and ready:

```prisma
model Subscription {
  id                   String   @id @default(cuid())
  userId               String
  stripeCustomerId     String   @unique
  stripeSubscriptionId String   @unique
  stripePriceId        String
  status               String   // active | canceled | past_due
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Feature Gates

Already implemented:

**Chat Limits**:
- `src/app/api/chat/route.ts` checks tier and enforces 3-message limit for FREE
- UI shows remaining messages
- Upgrade prompt appears at limit

**Collection Limits**:
- `src/components/vault/CollectionLimitGuard.tsx` enforces 3-collection limit for FREE
- UI shows warning at 2 collections
- Blocks creation at 3 collections

**Feature Access**:
- `src/lib/features.ts` has utility functions:
  - `canUseFeature(tier, feature)` - Boolean check
  - `getFeatureLimit(tier, feature)` - Get numeric limit
  - `hasReachedLimit(tier, feature, count)` - Check if at limit

## Testing Stripe Integration

### 1. Create Stripe Product & Price

In Stripe Dashboard:
1. Create product: "SPARCC Subscription"
2. Create price: $29/month recurring
3. Copy price ID to `STRIPE_PRICE_ID_SPARCC`

### 2. Set Up Webhook

In Stripe Dashboard → Webhooks:
1. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
2. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Test with Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### 4. Test Checkout Flow

1. Go to `/settings/billing`
2. Click "Upgrade to SPARCC"
3. Complete test checkout (use card: 4242 4242 4242 4242)
4. Verify user tier upgraded to SPARCC in database
5. Verify unlimited chat messages work

## Feature Rollout Checklist

- [ ] Add Stripe environment variables
- [ ] Install `stripe` package
- [ ] Replace checkout stub with real Stripe code
- [ ] Replace portal stub with real Stripe code
- [ ] Replace webhook stub with real Stripe code
- [ ] Create SPARCC product and price in Stripe
- [ ] Set up webhook endpoint in Stripe
- [ ] Test checkout flow end-to-end
- [ ] Test subscription management (cancel, resume)
- [ ] Test webhook events (update, cancel)
- [ ] Verify tier enforcement works
- [ ] Test upgrade flow from free to SPARCC

## Current Status

✅ Database schema ready
✅ Feature gating logic implemented
✅ UI components built
✅ API endpoints stubbed
⏸️ Stripe SDK integration (waiting for your code)
⏸️ Production Stripe credentials

Once you add your Stripe code to the 3 files above, the entire subscription flow will work!
