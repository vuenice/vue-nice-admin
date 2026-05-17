import type { RouteRecordRaw } from 'vue-router';

/**
 * Edit this file to add pages to the admin panel.
 *
 * Conventions:
 *  - `meta.requiresAuth: false` to make a page public (default is authenticated).
 *  - `meta.guestOnly: true` to redirect logged-in users away (used for /login).
 *  - `meta.layout: 'auth'` to render the centered AuthLayout instead of AdminLayout.
 *  - `meta.title` is displayed in the top bar.
 *
 * Pages live under `./pages/` and are lazy-loaded.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { title: 'Dashboard' },
  },

  // Auth pages
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { layout: 'auth', requiresAuth: false, guestOnly: true, title: 'Sign in' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/auth/Register.vue'),
    meta: { layout: 'auth', requiresAuth: false, guestOnly: true, title: 'Create account' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPassword.vue'),
    meta: { layout: 'auth', requiresAuth: false, guestOnly: true, title: 'Reset password' },
  },

  // Catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { requiresAuth: false, title: 'Not found' },
  },
];
