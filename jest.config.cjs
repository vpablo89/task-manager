/** @type {import('jest').Config} */
const tsJestPath = require.resolve('ts-jest');

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [tsJestPath, { tsconfig: 'tsconfig.json' }],
  },
};

