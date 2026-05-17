import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '../stores/auth';

/**
 * The SPA is typically mounted under a backend route like `/admin/*`,
 * so we read the base path from a data attribute on the mount element
 * (or the Vite-injected constant). This lets the same build serve under
 * `/admin`, `/console`, or `/`.
 */
function detectBase(): string {
  if (typeof document !== 'undefined') {
    const mountId =
      typeof __VUENICE_ADMIN_MOUNT__ !== 'undefined'
        ? __VUENICE_ADMIN_MOUNT__
        : 'vuenice-admin';
    const el = document.getElementById(mountId);
    const explicit = el?.getAttribute('data-base');
    if (explicit) return explicit;
  }
  return '/admin';
}

export const router = createRouter({
  history: createWebHistory(detectBase()),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved || { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  const requiresAuth = to.matched.some((r) => r.meta?.requiresAuth !== false);
  const isGuestOnly = to.matched.some((r) => r.meta?.guestOnly === true);

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (isGuestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }
  return true;
});
