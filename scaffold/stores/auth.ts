import { defineStore } from 'pinia';
import { authApi, type User } from '../api/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  /** Tracks whether we've made at least one `fetchMe` round-trip. */
  resolved: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    resolved: false,
  }),

  getters: {
    isAuthenticated: (s) => s.user !== null,
  },

  actions: {
    async fetchMe() {
      this.loading = true;
      try {
        this.user = await authApi.me();
      } catch {
        this.user = null;
      } finally {
        this.loading = false;
        this.resolved = true;
      }
    },

    async login(email: string, password: string, remember = false) {
      this.user = await authApi.login(email, password, remember);
    },

    async register(name: string, email: string, password: string) {
      this.user = await authApi.register(name, email, password);
    },

    async logout() {
      try {
        await authApi.logout();
      } finally {
        this.user = null;
      }
    },
  },
});
