import axios from 'axios';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────────────────────
// VINEX Admin API Client
//
// KEY PERF FIX: baseURL is now computed lazily (inside the interceptor) instead
// of at module-load time. This ensures `typeof window` check is reliable and
// always resolves to `/api/v1` (relative, same-origin) in the browser.
//
// The old pattern `const API_URL = getApiBaseUrl()` ran at module scope during
// SSR hydration where `window` may be undefined, causing it to fall through to
// the external `https://api.vinexgroup.vn/v1` domain — adding 1-2 s DNS+TLS
// overhead on every admin request.
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  // Always use same-origin relative path — no DNS lookup, no TLS overhead
  baseURL: '/api/v1',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject authenticated staff/admin info into every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('vinex_auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        config.headers['x-user-id']       = String(u.id);
        config.headers['x-user-username'] = encodeURIComponent(u.username || '');
        config.headers['x-user-fullname'] = encodeURIComponent(u.fullName || u.username || '');
        config.headers['x-user-role']     = u.role || 'STAFF';
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// Global response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 409 Conflict is handled by the specialized ConflictModal in forms
    if (error.response?.status === 409) {
      return Promise.reject(error);
    }
    const errorMessage =
      error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';
    toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    return Promise.reject(error);
  },
);

export default apiClient;
