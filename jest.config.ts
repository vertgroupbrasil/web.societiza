import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Ajuste se usa paths personalizados no tsconfig
  },
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
};

export default config;
