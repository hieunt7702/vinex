import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['vi', 'en']
let defaultLocale = 'vi'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all files with an extension (e.g. favicon.ico, .png, .css)
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
}
