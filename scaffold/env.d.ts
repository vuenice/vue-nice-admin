/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Constants injected by the @vuenice/admin Vite plugin via `define`.
declare const __VUENICE_ADMIN_MOUNT__: string;
declare const __VUENICE_ADMIN_ROOT__: string;

// VueNice packages don't all ship .d.ts files; declare them as any so
// TS doesn't complain when you import them. As real types land, remove
// the corresponding declarations here.
// (Note: `vue-nice-validate` has a proper local stub at types/vue-nice-validate.d.ts,
//  wired via tsconfig.json#paths — not declared here.)
declare module 'vue-nice-input';
declare module 'vue-nice-button';
declare module 'vue-nice-alert';
declare module 'vue-nice-modal';
declare module 'vue-nice-tabs';
declare module 'vue-nice-table';
declare module 'vue-nice-table-skeleton';
declare module 'vue-nice-menu';
declare module 'vue-nice-sidebar';
declare module 'vue-nice-sidebar-menu';
declare module 'vue-nice-header';
declare module 'vue-nice-breadcrumb';
declare module 'vue-nice-pagination';
declare module 'vue-nice-loader';
declare module 'vue-nice-icon';
declare module 'vue-nice-icon-button';
declare module 'vue-nice-progress';
declare module 'vue-nice-progress-bar';
declare module 'vue-nice-progress-circle';
declare module 'vue-nice-checkbox';
declare module 'vue-nice-checkbox-button';
declare module 'vue-nice-radio';
declare module 'vue-nice-switch';
declare module 'vue-nice-popover';
declare module 'vue-nice-tag';
declare module 'vue-nice-multi-tag-input';
declare module 'vue-nice-autocomplete';
declare module 'vue-nice-listbox';
declare module 'vue-nice-slider';
declare module 'vue-nice-avatar';
declare module 'vue-nice-account-dropdown';
declare module 'vue-nice-action-dropdown';
declare module 'vue-nice-action-button-group';
declare module 'vue-nice-dialog';
declare module 'vue-nice-confirmation-modal';
declare module 'vue-nice-split-modal';
declare module 'vue-nice-form-section';
declare module 'vue-nice-accordion';
declare module 'vue-nice-copy-button';
declare module 'vue-nice-debug';
declare module 'vue-nice-logo-upload';
declare module 'vue-multi-step-form';
