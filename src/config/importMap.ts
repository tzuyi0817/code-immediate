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
  RxJS: {
    imports: {
      rxjs: 'https://unpkg.com/@esm-bundle/rxjs/esm/es2015/rxjs.min.js',
      'rxjs/operators': 'https://unpkg.com/@esm-bundle/rxjs/esm/es2015/rxjs-operators.min.js',
    },
  },
} as const;

export const IMPORT_MAP_BUILD_IN_SOURCES = new Set([
  'solid-js',
  'solid-js/web',
  'solid-js/h',
  'solid-js/html',
  'rxjs',
  'rxjs/operators',
]);
