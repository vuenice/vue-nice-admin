<template>
  <form class="auth-form vn-stack" @submit.prevent="onSubmit" novalidate>
    <h2 style="margin:0">Sign in</h2>
    <p class="vn-muted" style="margin:0">Welcome back. Enter your credentials to continue.</p>

    <VnAlert v-if="error" variant="danger">{{ error }}</VnAlert>

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
      placeholder="••••••••"
      autocomplete="current-password"
      :error="errors.password"
      @blur="touch('password')"
    />

    <label class="vn-row" style="font-size:13px">
      <input type="checkbox" v-model="form.remember" />
      <span>Remember me</span>
    </label>

    <VnButton type="submit" :loading="submitting" :disabled="!isValid">
      Sign in
    </VnButton>

    <div class="auth-links vn-row">
      <router-link :to="{ name: 'forgot-password' }">Forgot password?</router-link>
      <span class="vn-spacer" />
      <router-link :to="{ name: 'register' }">Create account</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { VnButton, VnInput, VnAlert } from '../../components/fallbacks';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: '', password: '', remember: false });
const touched = reactive<Record<string, boolean>>({});
const submitting = ref(false);
const error = ref<string | null>(null);

function touch(field: string) { touched[field] = true; }

const errors = computed(() => ({
  email:
    touched.email && !form.email
      ? 'Email is required'
      : touched.email && !/^\S+@\S+\.\S+$/.test(form.email)
      ? 'Enter a valid email'
      : null,
  password:
    touched.password && !form.password ? 'Password is required' : null,
}));

const isValid = computed(
  () => /^\S+@\S+\.\S+$/.test(form.email) && form.password.length > 0
);

async function onSubmit() {
  touched.email = true;
  touched.password = true;
  if (!isValid.value) return;

  submitting.value = true;
  error.value = null;
  try {
    await auth.login(form.email, form.password, form.remember);
    const redirect = (route.query.redirect as string) || undefined;
    router.push(redirect || { name: 'dashboard' });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value =
        (err.response?.data as { message?: string } | undefined)?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password.'
          : 'Sign in failed. Please try again.');
    } else {
      error.value = 'Sign in failed. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-form { gap: var(--vn-space-4); }
.auth-links { font-size: 13px; }
</style>
