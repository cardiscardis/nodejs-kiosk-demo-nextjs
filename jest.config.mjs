// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run

  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    'application.yaml': '<rootDir>/__mocks__/application.test.yaml',
  },
  transform: {
    '\\.yaml$': '<rootDir>/jest-yaml-transformer.js',
  },
  setupFiles: ['<rootDir>/configJSDom.ts'],
  verbose: true,
  testMatch: ['<rootDir>/__tests__/unit/**/**/*.{ts,tsx}'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
