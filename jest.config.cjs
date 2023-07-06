/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest',
    // '^.+\\.(ts|tsx)?$': ['ts-jest', {
    //   useESM: true,
    //   babelConfig: true,
    //   plugins: ['babel-plugin-transform-vite-meta-env'],
    // }],
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!pinia/.*)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'vue', 'ts'],
};
