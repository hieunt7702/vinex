import { create } from 'zustand';
import Cookies from 'js-cookie';

export type UserRole = 'ADMIN' | 'STAFF';

export interface UserPermissions {
  products?: boolean;
  articles?: boolean;
  categories?: boolean;
  media?: boolean;
  leads?: boolean;
  canDelete?: boolean;
  canManageStaff?: boolean;
}

export interface User {
  id: number | string;
  username: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  permissions?: UserPermissions;
  status?: 'ACTIVE' | 'INACTIVE';
  department?: string;
  avatar?: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userUpdates: Partial<User>) => void;
}

const getInitialToken = () => Cookies.get('token') || null;

const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('vinex_auth_user');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // ignore
  }

  // Fallback if token exists but no user stored
  if (getInitialToken()) {
    return {
      id: 1,
      username: 'admin',
      fullName: 'Quản trị viên Hệ thống',
      role: 'ADMIN',
      status: 'ACTIVE'
    };
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  login: (user, token) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('vinex_auth_user', JSON.stringify(user));
      } catch (e) {
        // ignore
      }
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('vinex_auth_user');
      } catch (e) {
        // ignore
      }
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (userUpdates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...userUpdates };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('vinex_auth_user', JSON.stringify(updated));
        } catch (e) {
          // ignore
        }
      }
      return { user: updated };
    });
  }
}));
