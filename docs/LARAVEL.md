# Mounting @vuenice/admin in Laravel

Tested against Laravel 11 with `laravel-vite-plugin` and Sanctum for session-cookie auth.

## 1. Install

```bash
npm install -D @vuenice/admin
npx vuenice-admin init                  # writes resources/js/admin/
cd resources/js/admin && npm install    # installs Vue, Vue Router, vue-nice-*
```

## 2. `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import vuenice from '@vuenice/admin/plugin';

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/js/admin/main.ts'], refresh: true }),
    vue(),
    vuenice({
      root: 'resources/js/admin',
      apiProxy: 'http://localhost:8000',
    }),
  ],
});
```

## 3. Blade template

`resources/views/admin.blade.php`:

```blade
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Admin</title>
  @vite(['resources/js/admin/main.ts'])
</head>
<body><div id="vuenice-admin" data-base="/admin"></div></body>
</html>
```

## 4. Route

```php
// routes/web.php
Route::get('/admin/{any?}', fn () => view('admin'))
    ->where('any', '.*')
    ->name('admin');
```

## 5. API endpoints (sketch)

```php
// routes/api.php
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::post('auth/login',           [Auth\LoginController::class, 'store']);
    Route::post('auth/register',        [Auth\RegisterController::class, 'store']);
    Route::post('auth/logout',          [Auth\LogoutController::class, 'store']);
    Route::post('auth/forgot-password', [Auth\ForgotPasswordController::class, 'store']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me',    fn () => ['user' => auth()->user()]);
        Route::get('menu',       [AdminMenuController::class, 'index']);
        Route::get('llm/status', [LlmController::class, 'status']);
        Route::post('llm/chat',  [LlmController::class, 'chat']);
    });
});
```

For session-cookie auth, make sure `config/sanctum.php` includes the SPA origin in `stateful` and your `EnsureFrontendRequestsAreStateful` middleware is on the API group.

## 6. LLM proxy (sketch)

```php
// app/Http/Controllers/LlmController.php
public function status() {
    return [
        'configured' => (bool) config('services.anthropic.key'),
        'provider'   => 'anthropic',
        'model'      => 'claude-sonnet-4-6',
    ];
}

public function chat(Request $req) {
    $messages = $req->validate(['messages' => 'array'])['messages'];
    // Stream via response()->stream() in chunks, formatted as SSE:
    //   echo "data: " . json_encode(['delta' => $chunk]) . "\n\n";
    //   ob_flush(); flush();
    // Finish with: echo "data: [DONE]\n\n";
}
```
