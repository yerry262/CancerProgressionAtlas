import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type AuthUser } from '../services/auth.service';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('cpa_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cpa_token'));
  const [isLoading, setIsLoading] = useState(false);

  // Ensure an anonymous session token exists for non-authed uploads
  useEffect(() => {
    if (!localStorage.getItem('cpa_session')) {
      const id = crypto.randomUUID();
      localStorage.setItem('cpa_session', id);
    }
  }, []);

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem('cpa_token', t);
    localStorage.setItem('cpa_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token: t, user: u } = await authService.login({ email, password });
      persist(t, u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const { token: t, user: u } = await authService.register({ email, password, displayName });
      persist(t, u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cpa_token');
    localStorage.removeItem('cpa_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated: !!token, isAdmin: !!user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
