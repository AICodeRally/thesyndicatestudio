import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/studio(.*)',
  '/vault(.*)',
  '/settings(.*)',
  '/api/studio(.*)',
  '/api/vault(.*)',
  '/api/chat(.*)',
  '/api/counsel/save(.*)',
])

// Routes that are always public
const isPublicRoute = createRouteMatcher([
  '/',
  '/toddfather(.*)',
  '/syndicate(.*)',
  '/counsel(.*)',
  '/learn(.*)',
  '/benchmarks(.*)',
  '/vendors(.*)',
  '/analyze(.*)',
  '/models(.*)',
  '/pricing(.*)',
  '/services(.*)',
  '/contact(.*)',
  '/subscribe(.*)',
  '/legal(.*)',
  '/auth(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/contact(.*)',
  '/api/newsletter(.*)',
  '/api/webhooks(.*)',
])

function handleDomainRedirects(request: NextRequest): NextResponse | null {
  const { hostname, pathname } = request.nextUrl

  // Domain redirects (301 permanent)
  // oexits.com → IntelligentSPM.com
  if (hostname === 'oexits.com' || hostname === 'www.oexits.com') {
    return NextResponse.redirect('https://intelligentspm.com' + pathname, 301)
  }

  // thetoddfather.ai → IntelligentSPM.com/toddfather
  if (hostname === 'thetoddfather.ai' || hostname === 'www.thetoddfather.ai') {
    if (pathname === '/podcast') {
      return NextResponse.redirect('https://intelligentspm.com/toddfather/podcast', 301)
    }
    return NextResponse.redirect('https://intelligentspm.com/toddfather' + pathname, 301)
  }

  // thespmsyndicate.com → IntelligentSPM.com/syndicate
  if (hostname === 'thespmsyndicate.com' || hostname === 'www.thespmsyndicate.com') {
    return NextResponse.redirect('https://intelligentspm.com/syndicate' + pathname, 301)
  }

  // Canonical host: remove www
  if (hostname === 'www.intelligentspm.com') {
    return NextResponse.redirect('https://intelligentspm.com' + pathname, 301)
  }

  // Path aliases
  if (pathname === '/community') {
    return NextResponse.redirect(new URL('/syndicate', request.url), 301)
  }

  return null
}

export default clerkMiddleware(async (auth, request) => {
  // Handle domain redirects first
  const redirectResponse = handleDomainRedirects(request)
  if (redirectResponse) {
    return redirectResponse
  }

  // Protect routes that require authentication
  if (isProtectedRoute(request)) {
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
