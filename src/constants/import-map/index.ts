import { VERSION } from '../template';

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
      react: `./lib/react@${VERSION.REACT}/react.mjs`,
      // 供以 automatic jsx runtime 打包、且將 react 全系列列為 external 的第三方套件解析
      'react/jsx-runtime': `./lib/react@${VERSION.REACT}/jsx-runtime.mjs`,
      'react-dom': `./lib/react@${VERSION.REACT}/react-dom.mjs`,
      'react-dom/client': `./lib/react@${VERSION.REACT}/client.mjs`,
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
      rxjs: `./lib/rxjs@${VERSION.RXJS}/rxjs.js`,
      'rxjs/operators': `./lib/rxjs@${VERSION.RXJS}/operators.js`,
    },
  },
} as const;

export const IMPORT_MAP_BUILD_IN_SOURCES = new Set([
  'vue',
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'solid-js',
  'solid-js/web',
  'solid-js/h',
  'solid-js/html',
  'rxjs',
  'rxjs/operators',
]);
