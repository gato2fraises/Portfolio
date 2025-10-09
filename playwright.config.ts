/**
 * Configuration Playwright pour les tests E2E
 * Tests d'intégration du portfolio
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Dossier des tests E2E
  testDir: './src/tests/e2e',
  
  // Nombre de tests en parallèle
  fullyParallel: true,
  
  // Fail le build si pas de tests
  forbidOnly: !!process.env.CI,
  
  // Retry sur CI seulement
  retries: process.env.CI ? 2 : 0,
  
  // Workers en parallèle
  workers: process.env.CI ? 1 : undefined,
  
  // Configuration des rapports
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  // Configuration globale
  use: {
    // URL de base pour les tests
    baseURL: 'http://localhost:3000',
    
    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Vidéos en cas d'échec
    video: 'retain-on-failure',
    
    // Traces en cas d'échec
    trace: 'on-first-retry',
    
    // Timeout pour les actions
    actionTimeout: 10000,
    
    // Timeout pour la navigation
    navigationTimeout: 30000,
  },
  
  // Configuration des navigateurs
  projects: [
    // Desktop Chrome
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Desktop Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    // Desktop Safari
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile Chrome
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    // Mobile Safari
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],
  
  // Configuration du serveur de développement
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  // Dossiers de sortie
  outputDir: 'test-results/playwright',
  
  // Timeout global pour les tests
  timeout: 30000,
  
  // Configuration expect
  expect: {
    // Timeout pour les assertions
    timeout: 5000,
    
    // Screenshots pour les comparaisons visuelles
    toHaveScreenshot: {
      animations: 'disabled',
      scale: 'css',
    },
  },
  
  // Configuration des métadonnées
  metadata: {
    project: 'Portfolio TypeScript E2E Tests',
    version: '1.0.0',
  },
});