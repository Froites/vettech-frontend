import { create } from 'zustand';
import type { User } from '../types/auth';


interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ 
      user, 
      accessToken, 
      refreshToken, 
      isAuthenticated: true, 
      isLoading: false 
    });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  initializeAuth: () => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedUser && storedAccessToken) {
      try {
        const user = JSON.parse(storedUser);
        set({ 
          user, 
          accessToken: storedAccessToken, 
          refreshToken: storedRefreshToken,
          isAuthenticated: true, 
          isLoading: false 
        });
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));