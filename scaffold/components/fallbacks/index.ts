/**
 * Central re-export of the fallback components. The rest of the scaffold
 * imports its UI primitives from here so swapping to the real VueNice
 * packages is a one-file change:
 *
 *   // After confirming the GitHub install resolved and renders:
 *   export { default as VnButton } from 'vue-nice-button';
 *   export { default as VnInput }  from 'vue-nice-input';
 *   // etc.
 */
export { default as VnButton } from './VnButton.vue';
export { default as VnInput } from './VnInput.vue';
export { default as VnAlert } from './VnAlert.vue';
export { default as VnSidebarMenu } from './VnSidebarMenu.vue';
export { default as VnHeader } from './VnHeader.vue';
