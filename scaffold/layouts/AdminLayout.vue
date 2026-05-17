<template>
  <div class="admin-shell" :class="{ 'sidebar-collapsed': menu.collapsed, 'chat-open': chat.open }">
    <aside class="admin-shell__sidebar">
      <LeftSidebar />
    </aside>

    <div class="admin-shell__main">
      <TopBar />
      <main class="admin-shell__content vn-scroll">
        <slot />
      </main>
    </div>

    <aside class="admin-shell__chat" v-show="chat.open">
      <RightSidebar />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import LeftSidebar from '../components/LeftSidebar.vue';
import RightSidebar from '../components/RightSidebar.vue';
import TopBar from '../components/TopBar.vue';
import { useMenuStore } from '../stores/menu';
import { useChatStore } from '../stores/chat';

const menu = useMenuStore();
const chat = useChatStore();

onMounted(() => {
  // Best-effort enrichment — falls back silently to config/menu.ts.
  menu.loadFromBackend();
  chat.refreshStatus();
});
</script>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: var(--vn-sidebar-width) 1fr 0px;
  height: 100vh;
  background: var(--vn-color-bg);
  transition: grid-template-columns var(--vn-transition);
}
.admin-shell.sidebar-collapsed {
  grid-template-columns: var(--vn-sidebar-width-collapsed) 1fr 0px;
}
.admin-shell.chat-open {
  grid-template-columns: var(--vn-sidebar-width) 1fr var(--vn-ai-width);
}
.admin-shell.sidebar-collapsed.chat-open {
  grid-template-columns: var(--vn-sidebar-width-collapsed) 1fr var(--vn-ai-width);
}

.admin-shell__sidebar {
  background: var(--vn-sidebar-bg);
  color: var(--vn-sidebar-text);
  border-right: 1px solid var(--vn-color-border);
  overflow: hidden;
}

.admin-shell__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-shell__content {
  flex: 1 1 auto;
  padding: var(--vn-space-5);
}

.admin-shell__chat {
  background: var(--vn-ai-bg);
  border-left: 1px solid var(--vn-ai-border);
  overflow: hidden;
}

@media (max-width: 960px) {
  .admin-shell,
  .admin-shell.chat-open {
    grid-template-columns: var(--vn-sidebar-width-collapsed) 1fr 0px;
  }
  .admin-shell.chat-open .admin-shell__chat {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(420px, 100vw);
    z-index: 50;
    box-shadow: var(--vn-shadow-md);
  }
}
</style>
