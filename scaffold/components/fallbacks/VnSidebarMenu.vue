<template>
  <nav class="vn-sm" role="navigation">
    <ul class="vn-sm__list">
      <li v-for="item in visibleItems" :key="item.id" class="vn-sm__item">
        <template v-if="item.children?.length">
          <button
            type="button"
            :class="['vn-sm__row', 'vn-sm__row--group', { 'is-open': openIds.has(item.id) }]"
            @click="toggle(item.id)"
            :title="collapsed ? item.label : ''"
          >
            <span class="vn-sm__icon">{{ item.icon || '•' }}</span>
            <span v-if="!collapsed" class="vn-sm__label">{{ item.label }}</span>
            <span v-if="!collapsed" class="vn-sm__chevron">{{ openIds.has(item.id) ? '▾' : '▸' }}</span>
          </button>
          <ul v-show="openIds.has(item.id) && !collapsed" class="vn-sm__sublist">
            <li v-for="child in (item.children || []).filter(c => !c.hidden)" :key="child.id">
              <router-link
                :to="resolve(child)"
                class="vn-sm__row vn-sm__row--child"
                active-class="is-active"
              >
                <span class="vn-sm__icon">{{ child.icon || '·' }}</span>
                <span class="vn-sm__label">{{ child.label }}</span>
                <span v-if="child.badge != null" class="vn-sm__badge">{{ child.badge }}</span>
              </router-link>
            </li>
          </ul>
        </template>
        <template v-else>
          <router-link
            :to="resolve(item)"
            class="vn-sm__row"
            active-class="is-active"
            :title="collapsed ? item.label : ''"
          >
            <span class="vn-sm__icon">{{ item.icon || '•' }}</span>
            <span v-if="!collapsed" class="vn-sm__label">{{ item.label }}</span>
            <span v-if="!collapsed && item.badge != null" class="vn-sm__badge">{{ item.badge }}</span>
          </router-link>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * Fallback sidebar menu — mirrors the props of `vue-nice-sidebar-menu`
 * so swapping it in later is just a matter of changing the import.
 */
import { computed, ref } from 'vue';
import type { MenuItem } from '../../config/menu';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  items: MenuItem[];
  collapsed?: boolean;
}>();

const openIds = ref(new Set<string>());

const visibleItems = computed(() => props.items.filter((i) => !i.hidden));

function toggle(id: string) {
  if (openIds.value.has(id)) openIds.value.delete(id);
  else openIds.value.add(id);
}

function resolve(item: MenuItem): RouteLocationRaw {
  if (item.routeName) return { name: item.routeName };
  if (item.path) return item.path;
  return '#';
}
</script>

<style scoped>
.vn-sm { padding: var(--vn-space-3) 0; }
.vn-sm__list, .vn-sm__sublist {
  list-style: none;
  margin: 0;
  padding: 0;
}
.vn-sm__sublist { padding-left: var(--vn-space-5); }

.vn-sm__row {
  display: flex;
  align-items: center;
  gap: var(--vn-space-3);
  width: 100%;
  padding: 8px var(--vn-space-4);
  background: transparent;
  border: 0;
  text-align: left;
  font: inherit;
  color: var(--vn-sidebar-text-muted);
  cursor: pointer;
  text-decoration: none;
  border-radius: 0;
  transition: background var(--vn-transition), color var(--vn-transition);
}
.vn-sm__row:hover { color: var(--vn-sidebar-active-text); background: rgba(255,255,255,0.04); }
.vn-sm__row.is-active {
  background: var(--vn-sidebar-active-bg);
  color: var(--vn-sidebar-active-text);
}

.vn-sm__row--child { padding-left: var(--vn-space-5); font-size: 13px; }

.vn-sm__icon  { width: 20px; text-align: center; flex: 0 0 auto; }
.vn-sm__label { flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vn-sm__chevron { font-size: 10px; opacity: 0.7; }
.vn-sm__badge {
  background: var(--vn-color-primary);
  color: var(--vn-color-primary-contrast);
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
}
</style>
