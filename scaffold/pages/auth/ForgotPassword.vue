<template>
  <form class="auth-form vn-stack" @submit.prevent="onSubmit" novalidate>
    <h2 style="margin:0">Reset password</h2>
    <p class="vn-muted" style="margin:0">
      Enter the email tied to your account and we'll send a reset link.
    </p>

    <VnAlert v-if="sent" variant="success">
      If that email exists, a reset link is on its way. Check your inbox.
    </VnAlert>
    <VnAlert v-if="error" variant="danger">{{ error }}</VnAlert>

    <VnInput
      v-model="email"
      label="Email"
      type="email"
      placeholder="you@example.com"
      autocomplete="email"
      :error="touched && !isValid ? 'Enter a valid email' : null"
      @blur="touched = true"
    />

    <VnButton type="submit" :loading="submitting" :disabled="!isValid">
      Send reset link
    </VnButton>

    <div class="vn-row" style="font-size:13px">
      <router-link :to="{ name: 'login' }">← Back to sign in</router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { VnButton, VnInput, VnAlert } from '../../components/fallbacks';
import { authApi } from '../../api/auth';

const email = ref('');
const touched = ref(false);
const submitting = ref(false);
const sent = ref(false);
const error = ref<string | null>(null);

const isValid = computed(() => /^\S+@\S+\.\S+$/.test(email.value));

async function onSubmit() {
  touched.value = true;
  if (!isValid.value) return;
  submitting.value = true;
  error.value = null;
  try {
    await authApi.forgotPassword(email.value);
    sent.value = true;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value =
        (err.response?.data as { message?: string } | undefined)?.message ||
        'Request failed. Try again later.';
    } else {
      error.value = 'Request failed. Try again later.';
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-form { gap: var(--vn-space-4); }
</style>
