export const IMPORT_MAP = {
  ES6: null,
  Vue: null,
  VueSFC: {
    imports: { vue: './lib/vue@3.3.4.esm-browser.js' },
  },
  React: null,
  Angular: null,
  SolidJs: {
    imports: { 
      'solid-js': 'https://cdn.skypack.dev/solid-js',
      'solid-js/': 'https://cdn.skypack.dev/solid-js/',
    },
  },
} as const;

export const IMPORT_MAP_BUILD_IN_SOURCES = new Set([
  'solid-js',
  'solid-js/web',
  'solid-js/h',
  'solid-js/html',
]);
