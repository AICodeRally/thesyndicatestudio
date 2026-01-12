import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedPaths = [
  '/vault',
  '/settings',
  '/api/vault',
  '/api/chat',
  '/api/counsel/save',
]

// Check if path is protected
function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(path => pathname.startsWith(path))
}

function handleDomainRedirects(request: NextRequest): NextResponse | null {
  const { hostname, pathname } = request.nextUrl

  // Domain redirects (301 permanent)
  if (hostname === 'oexits.com' || hostname === 'www.oexits.com') {
    return NextResponse.redirect('https://intelligentspm.com' + pathname, 301)
  }

  if (hostname === 'thetoddfather.ai' || hostname === 'www.thetoddfather.ai') {
    if (pathname === '/podcast') {
      return NextResponse.redirect('https://intelligentspm.com/toddfather/podcast', 301)
    }
    return NextResponse.redirect('https://intelligentspm.com/toddfather' + pathname, 301)
  }

  if (hostname === 'thespmsyndicate.com' || hostname === 'www.thespmsyndicate.com') {
    return NextResponse.redirect('https://intelligentspm.com/syndicate' + pathname, 301)
  }

  if (hostname === 'www.intelligentspm.com') {
    return NextResponse.redirect('https://intelligentspm.com' + pathname, 301)
  }

  if (pathname === '/community') {
    return NextResponse.redirect(new URL('/syndicate', request.url), 301)
  }

  return null
}

export function middleware(request: NextRequest) {
  // Handle domain redirects first
  const redirectResponse = handleDomainRedirects(request)
  if (redirectResponse) {
    return redirectResponse
  }

  const { pathname } = request.nextUrl

  // Check if protected route
  if (isProtectedPath(pathname)) {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      // Redirect to sign-in with return URL
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
