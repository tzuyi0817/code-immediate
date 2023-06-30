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
      'solid-js/web': 'https://cdn.skypack.dev/solid-js/web',
      'solid-js/h': 'https://cdn.skypack.dev/solid-js/h',
      'solid-js/html': 'https://cdn.skypack.dev/solid-js/html',
    },
  },
} as const;

export const IMPORT_MAP_SOURCES = new Set([
  'solid-js',
  'solid-js/web',
  'solid-js/h',
  'solid-js/html',
]);
