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

// Optionally add interceptors for auth tokens here
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Global response interceptor to handle errors and show toasts
apiClient.interceptors.response.use(
  (response) => {
    // We can also intercept successful POST/PATCH requests here,
    // but typically it's better to show success inside the component to customize the message.
    return response;
  },
  (error) => {
    // Extract error message from response or fallback to generic message
    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';
    
    // Display error toast
    toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));

    return Promise.reject(error);
  }
);

export default apiClient;
