/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
};

declare interface Window {
  Haml: any;
  showdown: any;
  pug: any;
  less: any;
  Sass: any;
  stylus: any;
  Babel: any;
  CoffeeScript: any;
  prettier: any;
  prettierPlugins: any;
}
