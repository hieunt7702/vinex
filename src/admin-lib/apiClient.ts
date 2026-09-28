import axios from 'axios';
import { toast } from 'sonner';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject authenticated staff/admin info into headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('vinex_auth_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        config.headers['x-user-id'] = String(u.id);
        config.headers['x-user-username'] = encodeURIComponent(u.username || '');
        config.headers['x-user-fullname'] = encodeURIComponent(u.fullName || u.username || '');
        config.headers['x-user-role'] = u.role || 'STAFF';
      }
    } catch (e) {
      // ignore
    }
  }
  return config;
});

// Global response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't show generic error toast for 409 Conflict (handled by specialized Conflict modal in form)
    if (error.response?.status === 409) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';
    toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));

    return Promise.reject(error);
  }
);

export default apiClient;
