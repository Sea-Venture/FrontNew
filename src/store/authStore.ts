import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
  AUTH_API_ENDPOINTS
} from '../services/authService';

export { AUTH_API_ENDPOINTS };

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  accesses?: Array<{
    resource: string;
    actions: boolean;
  }>;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await loginService(credentials);

          set({
            user: {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.username || response.user.name,
              accesses: response.user.accesses,
            },
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await registerService(userData);

          set({
            user: {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.username || response.user.name,
              accesses: response.user.accesses,
            },
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await logoutService();
        } catch (error) {
          console.warn('Logout service failed:', error);
        }

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Note: refresh token flow removed; no refreshAccessToken implementation.

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.accessToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);