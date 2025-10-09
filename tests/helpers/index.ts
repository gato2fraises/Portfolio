/**
 * Configuration des tests - Utilitaires et helpers
 * Fonctions et mocks partagés pour les tests
 */

/// <reference types="jest" />

// Configuration Jest étendue
export const testConfig = {
  timeout: 10000,
  retries: 2,
  bail: false
};

// Mock du localStorage pour les tests
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
};

// Mock du DOM pour les tests
export const createMockElement = (tagName: string = 'div'): HTMLElement => {
  const element = document.createElement(tagName);
  return element;
};

// Utilitaires de test pour les composants
export const componentTestUtils = {
  render: (component: any, container?: HTMLElement) => {
    const testContainer = container || createMockElement();
    component.element = testContainer;
    return { container: testContainer, component };
  },
  
  waitFor: (condition: () => boolean, timeout: number = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }
};

// Mock des modules externes
export const mockModules = {
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
};