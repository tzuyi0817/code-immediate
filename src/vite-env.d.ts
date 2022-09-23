/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
};

declare module 'loadjs';

declare interface Window {
  pug: any;
  less: any;
  Sass: any;
  stylus: any;
  postcss: any;
  Babel: any;
  ts: any;
  CoffeeScript: any;
}
