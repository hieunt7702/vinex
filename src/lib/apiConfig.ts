/**
 * VINEX API Configuration
 * Supports production API domain: https://api.vinexgroup.vn/v1
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Local development fallback
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '/api/v1';
    }
  }

  // If explicitly configured via env, respect it
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    // Production default: dedicated API domain
    return 'https://api.vinexgroup.vn/v1';
  }

  // Server-side (Node.js runtime / SSR / SSG)
  if (process.env.API_URL && process.env.API_URL.trim() !== '') {
    return process.env.API_URL.replace(/\/+$/, '');
  }

  return 'https://api.vinexgroup.vn/v1';
};

export const getApiUrl = (endpoint: string = ''): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
