# Mounting @vuenice/admin in AdonisJS

Tested against AdonisJS v6 with `@adonisjs/vite` and `@adonisjs/session` for cookie-session auth.

## 1. Install

```bash
npm install -D @vuenice/admin
node ace install @vuenice/admin  # if you've wrapped the CLI in a provider; otherwise:
npx vuenice-admin init           # writes inertia/app/admin/ or resources/js/admin/
cd resources/js/admin && npm install
```

## 2. `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import adonis from '@adonisjs/vite/client';
import vue from '@vitejs/plugin-vue';
import vuenice from '@vuenice/admin/plugin';

export default defineConfig({
  plugins: [
    adonis({
      entrypoints: ['resources/js/admin/main.ts'],
      reload: ['resources/views/**/*.edge'],
    }),
    vue(),
    vuenice({
      root: 'resources/js/admin',
      apiProxy: 'http://localhost:3333',
    }),
  ],
});
```

## 3. Edge template

`resources/views/admin.edge`:

```edge
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="csrf-token" content="{{ csrfToken }}">
  <title>Admin</title>
  @vite(['resources/js/admin/main.ts'])
</head>
<body><div id="vuenice-admin" data-base="/admin"></div></body>
</html>
```

(`csrfToken` comes from the Shield package's `csrfToken` global, if you have shield set up. Otherwise expose it from a controller view-state.)

## 4. Route

```ts
// start/routes.ts
import router from '@adonisjs/core/services/router';

router.get('/admin/*', async ({ view }) => view.render('admin'));
```

## 5. API endpoints (sketch)

```ts
// start/routes.ts
router.group(() => {
  router.post('/auth/login',           '#controllers/auth_controller.login');
  router.post('/auth/register',        '#controllers/auth_controller.register');
  router.post('/auth/logout',          '#controllers/auth_controller.logout');
  router.post('/auth/forgot-password', '#controllers/auth_controller.forgot');

  router.group(() => {
    router.get('/auth/me',     '#controllers/auth_controller.me');
    router.get('/menu',        '#controllers/admin_menu_controller.index');
    router.get('/llm/status',  '#controllers/llm_controller.status');
    router.post('/llm/chat',   '#controllers/llm_controller.chat');
  }).use(middleware.auth());
}).prefix('/api/admin');
```

## 6. LLM proxy (sketch)

```ts
// app/controllers/llm_controller.ts
import env from '#start/env';

export default class LlmController {
  status() {
    return {
      configured: Boolean(env.get('ANTHROPIC_API_KEY')),
      provider: 'anthropic',
      model: 'claude-sonnet-4-6',
    };
  }

  async chat({ request, response }: HttpContext) {
    const { messages, stream } = request.only(['messages', 'stream']);
    if (stream) {
      response.header('Content-Type', 'text/event-stream');
      response.header('Cache-Control', 'no-cache');
      response.header('X-Accel-Buffering', 'no');
      const writer = response.response;
      // for await (const chunk of yourSdkStream(messages)) {
      //   writer.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
      // }
      writer.write('data: [DONE]\n\n');
      writer.end();
      return;
    }
    // Non-streaming fallback
    // const reply = await yourSdkOneShot(messages);
    // return { reply: { role: 'assistant', content: reply } };
  }
}
```
