import { defineStore } from 'pinia';
import { defaultMenu, type MenuItem } from '../config/menu';
import { api } from '../api/client';

interface MenuState {
  items: MenuItem[];
  collapsed: boolean;
  loading: boolean;
}

const STORAGE_KEY = 'vuenice-admin:sidebar-collapsed';

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    items: defaultMenu,
    collapsed:
      typeof window !== 'undefined' &&
      window.localStorage?.getItem(STORAGE_KEY) === '1',
    loading: false,
  }),

  actions: {
    /**
     * Optional: pull the menu from the backend (e.g. for per-role filtering).
     * Falls back silently to the local `config/menu.ts` if the endpoint
     * is missing or returns non-OK.
     */
    async loadFromBackend() {
      this.loading = true;
      try {
        const { data } = await api.get<{ items: MenuItem[] }>('/api/admin/menu');
        if (Array.isArray(data?.items)) this.items = data.items;
      } catch {
        // Keep defaults.
      } finally {
        this.loading = false;
      }
    },

    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      if (typeof window !== 'undefined') {
        window.localStorage?.setItem(STORAGE_KEY, this.collapsed ? '1' : '0');
      }
    },
  },
});
