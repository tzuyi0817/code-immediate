/** @type {import('lint-staged').Configuration} */

export default {
  '*.{ts,vue}': () => 'pnpm typecheck',
  '*.{ts,js,vue,yml,json}': () => 'pnpm lint',
};
