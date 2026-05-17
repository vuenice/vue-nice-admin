import { api } from './client';

export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar_url?: string | null;
  [extra: string]: unknown;
}

/**
 * Backend contract — see docs/BACKEND_CONTRACT.md for the response shapes.
 * All endpoints are prefixed `/api/admin/auth/*`.
 */
export const authApi = {
  me: () => api.get<{ user: User }>('/api/admin/auth/me').then((r) => r.data.user),

  login: (email: string, password: string, remember = false) =>
    api
      .post<{ user: User }>('/api/admin/auth/login', { email, password, remember })
      .then((r) => r.data.user),

  register: (name: string, email: string, password: string) =>
    api
      .post<{ user: User }>('/api/admin/auth/register', { name, email, password })
      .then((r) => r.data.user),

  forgotPassword: (email: string) =>
    api.post('/api/admin/auth/forgot-password', { email }).then(() => undefined),

  logout: () => api.post('/api/admin/auth/logout').then(() => undefined),
};
