/**
 * Setup global pour les tests Jest
 * Configuration de l'environnement de test
 */
import 'jest-environment-jsdom';
import '@testing-library/jest-dom';

// Configuration JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock pour ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock pour IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock pour MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock pour sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

// Mock pour scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock pour getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn()
}));

// Mock pour fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob())
  })
) as jest.Mock;

// Mock pour URL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock pour performance
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => [])
  }
});

// Mock pour requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb: (time: number) => void) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn((id: number) => clearTimeout(id));

// Mock pour console (optionnel - pour réduire le bruit)
const originalConsole = console;
global.console = {
  ...originalConsole
  // Supprimer les logs pendant les tests (décommenter si besoin)
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Configuration globale pour les timeouts
jest.setTimeout(10000);

// Cleanup après chaque test
afterEach(() => {
  // Reset des mocks
  jest.clearAllMocks();

  // Reset du DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Reset des variables globales
  delete (window as any).__PORTFOLIO_CONFIG__;
  delete (window as any).__DEV__;
  delete (window as any).__ADMIN_MODE__;
});

// Configuration avant tous les tests
beforeAll(() => {
  // log.info('🧪 Tests Jest initialisés avec configuration TypeScript');
});

// Nettoyage après tous les tests
afterAll(() => {
  // log.info('✅ Tests Jest terminés');
});
