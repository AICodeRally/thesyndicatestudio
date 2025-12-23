// Quick script to create a dev session
// Run: pnpm tsx scripts/create-dev-session.ts

import { prisma } from '../src/lib/db'

async function createDevSession() {
  const email = 'todd.lebaron@gmail.com'

  // Get or create user
  const user = await prisma.user.upsert({
    where: { email },
    update: { tier: 'SPARCC' },
    create: {
      email,
      name: 'Todd LeBaron',
      tier: 'SPARCC',
    },
  })

  // Create session
  const sessionToken = `dev-${Date.now()}-${Math.random().toString(36)}`
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const session = await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  })

  console.log('\n✅ Dev session created!')
  console.log('\nSession Token:', sessionToken)
  console.log('\nTo use:')
  console.log('1. Open browser DevTools (F12)')
  console.log('2. Go to Application → Cookies → localhost:3000')
  console.log('3. Add cookie:')
  console.log(`   Name: next-auth.session-token`)
  console.log(`   Value: ${sessionToken}`)
  console.log('4. Refresh page - you\'re logged in!')
  console.log('\nOr just run:')
  console.log(`document.cookie="next-auth.session-token=${sessionToken}; path=/; max-age=2592000"`)
  console.log('\nThen refresh the page.')
}

createDevSession()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
