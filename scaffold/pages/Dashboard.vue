<template>
  <section class="vn-stack">
    <header>
      <h2>Welcome{{ name ? `, ${name}` : '' }}</h2>
      <p class="vn-muted">
        This is the starting point of your admin panel. Drop new pages
        into <code>pages/</code> and register them in
        <code>router/routes.ts</code>; add menu entries in
        <code>config/menu.ts</code>.
      </p>
    </header>

    <div class="dash-grid">
      <article class="vn-card">
        <h3>Compose with VueNice</h3>
        <p class="vn-muted">
          All component imports use the <code>vue-nice-*</code> packages
          from the <a href="https://github.com/vuenice" target="_blank" rel="noreferrer">vuenice</a> GitHub org.
          Out of the box the scaffold ships fallback components for the
          handful needed to render the shell; replace the imports in
          <code>components/fallbacks/index.ts</code> as each real package lands.
        </p>
        <div class="vn-row" style="margin-top: var(--vn-space-3)">
          <VnButton @click="chat.setOpen(true)">Open AI chat</VnButton>
          <VnButton variant="secondary" @click="bumpDemo">Demo state ({{ counter }})</VnButton>
        </div>
      </article>

      <article class="vn-card">
        <h3>Backend status</h3>
        <ul class="vn-stack" style="padding-left: 18px; gap: 4px">
          <li><strong>Auth:</strong> {{ auth.isAuthenticated ? 'signed in' : 'guest' }}</li>
          <li><strong>LLM:</strong> {{ chat.status?.configured ? `${chat.status.provider} (${chat.status.model || 'default'})` : 'not configured' }}</li>
          <li><strong>Menu items:</strong> {{ menu.items.length }}</li>
        </ul>
      </article>

      <article class="vn-card">
        <h3>Next steps</h3>
        <ol class="vn-stack" style="padding-left: 18px; gap: 4px">
          <li>Edit <code>config/menu.ts</code> to declare your sections.</li>
          <li>Wire the backend endpoints in <code>BACKEND_CONTRACT.md</code>.</li>
          <li>Style by overriding tokens in <code>styles/tokens.css</code>.</li>
        </ol>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VnButton } from '../components/fallbacks';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { useMenuStore } from '../stores/menu';

const auth = useAuthStore();
const chat = useChatStore();
const menu = useMenuStore();

const name = computed(() => auth.user?.name || '');
const counter = ref(0);
function bumpDemo() { counter.value++; }
</script>

<style scoped>
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--vn-space-4);
}
code {
  font-family: var(--vn-font-mono);
  background: var(--vn-color-surface-2);
  padding: 1px 6px;
  border-radius: var(--vn-radius-sm);
  font-size: 12px;
}
</style>
