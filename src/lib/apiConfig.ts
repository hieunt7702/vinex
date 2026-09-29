/**
 * VINEX API Configuration
 *
 * ⚠️  CRITICAL PERF RULE:
 *   Client-side code MUST use `/api/v1` (same-origin relative path).
 *   NEVER call `https://api.vinexgroup.vn/v1` from the browser — that adds
 *   a full DNS lookup + TLS handshake (1-2 s) on every request.
 *
 *   Server-side RSC/API routes: use Prisma/dataService directly, not fetch().
 */

/**
 * Returns the API base URL appropriate for the current execution context.
 *
 * Client-side → always `/api/v1` (same-origin, zero extra latency)
 * Server-side → internal URL or env override
 */
export const getApiBaseUrl = (): string => {
  // ── Client side (browser) ────────────────────────────────────────────────
  if (typeof window !== 'undefined') {
    // Always use relative path on the client — avoids DNS + TLS overhead of
    // external domains like api.vinexgroup.vn (was adding 1-2 s per request)
    return '/api/v1';
  }

  // ── Server side (SSR / API routes / RSC) ─────────────────────────────────
  // Prefer explicit server-only env var (set in Railway dashboard)
  if (process.env.API_URL?.trim()) {
    return process.env.API_URL.replace(/\/+$/, '');
  }
  // Railway injects this automatically for the service's public URL
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api/v1`;
  }
  // Public env (available server-side too) — only used as last resort on server
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  return '/api/v1';
};

export const getApiUrl = (endpoint: string = ''): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
