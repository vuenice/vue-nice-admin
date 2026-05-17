<template>
  <div class="left-sb">
    <div class="left-sb__brand">
      <div class="left-sb__logo">VN</div>
      <div v-if="!menu.collapsed" class="left-sb__name">VueNice Admin</div>
    </div>

    <VnSidebarMenu class="left-sb__menu vn-scroll" :items="menu.items" :collapsed="menu.collapsed" />

    <div class="left-sb__foot">
      <button class="left-sb__collapse" @click="menu.toggleCollapsed()" :title="menu.collapsed ? 'Expand' : 'Collapse'">
        {{ menu.collapsed ? '»' : '«' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '../stores/menu';
import { VnSidebarMenu } from './fallbacks';
// When ready, swap the import above for:
//   import VnSidebarMenu from 'vue-nice-sidebar-menu';

const menu = useMenuStore();
</script>

<style scoped>
.left-sb {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.left-sb__brand {
  display: flex;
  align-items: center;
  gap: var(--vn-space-3);
  padding: 0 var(--vn-space-4);
  height: var(--vn-topbar-height);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.left-sb__logo {
  width: 32px;
  height: 32px;
  border-radius: var(--vn-radius-md);
  background: var(--vn-color-primary);
  color: var(--vn-color-primary-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex: 0 0 auto;
}
.left-sb__name {
  font-weight: 600;
  color: var(--vn-sidebar-active-text);
}
.left-sb__menu {
  flex: 1 1 auto;
  min-height: 0;
}
.left-sb__foot {
  padding: var(--vn-space-3);
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  justify-content: flex-end;
}
.left-sb__collapse {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--vn-sidebar-text);
  border-radius: var(--vn-radius-sm);
  width: 28px;
  height: 28px;
  cursor: pointer;
}
.left-sb__collapse:hover { background: rgba(255,255,255,0.06); }
</style>
