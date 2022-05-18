module.exports = {
  displayName: 'frontend-public',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../coverage/apps/frontend-public',
  coverageReporters: ['html'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'coverage/apps/frontend-public', outputName: 'junit.xml' }]
  ],
  collectCoverageFrom: [
      'src/**/*.ts',
      '!src/jest-global-mocks.ts',
      '!src/build.ts',
      '!src/hmr.ts',
      '!src/main.ts',
      '!src/polyfills.ts',
  ],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest',
    '^.+\\.(ts|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: [
    'node_modules/(?!ngx-webstorage)'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
