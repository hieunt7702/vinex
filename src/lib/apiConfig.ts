/**
 * VINEX API Configuration
 * Supports production API domain: https://api.vinexgroup.vn/v1
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser: ALWAYS use same-origin relative path /api/v1 unless explicitly overridden with a relative path
    const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (envUrl && envUrl.startsWith('/')) {
      return envUrl.replace(/\/+$/, '');
    }
    return '/api/v1';
  }

  // Server-side (Node.js runtime / SSR / SSG)
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    const url = process.env.NEXT_PUBLIC_API_URL.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace(/\/+$/, '');
    }
  }

  if (process.env.API_URL && process.env.API_URL.trim() !== '') {
    return process.env.API_URL.replace(/\/+$/, '');
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  return `${siteUrl.replace(/\/+$/, '')}/api/v1`;
};

export const getApiUrl = (endpoint: string = ''): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
