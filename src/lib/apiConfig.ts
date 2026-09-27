/**
 * VINEX API Configuration
 * Supports production API domain: https://api.vinexgroup.vn/v1
 */
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
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
