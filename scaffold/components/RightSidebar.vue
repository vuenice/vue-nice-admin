<template>
  <AiChatPanel />
</template>

<script setup lang="ts">
/**
 * Right sidebar host. Currently houses the AI chat panel only, but kept
 * as its own component so you can add tabs (notifications, activity,
 * help) without touching AdminLayout.
 */
import AiChatPanel from './AiChatPanel.vue';
</script>
