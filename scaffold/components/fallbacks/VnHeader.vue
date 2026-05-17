<template>
  <header class="vn-header">
    <slot name="start" />
    <div class="vn-header__title">
      <slot>
        <span>{{ title }}</span>
      </slot>
    </div>
    <div class="vn-header__end">
      <slot name="end" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Fallback header bar — mirrors `vue-nice-header`'s slot shape.
 */
defineProps<{ title?: string }>();
</script>

<style scoped>
.vn-header {
  display: flex;
  align-items: center;
  gap: var(--vn-space-3);
  padding: 0 var(--vn-space-4);
  height: var(--vn-topbar-height);
  background: var(--vn-color-surface);
  border-bottom: 1px solid var(--vn-color-border);
}
.vn-header__title {
  flex: 1 1 auto;
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.vn-header__end {
  display: flex;
  align-items: center;
  gap: var(--vn-space-2);
}
</style>
