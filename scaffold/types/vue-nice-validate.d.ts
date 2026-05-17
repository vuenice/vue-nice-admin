/**
 * Local type stub for `vue-nice-validate`. The published package ships
 * untyped TypeScript source, which makes strict `vue-tsc` runs noisy.
 * This stub overrides the package's own types (via `tsconfig.json#paths`)
 * with a minimal but accurate shape derived from the package source.
 *
 * Remove this file once `vue-nice-validate` ships proper `.d.ts` files,
 * along with the matching `paths` entry in tsconfig.json.
 */
import type { Plugin } from 'vue';

export interface ValidatePluginOptions {
  /**
   * Replace the default message formatter. Receives a key + params and
   * returns a localized string. Useful for i18n.
   */
  messageFormatter?: (key: string, params?: Record<string, unknown>) => string;
}

export const ValidatePlugin: Plugin<ValidatePluginOptions>;

export const useVueNiceValidate: () => {
  vValidate: unknown;
  [extra: string]: unknown;
};

declare const _default: { ValidatePlugin: typeof ValidatePlugin };
export default _default;
