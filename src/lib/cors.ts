import { NextResponse } from 'next/server';

/**
 * Universal CORS Helper for VINEX
 * Supports https://api.vinexgroup.vn, https://vinexgroup.vn, localhost and external clients.
 * Full compliance with W3C CORS specification and modern browsers.
 */
export function getCorsHeaders(
  origin: string | null,
  requestHeaders?: string | null
): Record<string, string> {
  const allowedHeadersList = [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Origin',
    'X-CSRF-Token',
    'Cache-Control',
    'Pragma',
    'X-Api-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
    'x-user-id',
    'x-user-username',
    'x-user-fullname',
    'x-user-role',
    'X-User-Id',
    'X-User-Username',
    'X-User-Fullname',
    'X-User-Role',
  ];

  let allowedHeaders = allowedHeadersList.join(', ');
  if (requestHeaders && requestHeaders.trim() !== '') {
    allowedHeaders = `${allowedHeaders}, ${requestHeaders}`;
  }

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': allowedHeaders,
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, x-user-id, x-user-role, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  if (origin) {
    // When origin is present, echo it back so credentials (cookies/auth headers) work reliably across all domains
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Vary'] = 'Origin';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

export function handleCorsPreflight(request: Request): Response {
  const origin = request.headers.get('origin');
  const reqHeaders = request.headers.get('access-control-request-headers');
  const headers = getCorsHeaders(origin, reqHeaders);

  return NextResponse.json({}, {
    status: 200,
    headers,
  });
}

/**
 * Helper to attach CORS headers to any outgoing NextResponse
 */
export function applyCorsHeaders(response: Response | NextResponse, request?: Request): Response | NextResponse {
  const origin = request ? request.headers.get('origin') : null;
  const corsHeaders = getCorsHeaders(origin);
  Object.entries(corsHeaders).forEach(([k, v]) => {
    response.headers.set(k, v);
  });
  return response;
}
