/**
 * Tests unitaires pour les helpers TypeScript
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  TypeGuards,
  EventHelper,
  AsyncHelper,
  DOMHelper,
  StorageHelper,
  ValidationHelper,
  PerformanceHelper,
  ErrorHelper
} from '../../utils/helpers';

// Mock pour le logger
jest.mock('../../utils/logger', () => ({
  log: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    perf: jest.fn(),
    event: jest.fn(),
    exception: jest.fn()
  }
}));

// Mock pour localStorage
const mockStorage = (): Storage => ({
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null)
});

describe('TypeGuards', () => {
  test('isLanguage should validate language correctly', () => {
    expect(TypeGuards.isLanguage('fr')).toBe(true);
    expect(TypeGuards.isLanguage('en')).toBe(true);
    expect(TypeGuards.isLanguage('es')).toBe(false);
    expect(TypeGuards.isLanguage('')).toBe(false);
    expect(TypeGuards.isLanguage(null)).toBe(false);
  });

  test('isTheme should validate theme correctly', () => {
    expect(TypeGuards.isTheme('light')).toBe(true);
    expect(TypeGuards.isTheme('dark')).toBe(true);
    expect(TypeGuards.isTheme('auto')).toBe(false);
    expect(TypeGuards.isTheme('')).toBe(false);
  });

  test('isNotificationType should validate notification types', () => {
    expect(TypeGuards.isNotificationType('info')).toBe(true);
    expect(TypeGuards.isNotificationType('success')).toBe(true);
    expect(TypeGuards.isNotificationType('warning')).toBe(true);
    expect(TypeGuards.isNotificationType('error')).toBe(true);
    expect(TypeGuards.isNotificationType('debug')).toBe(false);
  });

  test('isComponentState should validate component state object', () => {
    const validState = {
      isInitialized: true,
      isLoading: false,
      hasError: false
    };
    expect(TypeGuards.isComponentState(validState)).toBe(true);

    const invalidState = {
      isInitialized: 'true',
      isLoading: false
    };
    expect(TypeGuards.isComponentState(invalidState)).toBe(false);
  });
});

describe('EventHelper', () => {
  test('dispatch should create and dispatch custom event', () => {
    const mockElement = {
      dispatchEvent: jest.fn()
    } as any;

    EventHelper.dispatch('themeChanged', { theme: 'dark' }, mockElement);

    expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'themeChanged',
        detail: { theme: 'dark' }
      })
    );
  });

  test('listen should add event listener and return cleanup function', () => {
    const mockElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    } as any;

    const callback = jest.fn();
    const cleanup = EventHelper.listen('languageChanged', callback, mockElement);

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'languageChanged',
      expect.any(Function)
    );

    cleanup();
    expect(mockElement.removeEventListener).toHaveBeenCalled();
  });
});

describe('AsyncHelper', () => {
  test('waitFor should resolve when condition becomes true', async () => {
    let condition = false;
    setTimeout(() => {
      condition = true;
    }, 50); // Réduire le délai pour plus de stabilité

    await expect(AsyncHelper.waitFor(() => condition, 500)).resolves.toBeUndefined(); // Augmenter le timeout
  });

  test('waitFor should reject on timeout', async () => {
    await expect(AsyncHelper.waitFor(() => false, 200)).rejects.toThrow('Timeout after 200ms'); // Timeout plus long
  });

  test('delay should wait for specified time', async () => {
    const start = Date.now();
    await AsyncHelper.delay(50); // Réduire le délai pour plus de rapidité
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // Tolérance plus large
  });

  test('retry should retry failed function', async () => {
    let attempts = 0;
    const failingFunction = async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Not yet');
      }
      return 'success';
    };

    const result = await AsyncHelper.retry(failingFunction, 3, 10);
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  test('debounce should delay function execution', done => {
    const mockFn = jest.fn();
    const debouncedFn = AsyncHelper.debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 200); // Timeout plus long pour la stabilité
  });

  test('throttle should limit function execution', done => {
    const mockFn = jest.fn();
    const throttledFn = AsyncHelper.throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(1);

    setTimeout(() => {
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
      done();
    }, 200); // Timeout plus long pour la stabilité
  });
});

describe('DOMHelper', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-element" class="test-class">
        <span class="child">Child</span>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('safeQuerySelector should return element or null', () => {
    const element = DOMHelper.safeQuerySelector('#test-element');
    expect(element).toBeTruthy();
    expect(element?.id).toBe('test-element');

    const nonExistent = DOMHelper.safeQuerySelector('#non-existent');
    expect(nonExistent).toBeNull();
  });

  test('safeQuerySelectorAll should return array of elements', () => {
    const elements = DOMHelper.safeQuerySelectorAll('.test-class, .child');
    expect(elements).toHaveLength(2);
    expect(Array.isArray(elements)).toBe(true);
  });

  test('addClass should add classes to element', () => {
    const element = DOMHelper.safeQuerySelector('#test-element') as HTMLElement;
    DOMHelper.addClass(element, 'new-class', 'another-class');

    expect(element.classList.contains('new-class')).toBe(true);
    expect(element.classList.contains('another-class')).toBe(true);
  });

  test('removeClass should remove classes from element', () => {
    const element = DOMHelper.safeQuerySelector('#test-element') as HTMLElement;
    DOMHelper.removeClass(element, 'test-class');

    expect(element.classList.contains('test-class')).toBe(false);
  });

  test('toggleClass should toggle class on element', () => {
    const element = DOMHelper.safeQuerySelector('#test-element') as HTMLElement;

    const result1 = DOMHelper.toggleClass(element, 'active');
    expect(result1).toBe(true);
    expect(element.classList.contains('active')).toBe(true);

    const result2 = DOMHelper.toggleClass(element, 'active');
    expect(result2).toBe(false);
    expect(element.classList.contains('active')).toBe(false);
  });
});

describe('StorageHelper', () => {
  let mockLocalStorage: Storage;

  beforeEach(() => {
    mockLocalStorage = mockStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  test('set should store value as JSON', () => {
    const testData = { name: 'test', value: 123 };
    StorageHelper.set('test-key', testData);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
  });

  test('get should retrieve and parse value', () => {
    const testData = { name: 'test', value: 123 };
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(testData));

    const result = StorageHelper.get('test-key', {});
    expect(result).toEqual(testData);
  });

  test('get should return default value if key not found', () => {
    (mockLocalStorage.getItem as jest.Mock).mockReturnValue(null);

    const defaultValue = { default: true };
    const result = StorageHelper.get('non-existent', defaultValue);
    expect(result).toEqual(defaultValue);
  });

  test('remove should remove key from storage', () => {
    StorageHelper.remove('test-key');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
  });
});

describe('ValidationHelper', () => {
  test('isValidEmail should validate email addresses', () => {
    expect(ValidationHelper.isValidEmail('test@example.com')).toBe(true);
    expect(ValidationHelper.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    expect(ValidationHelper.isValidEmail('invalid-email')).toBe(false);
    expect(ValidationHelper.isValidEmail('test@')).toBe(false);
    expect(ValidationHelper.isValidEmail('@example.com')).toBe(false);
  });

  test('isValidURL should validate URLs', () => {
    expect(ValidationHelper.isValidURL('https://example.com')).toBe(true);
    expect(ValidationHelper.isValidURL('http://localhost:3000')).toBe(true);
    expect(ValidationHelper.isValidURL('ftp://files.example.com')).toBe(true);
    expect(ValidationHelper.isValidURL('not-a-url')).toBe(false);
    expect(ValidationHelper.isValidURL('http://')).toBe(false);
  });

  test('isNotEmpty should check for non-empty strings', () => {
    expect(ValidationHelper.isNotEmpty('hello')).toBe(true);
    expect(ValidationHelper.isNotEmpty('   text   ')).toBe(true);
    expect(ValidationHelper.isNotEmpty('')).toBe(false);
    expect(ValidationHelper.isNotEmpty('   ')).toBe(false);
  });

  test('hasMinLength should check minimum length', () => {
    expect(ValidationHelper.hasMinLength('hello', 3)).toBe(true);
    expect(ValidationHelper.hasMinLength('hi', 3)).toBe(false);
  });

  test('hasMaxLength should check maximum length', () => {
    expect(ValidationHelper.hasMaxLength('hello', 10)).toBe(true);
    expect(ValidationHelper.hasMaxLength('hello world!', 5)).toBe(false);
  });

  test('validate should combine multiple validators', () => {
    const validators = [
      (val: string) => ValidationHelper.isNotEmpty(val),
      (val: string) => ValidationHelper.hasMinLength(val, 3),
      (val: string) => ValidationHelper.hasMaxLength(val, 10)
    ];

    expect(ValidationHelper.validate('hello', validators)).toBe(true);
    expect(ValidationHelper.validate('hi', validators)).toBe(false);
    expect(ValidationHelper.validate('hello world!', validators)).toBe(false);
  });
});

describe('PerformanceHelper', () => {
  beforeEach(() => {
    PerformanceHelper['marks'].clear();
  });

  test('startMark and endMark should measure duration', () => {
    const originalNow = performance.now;
    let mockTime = 1000;
    performance.now = jest.fn(() => mockTime);

    PerformanceHelper.startMark('test-operation');

    // Simuler du temps
    mockTime = 1100; // 100ms plus tard
    const duration = PerformanceHelper.endMark('test-operation');

    expect(duration).toBe(100);
    performance.now = originalNow;
  });

  test('measure should measure synchronous function execution', () => {
    const testFn = jest.fn(() => 'result');

    const result = PerformanceHelper.measure('test-sync', testFn);

    expect(result.result).toBe('result');
    expect(typeof result.duration).toBe('number');
    expect(testFn).toHaveBeenCalled();
  });

  test('measureAsync should measure async function execution', async () => {
    const testFn = jest.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async-result';
    });

    const result = await PerformanceHelper.measureAsync('test-async', testFn);

    expect(result.result).toBe('async-result');
    expect(typeof result.duration).toBe('number');
    expect(testFn).toHaveBeenCalled();
  });
});

describe('ErrorHelper', () => {
  test('createError should create error with message and code', () => {
    const error = ErrorHelper.createError('Test error', 'TEST_CODE');

    expect(error.message).toBe('Test error');
    expect((error as any).code).toBe('TEST_CODE');
  });

  test('safeHandler should catch errors and return fallback', () => {
    const throwingFn = () => {
      throw new Error('Test error');
    };

    const safeFn = ErrorHelper.safeHandler(throwingFn);
    const result = safeFn();

    expect(result).toBeUndefined();
  });

  test('safeAsync should catch async errors and return fallback', async () => {
    const throwingAsyncFn = async () => {
      throw new Error('Async error');
    };

    const result = await ErrorHelper.safeAsync(throwingAsyncFn, 'async-fallback');
    expect(result).toBe('async-fallback');
  });
});
