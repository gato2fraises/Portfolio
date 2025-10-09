module.exports = {
  // Configuration ESLint optimisée pour TypeScript
  // Règles adaptées au portfolio moderne
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  globals: {
    'Event': 'readonly',
    'CustomEvent': 'readonly',
    'Element': 'readonly',
    'HTMLElement': 'readonly',
    'NodeListOf': 'readonly',
    'EventListener': 'readonly',
    'EventListenerOptions': 'readonly',
    'AddEventListenerOptions': 'readonly',
    'EventListenerOrEventListenerObject': 'readonly',
    'FrameRequestCallback': 'readonly'
  },
  rules: {
    // Règles de base
    'no-unused-vars': 'off', // Désactivé car TypeScript s'en occupe
    'no-undef': 'off', // Désactivé pour TypeScript
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always']
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts', 'setup.ts'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['src/utils/logger.ts'],
      rules: {
        'no-console': 'off' // Autorisé dans le logger
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'coverage/',
    'node_modules/',
    '*.min.js',
    'public/',
    'test-results/'
  ]
};