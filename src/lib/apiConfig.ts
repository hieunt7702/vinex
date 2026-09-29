/**
 * VINEX API Configuration
 *
 * KEY PERF NOTE: On the server side (SSR/RSC), NEVER call back to your own
 * Next.js API routes via HTTP. Instead, use Prisma/dataService directly.
 * This file is kept for client-side fetch calls only.
 */

export const getApiBaseUrl = (): string => {
  // ── Client side ──────────────────────────────────────────────────────────
  if (typeof window !== 'undefined') {
    // If an explicit public URL is configured, use it
    if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    }
    // Local dev
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return '/api/v1';
    }
    // Production: relative path (same origin, avoids extra DNS lookup)
    return '/api/v1';
  }

  // ── Server side (SSR / API routes) ───────────────────────────────────────
  // Prefer explicit env vars configured in Railway dashboard
  if (process.env.API_URL?.trim()) {
    return process.env.API_URL.replace(/\/+$/, '');
  }
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  // Railway injects RAILWAY_PUBLIC_DOMAIN for the service's public URL
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api/v1`;
  }

  return 'https://api.vinexgroup.vn/v1';
};

export const getApiUrl = (endpoint: string = ''): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
