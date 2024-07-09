import typescript from 'typescript';
import { devDependencies } from '../../package.json';

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
