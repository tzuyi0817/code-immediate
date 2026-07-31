import { hasOwn } from '@/utils/check-type';
import { devDependencies } from '../../../package.json';
import type typescript from 'typescript';

const JSDELIVR_CDN = 'https://cdn.jsdelivr.net/npm';
const HANDLE_SEPARATE_MAP = {
  '@component-hook/pdf-canvas/vue': `${JSDELIVR_CDN}/@component-hook/pdf-canvas/dist/vue/pdf-canvas.es.js`,
  '@component-hook/picker/vue': `${JSDELIVR_CDN}/@component-hook/picker@1.2.1-alpha.0/dist/vue/picker.es.js`,

  /**
   * @component-hook/pdf-canvas 1.5.0 改用 Vite 8（Rolldown）打包後，
   * 只有 CJS 版本的 react/jsx-runtime 被打包進 dist，
   * 其 require('react') 被轉成 Rolldown 的 __require shim，在預覽 iframe 內執行即拋錯。
   * 上游修正 external 設定並重新發版前，先釘在 Rollup 打包的 1.4.4。
   */
  '@component-hook/pdf-canvas/react': `${JSDELIVR_CDN}/@component-hook/pdf-canvas@1.4.4/dist/react/pdf-canvas.es.js`,
  '@component-hook/picker/react': `${JSDELIVR_CDN}/@component-hook/picker@1.2.1-alpha.0/dist/react/picker.es.js`,
} as const;

let ts: typeof typescript;

async function importTsFromCdn(version = devDependencies.typescript.replace('^', '')) {
  const _module = globalThis.module;
  const cdnUrl = `${JSDELIVR_CDN}/typescript@${version}/lib/typescript.js`;

  globalThis.module = { exports: {} } as NodeModule;
  await import(/* @vite-ignore */ cdnUrl);

  const tsModule = globalThis.module.exports;

  globalThis.module = _module;

  return tsModule as typeof typescript;
}

export async function getTsConstructor() {
  if (ts) return ts;
  ts = await importTsFromCdn();

  return ts;
}

export function transformToJsdelivr(source: string) {
  if (source.startsWith('https://')) return source;
  if (hasOwn(HANDLE_SEPARATE_MAP, source)) return HANDLE_SEPARATE_MAP[source];

  return `${JSDELIVR_CDN}/${source}/+esm`;
}

export function transformToEsbuild(source: string, version: string, path: string, moduleName: string) {
  if (source.startsWith('https://')) return source;

  return `https://esbuild.vercel.app/${source}@${version}${path}?format=iife&globalName=${moduleName}`;
}
