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

let tsPromise: Promise<typeof typescript> | undefined;

/**
 * CDN 上的 typescript.js 是 UMD bundle，會往 `module.exports` 掛載。
 * 這裡臨時偽造一個全域 `module` 讓它有地方可寫，並以 try/finally 保證還原，
 * 避免載入失敗時把假的 `module` 永久留在全域。
 */
async function withCommonJsModule<T>(load: () => Promise<void>) {
  // eslint-disable-next-line unicorn/no-unnecessary-global-this -- 需明確操作全域的 module，不能寫成裸識別字
  const originalModule = globalThis.module;

  Reflect.set(globalThis, 'module', { exports: {} });

  try {
    await load();

    // eslint-disable-next-line unicorn/no-unnecessary-global-this -- 同上
    return globalThis.module.exports as T;
  } finally {
    Reflect.set(globalThis, 'module', originalModule);
  }
}

async function importTsFromCdn(version = devDependencies.typescript.replace('^', '')) {
  const cdnUrl = `${JSDELIVR_CDN}/typescript@${version}/lib/typescript.js`;

  try {
    return await withCommonJsModule<typeof typescript>(async () => {
      await import(/* @vite-ignore */ cdnUrl);
    });
  } catch (error) {
    // 載入失敗時清掉快取，維持原本「失敗後下次呼叫可重試」的行為
    tsPromise = undefined;

    throw error;
  }
}

/**
 * 快取的是 promise 而非結果：main.ts 開場就先預取，compile 時可能在載入尚未完成時再次呼叫。
 * 若只快取結果，兩次呼叫會同時進入 withCommonJsModule，
 * 後進者的 finally 會先還原全域 module，讓先進者讀到 undefined 或空的 exports。
 */
export function getTsConstructor() {
  tsPromise ??= importTsFromCdn();

  return tsPromise;
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
