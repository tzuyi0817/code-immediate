import typescript from 'typescript';
import { devDependencies } from '../../package.json';

export async function importTsFromCdn(version = devDependencies.typescript.replace('^', '')) {
  const _module = globalThis.module;
  const cdnUrl = `https://cdn.jsdelivr.net/npm/typescript@${version}/lib/typescript.js`;

  globalThis.module = { exports: {} } as NodeModule;
  await import(/* @vite-ignore */ cdnUrl);

  const tsModule = globalThis.module.exports;
  globalThis.module = _module;
  return tsModule as typeof typescript;
}
