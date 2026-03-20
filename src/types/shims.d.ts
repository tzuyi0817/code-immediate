declare module 'parse-package-name' {
  export interface PackageInfo {
    name: string;
    version: string;
    path: string;
  }

  export function parse(name: string): PackageInfo;
}

declare module 'monaco-editor/esm/vs/editor/editor.worker' {
  export function initialize(callback: (ctx: any, createData: any) => any): void;
}
