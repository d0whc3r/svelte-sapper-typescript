module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'svelte'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svelte$': 'svelte-jester'
  },
  testMatch: ['**/tests/**/*.spec.(js|jsx|ts|tsx)', '**/__tests__/*.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  cache: false,
  testResultsProcessor: 'jest-sonar-reporter',
  reporters: ['default', 'jest-junit'],
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setup-after-env.js'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: {
        sourceMap: true,
        inlineSourceMap: true
      },
      diagnostics: true
    }
  }
};
