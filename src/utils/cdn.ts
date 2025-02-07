import typescript from 'typescript';
import { devDependencies } from '../../package.json';
import { hasOwn } from '@/utils/check-type';

const JSDELIVR_CDN = 'https://cdn.jsdelivr.net/npm';
const HANDLE_SEPARATE_MAP = {
  '@component-hook/pdf-canvas/vue': `${JSDELIVR_CDN}/@component-hook/pdf-canvas/dist/vue/pdf-canvas.es.js`,
  '@component-hook/picker/vue': `${JSDELIVR_CDN}/@component-hook/picker@1.0.1-alpha.0/dist/vue/picker.es.js`,

  '@component-hook/pdf-canvas/react': `${JSDELIVR_CDN}/@component-hook/pdf-canvas/dist/react/pdf-canvas.es.js`,
  '@component-hook/picker/react': `${JSDELIVR_CDN}/@component-hook/picker@1.0.1-alpha.0/dist/react/picker.es.js`,
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
