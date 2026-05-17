<template>
  <div v-if="visible" :class="['vn-alert', `vn-alert--${variant}`]" role="alert">
    <slot />
    <button v-if="dismissible" class="vn-alert__close" @click="visible = false" aria-label="Dismiss">×</button>
  </div>
</template>

<script setup lang="ts">
/**
 * Fallback alert — swap to `vue-nice-alert` when the GitHub install resolves.
 */
import { ref } from 'vue';
withDefaults(
  defineProps<{
    variant?: 'info' | 'success' | 'warning' | 'danger';
    dismissible?: boolean;
  }>(),
  { variant: 'info', dismissible: false }
);
const visible = ref(true);
</script>

<style scoped>
.vn-alert {
  position: relative;
  padding: var(--vn-space-3) var(--vn-space-4);
  border-radius: var(--vn-radius-md);
  border: 1px solid var(--vn-color-border);
  background: var(--vn-color-surface-2);
  font-size: 13px;
}
.vn-alert--info    { border-color: #c7d2fe; background: #eef2ff; color: #3730a3; }
.vn-alert--success { border-color: #bbf7d0; background: #f0fdf4; color: #166534; }
.vn-alert--warning { border-color: #fde68a; background: #fffbeb; color: #92400e; }
.vn-alert--danger  { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
.vn-alert__close {
  position: absolute;
  top: 4px;
  right: 8px;
  background: transparent;
  border: 0;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
}
</style>
