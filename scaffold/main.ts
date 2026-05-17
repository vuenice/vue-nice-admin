/**
 * Admin SPA entry. Mounted into `<div id="vuenice-admin"></div>` by your
 * blade/edge template. The mount id can be overridden via the
 * @vuenice/admin Vite plugin `mountId` option.
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { router } from './router';
import { useAuthStore } from './stores/auth';

import './styles/main.css';

// vue-nice-validate exposes a Vue plugin (`ValidatePlugin`). It expects an
// options object even if empty; pass `{}` to use defaults. Once installed it
// powers <input v-validate="..."> inside the auth pages and any form you build.
import { ValidatePlugin } from 'vue-nice-validate';

async function bootstrap() {
  const mountId =
    typeof __VUENICE_ADMIN_MOUNT__ !== 'undefined'
      ? __VUENICE_ADMIN_MOUNT__
      : 'vuenice-admin';

  const el = document.getElementById(mountId);
  if (!el) {
    // eslint-disable-next-line no-console
    console.error(
      `[vuenice-admin] Mount element #${mountId} not found. ` +
        `Add <div id="${mountId}"></div> to your blade/edge template.`
    );
    return;
  }

  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.use(ValidatePlugin, {});

  // Hydrate the current user from the session cookie before the first
  // route resolves, so route guards have a definitive answer.
  const auth = useAuthStore();
  await auth.fetchMe().catch(() => undefined);

  await router.isReady();
  app.mount(el);
}

bootstrap();
