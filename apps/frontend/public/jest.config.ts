/* eslint-disable */
export default {
  displayName: 'public',
  preset: '../../jest.preset.js',

  coverageDirectory: '../../coverage/apps/frontend',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+.[tj]sx?$': ['babel-jest'],
    '^.+.vue$': [
      '@vue/vue3-jest',
      {
        tsConfig: './tsconfig.spec.json',
      },
    ],
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.ts?(x)', '**/__tests__/*.ts?(x)'],
};
