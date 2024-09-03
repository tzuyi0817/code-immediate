export default {
  '*.{ts,vue}': () => 'pnpm type-check',
  '*.{ts,js,vue}': ['pnpm lint'],
};
