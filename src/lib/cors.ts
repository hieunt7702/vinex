import { NextResponse } from 'next/server';

/**
 * Universal CORS Helper for VINEX
 * Supports https://api.vinexgroup.vn, https://vinexgroup.vn, localhost and preview domains.
 * Guarantees compliance with W3C CORS specification (never pairs '*' with credentials: true).
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = 
    !origin ||
    origin.endsWith('vinexgroup.vn') ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('railway.app');

  const allowedOrigin = isAllowed && origin ? origin : '*';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Origin, X-CSRF-Token, Cache-Control, Pragma',
    'Access-Control-Max-Age': '86400',
  };

  if (allowedOrigin !== '*') {
    headers['Access-Control-Allow-Origin'] = allowedOrigin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

export function handleCorsPreflight(request: Request): Response {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
