# Backend contract

The `@vuenice/admin` SPA is framework-agnostic. It talks to your backend exclusively over these endpoints, using a **session cookie** for auth (set on login by your backend) and a **CSRF token** read from either the `XSRF-TOKEN` cookie (Laravel default) or the `<meta name="csrf-token">` tag (Adonis default).

All endpoints are scoped under `/api/admin/`. Adjust the path globally by editing `scaffold/api/*.ts` if you need a different prefix.

## Auth

### `GET /api/admin/auth/me`

Returns the current user. Used on app boot and after sign-in to hydrate the auth store.

**200 OK**
```json
{ "user": { "id": 1, "name": "Yogesh", "email": "y@example.com", "avatar_url": null } }
```

**401 Unauthorized** — anonymous; SPA stays on `/login`.

### `POST /api/admin/auth/login`

```json
{ "email": "y@example.com", "password": "secret", "remember": true }
```

**200 OK** — set the session cookie on this response.
```json
{ "user": { "id": 1, "name": "Yogesh", "email": "y@example.com" } }
```

**401/422** — return `{ "message": "Invalid credentials." }` or a Laravel-style validation envelope `{ "message": "...", "errors": { "email": ["..."] } }`.

### `POST /api/admin/auth/register`

```json
{ "name": "Jane", "email": "jane@example.com", "password": "longenough" }
```

**200/201** — same envelope as login (and sign the user in if appropriate).

### `POST /api/admin/auth/logout`

Invalidate the session. Return `204 No Content`.

### `POST /api/admin/auth/forgot-password`

```json
{ "email": "y@example.com" }
```

Always return `204 No Content` regardless of whether the email exists (to avoid account enumeration).

## Menu (optional)

### `GET /api/admin/menu`

If implemented, the SPA replaces its local `config/menu.ts` with whatever you return. Useful for per-role filtering.

**200 OK**
```json
{
  "items": [
    { "id": "dashboard", "label": "Dashboard", "icon": "layout-dashboard", "routeName": "dashboard" },
    {
      "id": "users",
      "label": "Users",
      "icon": "users",
      "children": [
        { "id": "users.list",  "label": "All users", "routeName": "users-list" },
        { "id": "users.roles", "label": "Roles",     "routeName": "users-roles", "badge": 3 }
      ]
    }
  ]
}
```

If you don't implement this endpoint (or it 404s), the SPA silently falls back to `config/menu.ts`.

## LLM

### `GET /api/admin/llm/status`

Tells the chat panel whether to render the input or the "not configured" empty state.

**200 OK**
```json
{ "configured": true, "provider": "anthropic", "model": "claude-sonnet-4-6" }
```

When unconfigured:
```json
{ "configured": false, "hint": "Add ANTHROPIC_API_KEY to .env and restart." }
```

### `POST /api/admin/llm/chat`

Two modes — same path. The SPA prefers SSE when streaming is available.

**Non-streaming** (`Accept: application/json`):

Request:
```json
{ "messages": [ { "role": "user", "content": "Summarize this admin panel." } ] }
```

Response:
```json
{ "reply": { "role": "assistant", "content": "This admin panel uses ..." } }
```

**Streaming** (`Accept: text/event-stream`, body includes `"stream": true`):

The endpoint must write `text/event-stream` frames:

```
data: {"delta":"This "}

data: {"delta":"admin panel "}

data: {"delta":"uses ..."}

data: [DONE]
```

The SPA reads `data:` lines, parses each JSON payload, and appends `delta` to the in-flight assistant message until it sees `[DONE]`. Cancellation is delivered via the request being aborted from the client side.

> Keep the LLM API key on the server. The SPA never sees it.

## CSRF

For state-changing requests (POST/PUT/PATCH/DELETE), the SPA sends both headers if it can find a token:

- `X-XSRF-TOKEN` — value of the `XSRF-TOKEN` cookie (Laravel/Sanctum)
- `X-CSRF-Token` — value of `<meta name="csrf-token">` (Adonis default)

Your framework only needs to accept one of them; the other is harmless.

## Cookies & CORS

The SPA always sends `credentials: 'include'`. If the SPA and the backend share an origin (typical when served from the same Laravel/Adonis app), no CORS config is needed. If they're on separate origins during development, set the dev proxy via `vuenice({ apiProxy: 'http://localhost:8000' })` so the browser still sees a same-origin request.
