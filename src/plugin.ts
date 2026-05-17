import type { Plugin, UserConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface VueniceAdminOptions {
  /**
   * Path (relative to vite root, i.e. the host project root) where the
   * scaffolded SPA lives. Defaults to `resources/js/admin`.
   */
  root?: string;

  /**
   * Public base path the admin SPA is served under. Maps to vite `base`.
   * Use this when your backend route is e.g. `/admin` and you want
   * built asset URLs to be `/admin/assets/...`.
   *
   * Most users will not need this — Laravel/Adonis Vite plugins set base
   * automatically. Leave undefined to inherit.
   */
  base?: string;

  /**
   * Dev-server target for `/api/admin/*` requests. When set, the Vite
   * dev server will proxy those requests to this URL so the SPA can
   * call backend endpoints during `npm run dev` without CORS hassle.
   *
   * Example: 'http://localhost:8000' (Laravel) or 'http://localhost:3333' (Adonis).
   */
  apiProxy?: string;

  /**
   * DOM id the SPA mounts into. Must match the `<div id="...">` in your
   * blade/edge template. Defaults to `vuenice-admin`.
   */
  mountId?: string;

  /**
   * Map import-aliases for VueNice components. Set to false to disable.
   * By default, `@vuenice/*` imports resolve to `vue-nice-*` packages,
   * letting you write `import VnButton from '@vuenice/button'` regardless
   * of whether the underlying package is named `vue-nice-button` or
   * just `button`.
   */
  aliases?: boolean | Record<string, string>;
}

const PLUGIN_NAME = 'vuenice-admin';

const DEFAULT_ALIAS_MAP: Record<string, string> = {
  // Special-cased repos whose npm/dir name differs from the `vue-nice-*` pattern.
  '@vuenice/input': 'vue-nice-input',
  '@vuenice/button': 'vue-nice-button',
  '@vuenice/admin-stubs': '@vuenice/admin/scaffold/components/fallbacks',
};

/**
 * Vite plugin for hosting the @vuenice/admin SPA inside any backend
 * project that already uses Vite (Laravel via laravel-vite-plugin,
 * AdonisJS via @adonisjs/vite, or anything else).
 *
 * It does NOT replace those plugins — it composes with them, adding
 * sensible defaults, a dev proxy for `/api/admin/*`, and import
 * aliases so VueNice components can be referenced consistently.
 */
export function vueniceAdmin(options: VueniceAdminOptions = {}): Plugin {
  const {
    root = 'resources/js/admin',
    base,
    apiProxy,
    mountId = 'vuenice-admin',
    aliases = true,
  } = options;

  let resolvedHostRoot = '';

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',

    config(userConfig: UserConfig) {
      resolvedHostRoot = path.resolve(userConfig.root || process.cwd());
      const adminRoot = path.resolve(resolvedHostRoot, root);

      const aliasMap: Record<string, string> =
        aliases === false
          ? {}
          : typeof aliases === 'object'
          ? { ...DEFAULT_ALIAS_MAP, ...aliases }
          : { ...DEFAULT_ALIAS_MAP };

      // Always expose `@admin/*` → the scaffold root, so app code can do
      //   import router from '@admin/router'
      // regardless of where the host placed the SPA.
      aliasMap['@admin'] = adminRoot;

      const next: UserConfig = {
        ...(base !== undefined ? { base } : {}),
        resolve: {
          alias: {
            ...(userConfig.resolve?.alias as Record<string, string> | undefined),
            ...aliasMap,
          },
        },
        define: {
          ...userConfig.define,
          __VUENICE_ADMIN_MOUNT__: JSON.stringify(mountId),
          __VUENICE_ADMIN_ROOT__: JSON.stringify(root),
        },
        server: {
          ...userConfig.server,
          ...(apiProxy
            ? {
                proxy: {
                  ...(userConfig.server?.proxy as Record<string, unknown> | undefined),
                  '/api/admin': {
                    target: apiProxy,
                    changeOrigin: true,
                    secure: false,
                  },
                  '/sanctum': {
                    target: apiProxy,
                    changeOrigin: true,
                    secure: false,
                  },
                },
              }
            : {}),
        },
      };

      return next;
    },

    configResolved(config) {
      // Friendly boot log so it's obvious the plugin is wired up.
      const adminRoot = path.relative(
        config.root,
        path.resolve(config.root, root)
      );
      config.logger.info(
        `\n  ${pluginLabel()} root: ${adminRoot || '.'}` +
          (apiProxy ? `\n  ${pluginLabel()} proxy /api/admin → ${apiProxy}` : '') +
          `\n  ${pluginLabel()} mount: #${mountId}\n`
      );
    },
  };
}

function pluginLabel(): string {
  return `[vuenice-admin]`;
}

// Helpful for the CLI to find the scaffold directory shipped inside this package.
export const SCAFFOLD_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'scaffold'
);
