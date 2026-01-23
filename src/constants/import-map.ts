import { VERSION } from './template';

export const IMPORT_MAP = {
  ES6: null,
  Vue: {
    imports: { vue: `./lib/vue@${VERSION.VUE}.esm-browser.js` },
  },
  VueSFC: {
    imports: {
      vue: `./lib/vue@${VERSION.VUE}.esm-browser.js`,
    },
  },
  React: {
    imports: {
      react: `./lib/react/react@${VERSION.REACT}.js`,
      'react-dom': `./lib/react/react-dom@${VERSION.REACT}.js`,
      'react-dom/client': `./lib/react/react-dom@${VERSION.REACT}.client.js`,
    },
  },
  Angular: null,
  SolidJs: {
    imports: {
      'solid-js': `./lib/solid-js@${VERSION.SOLID_JS}/solid-js.mjs`,
      'solid-js/web': `./lib/solid-js@${VERSION.SOLID_JS}/web.mjs`,
      'solid-js/h': `./lib/solid-js@${VERSION.SOLID_JS}/h.mjs`,
      'solid-js/html': `./lib/solid-js@${VERSION.SOLID_JS}/html.mjs`,
    },
  },
  RxJS: {
    imports: {
      rxjs: `./lib/rxjs@${VERSION.RXJS}.js`,
      'rxjs/operators': `./lib/rxjs@${VERSION.RXJS}.operators.js`,
    },
  },
} as const;

export const IMPORT_MAP_BUILD_IN_SOURCES = new Set([
  'vue',
  'react',
  'react-dom',
  'react-dom/client',
  'solid-js',
  'solid-js/web',
  'solid-js/h',
  'solid-js/html',
  'rxjs',
  'rxjs/operators',
]);
