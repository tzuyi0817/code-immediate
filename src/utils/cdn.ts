import typescript from 'typescript';
import { devDependencies } from '../../package.json';
import { hasOwn } from '@/utils/checkType';

const HANDLE_SEPARATE_MAP = {
  '@component-hook/pdf-canvas': 'https://cdn.jsdelivr.net/npm/@component-hook/pdf-canvas/dist/pdf-canvas.es.js',
  '@component-hook/picker': 'https://cdn.jsdelivr.net/npm/@component-hook/picker@0.1.2-alpha.1/dist/picker.es.js',
} as const;

let ts: typeof typescript;

async function importTsFromCdn(version = devDependencies.typescript.replace('^', '')) {
  const _module = globalThis.module;
  const cdnUrl = `https://cdn.jsdelivr.net/npm/typescript@${version}/lib/typescript.js`;

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

  return `https://cdn.jsdelivr.net/npm/${source}/+esm`;
}

export function transformToEsbuild(source: string, version: string, path: string, moduleName: string) {
  if (source.startsWith('https://')) return source;

  return `https://esbuild.vercel.app/${source}@${version}${path}?format=iife&globalName=${moduleName}`;
}
