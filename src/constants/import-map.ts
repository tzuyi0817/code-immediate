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
      react: `./lib/react@${VERSION.REACT}.js`,
      'react-dom': `./lib/react-dom@${VERSION.REACT}.js`,
      'react-dom/client': `./lib/react-dom@${VERSION.REACT}.client.js`,
    },
  },
  Angular: null,
  SolidJs: {
    imports: {
      'solid-js': 'https://cdn.skypack.dev/solid-js',
      'solid-js/': 'https://cdn.skypack.dev/solid-js/',
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
