import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCorsHeaders, handleCorsPreflight } from '@/lib/cors';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const origin = request.headers.get('origin');
  const isApiRequest = hostname.startsWith('api.') || pathname.startsWith('/api/') || pathname.startsWith('/v1/');

  // 1. Handle Preflight OPTIONS for ANY API request globally
  if (request.method === 'OPTIONS' && isApiRequest) {
    return handleCorsPreflight(request);
  }

  // 2. Subdomain API: api.vinexgroup.vn
  if (hostname.startsWith('api.')) {
    // API root status
    if (pathname === '/' || pathname === '') {
      const res = NextResponse.json({
        name: 'VINEX High-End Agriculture API',
        version: '1.0.0',
        status: 'online',
        docs: 'https://vinexgroup.vn',
        endpoints: {
          products: '/v1/products',
          articles: '/v1/articles',
          categories: '/v1/categories',
          leads: '/v1/leads',
          settings: '/v1/settings'
        }
      });
      const corsHeaders = getCorsHeaders(origin);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    // Rewrite /v1/... to /api/v1/... with CORS
    if (pathname.startsWith('/v1/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/api${pathname}`;
      const res = NextResponse.rewrite(url);
      const corsHeaders = getCorsHeaders(origin);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    // Direct /api/... request on api subdomain
    if (pathname.startsWith('/api/')) {
      const res = NextResponse.next();
      const corsHeaders = getCorsHeaders(origin);
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
  }

  // 3. Main domain direct /api/... calls
  if (pathname.startsWith('/api/')) {
    const res = NextResponse.next();
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 4. i18n & Static routing
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale || pathname.startsWith('/admin')) return;

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Catch all requests except static assets
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};
