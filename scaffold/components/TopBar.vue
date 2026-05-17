<template>
  <VnHeader :title="title">
    <template #end>
      <VnButton variant="ghost" size="sm" @click="chat.toggleOpen()">
        <span aria-hidden="true">✨</span>
        {{ chat.open ? 'Close AI' : 'Ask AI' }}
      </VnButton>

      <div class="topbar__user vn-row" v-if="auth.user">
        <span class="vn-muted">{{ auth.user.name }}</span>
        <VnButton variant="secondary" size="sm" @click="onLogout">Sign out</VnButton>
      </div>
    </template>
  </VnHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { VnHeader, VnButton } from './fallbacks';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const chat = useChatStore();

const title = computed(
  () => (route.meta?.title as string | undefined) || 'Admin'
);

async function onLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<style scoped>
.topbar__user { margin-left: var(--vn-space-3); }
</style>
