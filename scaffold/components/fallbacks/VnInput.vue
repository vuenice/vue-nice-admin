<template>
  <label class="vn-field">
    <span v-if="label" class="vn-field__label">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :class="['vn-field__input', { 'has-error': !!error }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur')"
    />
    <span v-if="error" class="vn-field__error">{{ error }}</span>
    <span v-else-if="hint" class="vn-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup lang="ts">
/**
 * Fallback input — swap to `vue-nice-input` once that package is wired:
 *   import VnInput from 'vue-nice-input';
 */
withDefaults(
  defineProps<{
    modelValue: string | number | null;
    type?: string;
    label?: string;
    placeholder?: string;
    autocomplete?: string;
    error?: string | null;
    hint?: string;
    disabled?: boolean;
  }>(),
  { type: 'text', error: null, disabled: false }
);
defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
}>();
</script>

<style scoped>
.vn-field {
  display: flex;
  flex-direction: column;
  gap: var(--vn-space-1);
}
.vn-field__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--vn-color-text-muted);
}
.vn-field__input {
  padding: 8px 12px;
  border: 1px solid var(--vn-color-border);
  border-radius: var(--vn-radius-md);
  background: var(--vn-color-surface);
  color: var(--vn-color-text);
  font: inherit;
  outline: none;
  transition: border-color var(--vn-transition), box-shadow var(--vn-transition);
}
.vn-field__input:focus {
  border-color: var(--vn-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vn-color-primary) 25%, transparent);
}
.vn-field__input.has-error { border-color: var(--vn-color-danger); }
.vn-field__error { color: var(--vn-color-danger); font-size: 12px; }
.vn-field__hint  { color: var(--vn-color-text-muted); font-size: 12px; }
</style>
