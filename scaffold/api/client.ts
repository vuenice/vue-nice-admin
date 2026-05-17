import axios, { type AxiosInstance } from 'axios';

/**
 * Shared axios instance for all admin API calls.
 *
 *  - `withCredentials: true`  → session cookie travels with every request.
 *  - CSRF header is picked up from either the Laravel `XSRF-TOKEN` cookie
 *    or the `<meta name="csrf-token">` tag (Adonis default).
 *  - 401 responses bubble up; the auth store decides whether to redirect.
 */
export const api: AxiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function readMetaCsrf(): string | null {
  if (typeof document === 'undefined') return null;
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content') || null
  );
}

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const laravelCsrf = readCookie('XSRF-TOKEN');
    const metaCsrf = readMetaCsrf();
    if (laravelCsrf) {
      config.headers.set?.('X-XSRF-TOKEN', laravelCsrf);
    }
    if (metaCsrf) {
      config.headers.set?.('X-CSRF-Token', metaCsrf);
    }
  }
  return config;
});
