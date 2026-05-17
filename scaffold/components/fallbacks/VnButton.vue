<template>
  <button
    :type="type"
    :class="['vn-btn', `vn-btn--${variant}`, `vn-btn--${size}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="vn-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * Fallback button — swap to `vue-nice-button` once that package is wired:
 *   import VnButton from 'vue-nice-button';
 */
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
  }>(),
  { type: 'button', variant: 'primary', size: 'md', loading: false, disabled: false }
);
defineEmits<{ (e: 'click', ev: MouseEvent): void }>();
</script>

<style scoped>
.vn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--vn-space-2);
  border: 1px solid transparent;
  border-radius: var(--vn-radius-md);
  font: inherit;
  cursor: pointer;
  transition: background var(--vn-transition), border-color var(--vn-transition);
}
.vn-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.vn-btn--sm { padding: 4px 10px; font-size: 12px; }
.vn-btn--md { padding: 7px 14px; font-size: 14px; }
.vn-btn--lg { padding: 10px 18px; font-size: 15px; }

.vn-btn--primary {
  background: var(--vn-color-primary);
  color: var(--vn-color-primary-contrast);
}
.vn-btn--primary:hover:not(:disabled) { filter: brightness(0.95); }

.vn-btn--secondary {
  background: var(--vn-color-surface);
  border-color: var(--vn-color-border);
  color: var(--vn-color-text);
}
.vn-btn--secondary:hover:not(:disabled) { background: var(--vn-color-surface-2); }

.vn-btn--ghost {
  background: transparent;
  color: var(--vn-color-text);
}
.vn-btn--ghost:hover:not(:disabled) { background: var(--vn-color-surface-2); }

.vn-btn--danger {
  background: var(--vn-color-danger);
  color: #fff;
}

.vn-btn__spinner {
  width: 12px; height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: vn-spin 0.7s linear infinite;
}
@keyframes vn-spin { to { transform: rotate(360deg); } }
</style>
