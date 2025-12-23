import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
