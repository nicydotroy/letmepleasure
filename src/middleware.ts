import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'

// The site links only to path URLs, but ?category= and ?q= links were live
// long enough to be indexed and shared. Redirect them permanently onto their
// path equivalents rather than leaving duplicate query-string URLs crawlable.
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  if (![...searchParams.keys()].length) return NextResponse.next()

  const q = searchParams.get('q')
  const category = searchParams.get('category')
  const city = searchParams.get('city')

  let target: string | null = null

  if (pathname === '/') {
    const term = slugify(q || '')
    if (term) target = city ? `/search/${term}/${city}` : `/search/${term}`
    else if (category) target = `/category/${category}`
    else if (city) target = `/call-girls/${city}`
  } else if (category && /^\/call-girls\/[^/]+\/[^/]+$/.test(pathname)) {
    target = `${pathname}/${category}`
  }

  if (!target) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = target
  url.search = ''
  return NextResponse.redirect(url, 301)
}

export const config = {
  // Skip API routes, Next internals and files with an extension.
  matcher: ['/((?!api|_next|.*\\.).*)'],
}
