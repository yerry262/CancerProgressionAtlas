import api from './api';

export interface RegisterPayload {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  isVerified?: boolean;
  createdAt: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },

  async anonymousSession(): Promise<{ sessionToken: string }> {
    const { data } = await api.post<{ sessionToken: string }>('/auth/anonymous-session');
    return data;
  },

  async sendVerificationEmail(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/send-verification-email', { email });
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string; user: AuthUser }> {
    const { data } = await api.post<{ message: string; user: AuthUser }>('/auth/verify-email', { token });
    return data;
  },
};
