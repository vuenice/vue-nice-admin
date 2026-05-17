<template>
  <form class="auth-form vn-stack" @submit.prevent="onSubmit" novalidate>
    <h2 style="margin:0">Create account</h2>
    <p class="vn-muted" style="margin:0">Set up your admin account to get started.</p>

    <VnAlert v-if="error" variant="danger">{{ error }}</VnAlert>

    <VnInput
      v-model="form.name"
      label="Name"
      placeholder="Jane Doe"
      autocomplete="name"
      :error="errors.name"
      @blur="touch('name')"
    />
    <VnInput
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="you@example.com"
      autocomplete="email"
      :error="errors.email"
      @blur="touch('email')"
    />
    <VnInput
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="At least 8 characters"
      autocomplete="new-password"
      hint="Minimum 8 characters."
      :error="errors.password"
      @blur="touch('password')"
    />
    <VnInput
      v-model="form.confirm"
      label="Confirm password"
      type="password"
      autocomplete="new-password"
      :error="errors.confirm"
      @blur="touch('confirm')"
    />

    <VnButton type="submit" :loading="submitting" :disabled="!isValid">
      Create account
    </VnButton>

    <div class="vn-row" style="font-size:13px">
      <span class="vn-muted">Already have an account?</span>
      <router-link :to="{ name: 'login' }">Sign in</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { VnButton, VnInput, VnAlert } from '../../components/fallbacks';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({ name: '', email: '', password: '', confirm: '' });
const touched = reactive<Record<string, boolean>>({});
const submitting = ref(false);
const error = ref<string | null>(null);

function touch(field: string) { touched[field] = true; }

const errors = computed(() => ({
  name: touched.name && form.name.trim().length < 2 ? 'Name is required' : null,
  email:
    touched.email && !/^\S+@\S+\.\S+$/.test(form.email)
      ? 'Enter a valid email'
      : null,
  password:
    touched.password && form.password.length < 8
      ? 'Use at least 8 characters'
      : null,
  confirm:
    touched.confirm && form.confirm !== form.password
      ? 'Passwords do not match'
      : null,
}));

const isValid = computed(
  () =>
    form.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password.length >= 8 &&
    form.confirm === form.password
);

async function onSubmit() {
  Object.assign(touched, { name: true, email: true, password: true, confirm: true });
  if (!isValid.value) return;
  submitting.value = true;
  error.value = null;
  try {
    await auth.register(form.name, form.email, form.password);
    router.push({ name: 'dashboard' });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
      const firstFieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;
      error.value = firstFieldError || data?.message || 'Registration failed. Please try again.';
    } else {
      error.value = 'Registration failed. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-form { gap: var(--vn-space-4); }
</style>
