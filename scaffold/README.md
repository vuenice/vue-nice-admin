# Your admin SPA

This directory was scaffolded by `@vuenice/admin`. Every file here is **yours** — edit freely.

## Where to make changes

| Want to…                                  | Edit                                              |
|-------------------------------------------|---------------------------------------------------|
| Add a page                                | `pages/` + `router/routes.ts`                     |
| Add a menu entry                          | `config/menu.ts`                                  |
| Re-skin colors / spacing                  | `styles/tokens.css`                               |
| Swap a fallback for a real VueNice comp.  | `components/fallbacks/index.ts`                   |
| Change the API base or auth shape         | `api/*.ts`                                        |
| Add a route guard                         | `router/index.ts`                                 |
| Change layout structure                   | `layouts/AdminLayout.vue`                         |
| Re-style the AI chat panel                | `components/AiChatPanel.vue`                      |

## Replacing fallback components

The scaffold ships local fallbacks for the five components needed to render the shell:

- `VnButton`, `VnInput`, `VnAlert`, `VnSidebarMenu`, `VnHeader`

Once you've confirmed the corresponding `github:vuenice/*` install actually builds and renders in your project, swap the import in `components/fallbacks/index.ts`:

```ts
// Before:
export { default as VnButton } from './VnButton.vue';

// After:
export { default as VnButton } from 'vue-nice-button';
```

The rest of the scaffold imports from `./fallbacks`, so this one change cascades.

## Adding more VueNice components

All 49 packages are pre-declared in `package.json`. To use one in a page:

```vue
<script setup lang="ts">
import VnTable from 'vue-nice-table';
import VnPagination from 'vue-nice-pagination';
</script>
```

If a GitHub install fails (e.g. the repo has no `dist/`), just remove that entry from `package.json` — the scaffold keeps booting because nothing here imports it yet.
