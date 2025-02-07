/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'monaco-editor/esm/vs/editor/editor.worker' {
  export function initialize(callback: (ctx: any, createData: any) => any): void;
}

declare module 'parse-package-name' {
  export function parse(name: string): { name: string; version: string; path: string };
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_URL: string;
  readonly VITE_CDN_API_URL: string;
}

declare interface Window {
  Haml: any;
  showdown: any;
  pug: any;
  less: any;
  Sass: {
    new (): any;
  };
  stylus: any;
  Babel: any;
  CoffeeScript: any;
  prettier: any;
  prettierPlugins: any;
}
