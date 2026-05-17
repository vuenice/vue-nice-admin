<template>
  <section class="nf vn-card">
    <h2>404 — page not found</h2>
    <p class="vn-muted">No route matches <code>{{ route.fullPath }}</code>.</p>
    <router-link :to="{ name: 'dashboard' }">← Back to dashboard</router-link>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style scoped>
.nf { max-width: 480px; margin: 80px auto; text-align: center; }
code { font-family: var(--vn-font-mono); font-size: 12px; }
</style>
