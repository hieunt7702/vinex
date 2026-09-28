import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCorsHeaders, handleCorsPreflight } from '@/lib/cors';

const locales = ['vi', 'en'];
const defaultLocale = 'vi';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const origin = request.headers.get('origin');
  const isApiHost = hostname.startsWith('api.') || hostname.includes('api.vinexgroup.vn');
  const isApiRequest = isApiHost || pathname.startsWith('/api/') || pathname.startsWith('/v1/');

  // 1. Handle Preflight OPTIONS for ANY API or cross-origin request
  if (request.method === 'OPTIONS' && (isApiRequest || origin)) {
    return handleCorsPreflight(request);
  }

  // 2. Subdomain API root status: api.vinexgroup.vn/
  if (isApiHost && (pathname === '/' || pathname === '')) {
    const res = NextResponse.json({
      name: 'VINEX High-End Agriculture API',
      version: '1.0.0',
      status: 'online',
      docs: 'https://vinexgroup.vn',
      endpoints: {
        dashboard: '/v1/dashboard',
        products: '/v1/products',
        articles: '/v1/articles',
        categories: '/v1/categories',
        leads: '/v1/leads',
        staff: '/v1/staff',
        settings: '/v1/settings',
        media: '/v1/media',
        upload: '/v1/upload',
      }
    });
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 3. Rewrite /v1/... to /api/v1/... with CORS (on BOTH api subdomain and main domain)
  if (pathname.startsWith('/v1/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/api${pathname}`;
    const res = NextResponse.rewrite(url);
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 4. Handle direct /api/... calls with CORS
  if (pathname.startsWith('/api/')) {
    const res = NextResponse.next();
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 5. On API host, do not perform locale redirects for unknown routes
  if (isApiHost) {
    const res = NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    const corsHeaders = getCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 6. Main website i18n & Static routing
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
