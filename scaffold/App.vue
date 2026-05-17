<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from './layouts/AdminLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();

// A route can opt into the auth layout with `meta: { layout: 'auth' }`.
const layoutComponent = computed(() =>
  route.meta?.layout === 'auth' ? AuthLayout : AdminLayout
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
