/**
 * Configuration Jest pour les tests unitaires - Version corrigée
 * Tests pour le portfolio TypeScript
 */
module.exports = {
  // Environnement de test
  testEnvironment: 'jsdom',
  
  // Extensions de fichiers supportées
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transformation des fichiers TypeScript
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.jest.json'
    }]
  },
  
  // Support des modules ES
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  
  // Patterns de fichiers de test
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/*.test.ts',
    '**/*.spec.ts'
  ],
  
  // Ignorer ces dossiers
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/src/tests/e2e/'
  ],
  
  // Configuration du coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  
  // Fichiers à inclure dans le coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/types/**/*'
  ],
  
  // Seuils de coverage réalistes pour le portfolio
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 30,
      lines: 25,
      statements: 25
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  
  // Module name mapping - Propriété CORRECTE pour Jest
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.ts'
  },
  
  // Configuration globals pour JSDOM
  testEnvironmentOptions: {
    url: 'http://localhost',
    customExportConditions: [''],
  },
  
  // Verbose output
  verbose: true,
  
  // Clear mocks entre les tests
  clearMocks: true,
  
  // Restore mocks après chaque test
  restoreMocks: true,
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Reporters simplifiés
  reporters: [
    'default'
  ]
};