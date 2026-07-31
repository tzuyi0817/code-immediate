import { transformToJsdelivr } from '@/utils/cdn';

const JSDELIVR_CDN = 'https://cdn.jsdelivr.net/npm';

describe('transformToJsdelivr', () => {
  it('keeps the absolute source unchanged', () => {
    const source = 'https://cdn.jsdelivr.net/npm/lodash-es/+esm';

    expect(transformToJsdelivr(source)).toBe(source);
  });

  it('transforms the bare specifier to the jsdelivr esm endpoint', () => {
    expect(transformToJsdelivr('lodash-es')).toBe(`${JSDELIVR_CDN}/lodash-es/+esm`);
  });

  /**
   * @component-hook/pdf-canvas 1.5.0 起改用 Vite 8（Rolldown）打包，
   * react/jsx-runtime（僅有 CJS）被打包進 dist，其 require('react')
   * 被轉成 Rolldown 的 __require shim，在預覽 iframe 內執行即拋錯。
   * 上游修正並發版前，先釘在 Rollup 打包的 1.4.4。
   */
  it('pins the react bundle of @component-hook/pdf-canvas to a rollup built version', () => {
    expect(transformToJsdelivr('@component-hook/pdf-canvas/react')).toBe(
      `${JSDELIVR_CDN}/@component-hook/pdf-canvas@1.4.4/dist/react/pdf-canvas.es.js`,
    );
  });
});
