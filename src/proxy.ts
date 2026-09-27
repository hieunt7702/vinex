import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['vi', 'en']
const defaultLocale = 'vi'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Subdomain API: api.vinexgroup.vn
  if (hostname.startsWith('api.')) {
    // Trang chủ API: trả về thông tin hệ thống dạng JSON
    if (pathname === '/' || pathname === '') {
      return NextResponse.json({
        name: 'VINEX High-End Agriculture API',
        version: '1.0.0',
        status: 'online',
        docs: 'https://vinexgroup.vn',
        endpoints: {
          products: '/api/v1/products',
          articles: '/api/v1/articles',
          categories: '/api/v1/categories',
          leads: '/api/v1/leads',
          settings: '/api/v1/settings'
        }
      });
    }

    // Nếu gọi /v1/... -> rewrite ngầm sang /api/v1/...
    if (pathname.startsWith('/v1/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/api${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Nếu đã có /api/... -> cho đi qua bình thường
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale || pathname.startsWith('/admin') || pathname.startsWith('/api')) return

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Bắt toàn bộ các request ngoại trừ static assets
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
}
