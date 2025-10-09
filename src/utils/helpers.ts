/**
 * Utilitaires TypeScript pour le portfolio
 * Fonctions d'aide et helpers pour TypeScript
 */
import type {
  Language,
  Theme,
  ComponentState,
  NotificationType,
  CustomEventMap
} from '../types/index.js';
import { log } from './logger';

/**
 * Type guards pour vérifier les types
 */
export class TypeGuards {
  static isLanguage(value: any): value is Language {
    return value === 'fr' || value === 'en';
  }

  static isTheme(value: any): value is Theme {
    return value === 'light' || value === 'dark';
  }

  static isNotificationType(value: any): value is NotificationType {
    return ['info', 'success', 'warning', 'error'].includes(value);
  }

  static isComponentState(value: any): value is ComponentState {
    return (
      typeof value === 'object' &&
      typeof value.isInitialized === 'boolean' &&
      typeof value.isLoading === 'boolean' &&
      typeof value.hasError === 'boolean'
    );
  }
}

/**
 * Helpers pour les événements personnalisés
 */
export class EventHelper {
  /**
   * Dispatch un événement personnalisé
   */
  static dispatch<K extends keyof CustomEventMap>(
    eventType: K,
    detail: CustomEventMap[K]['detail'],
    target: EventTarget = document
  ): void {
    const event = new CustomEvent(eventType, { detail });
    target.dispatchEvent(event);
  }

  /**
   * Ajoute un listener pour événement personnalisé
   */
  static listen<K extends keyof CustomEventMap>(
    eventType: K,
    callback: (event: CustomEventMap[K]) => void,
    target: EventTarget = document
  ): () => void {
    const handler = (event: Event) => {
      callback(event as CustomEventMap[K]);
    };

    target.addEventListener(eventType, handler);

    // Retourne une fonction pour supprimer le listener
    return () => target.removeEventListener(eventType, handler);
  }
}

/**
 * Helpers pour la gestion asynchrone
 */
export class AsyncHelper {
  /**
   * Attend qu'une condition soit vraie
   */
  static async waitFor(condition: () => boolean, timeout = 5000, interval = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout after ${timeout}ms`));
        } else {
          setTimeout(check, interval);
        }
      };

      check();
    });
  }

  /**
   * Retry une fonction async avec backoff
   */
  static async retry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await this.delay(delay);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Délai asynchrone
   */
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Débounce pour les fonctions
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle pour les fonctions
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), wait);
      }
    };
  }
}

/**
 * Helpers pour le DOM
 */
export class DOMHelper {
  /**
   * Sélecteur sécurisé avec TypeScript
   */
  static safeQuerySelector<T extends HTMLElement = HTMLElement>(
    selector: string,
    parent: Document | Element = document
  ): T | null {
    return parent.querySelector(selector) as T | null;
  }

  /**
   * Sélecteur multiple sécurisé
   */
  static safeQuerySelectorAll<T extends HTMLElement = HTMLElement>(
    selector: string,
    parent: Document | Element = document
  ): T[] {
    return Array.from(parent.querySelectorAll(selector)) as T[];
  }

  /**
   * Vérifie si un élément est visible
   */
  static isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Attend qu'un élément apparaisse dans le DOM
   */
  static async waitForElement(selector: string, timeout = 5000): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Ajoute des classes CSS de manière sécurisée
   */
  static addClass(element: HTMLElement, ...classes: string[]): void {
    element.classList.add(...classes);
  }

  /**
   * Supprime des classes CSS
   */
  static removeClass(element: HTMLElement, ...classes: string[]): void {
    element.classList.remove(...classes);
  }

  /**
   * Toggle des classes CSS
   */
  static toggleClass(element: HTMLElement, className: string, force?: boolean): boolean {
    return element.classList.toggle(className, force);
  }
}

/**
 * Helpers pour le localStorage avec TypeScript
 */
export class StorageHelper {
  /**
   * Sauvegarde une valeur avec type safety
   */
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      log.warn('Erreur localStorage set', 'STORAGE', error);
    }
  }

  /**
   * Récupère une valeur avec type safety
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      log.warn('Erreur localStorage get', 'STORAGE', error);
      return defaultValue;
    }
  }

  /**
   * Supprime une clé
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      log.warn('Erreur localStorage remove', 'STORAGE', error);
    }
  }

  /**
   * Vérifie si une clé existe
   */
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Nettoie le localStorage avec un préfixe
   */
  static clearWithPrefix(prefix: string): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      log.warn('Erreur localStorage clearWithPrefix', 'STORAGE', error);
    }
  }
}

/**
 * Helpers pour la performance
 */
export class PerformanceHelper {
  private static marks = new Map<string, number>();

  /**
   * Démarre une mesure de performance
   */
  static startMark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Termine une mesure et retourne la durée
   */
  static endMark(name: string): number {
    const start = this.marks.get(name);
    if (!start) {
      log.warn(`Mark '${name}' not found`, 'PERF');
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(name);
    return duration;
  }

  /**
   * Mesure l'exécution d'une fonction
   */
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    this.startMark(name);
    const result = await fn();
    const duration = this.endMark(name);

    log.perf(name, performance.now() - duration, 'ASYNC');

    return { result, duration };
  }

  /**
   * Mesure l'exécution d'une fonction synchrone
   */
  static measure<T>(name: string, fn: () => T): { result: T; duration: number } {
    this.startMark(name);
    const result = fn();
    const duration = this.endMark(name);

    log.perf(name, performance.now() - duration, 'SYNC');

    return { result, duration };
  }
}

/**
 * Helpers pour la validation
 */
export class ValidationHelper {
  /**
   * Valide un email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide une URL
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Valide qu'une chaîne n'est pas vide
   */
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  /**
   * Valide une longueur minimale
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  /**
   * Valide une longueur maximale
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  /**
   * Combine plusieurs validateurs
   */
  static validate(value: string, validators: Array<(val: string) => boolean>): boolean {
    return validators.every(validator => validator(value));
  }
}

/**
 * Helpers pour les erreurs
 */
export class ErrorHelper {
  /**
   * Crée une erreur personnalisée
   */
  static createError(message: string, code?: string): Error {
    const error = new Error(message);
    if (code) {
      (error as any).code = code;
    }
    return error;
  }

  /**
   * Gère les erreurs de manière sécurisée
   */
  static safeHandler<T extends (...args: any[]) => any>(
    fn: T,
    fallback?: ReturnType<T>
  ): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return (...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        log.error('Erreur dans safeHandler', 'SAFETY', error);
        return fallback;
      }
    };
  }

  /**
   * Wrapper async avec gestion d'erreur
   */
  static async safeAsync<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined> {
    try {
      return await fn();
    } catch (error) {
      log.error('Erreur dans safeAsync', 'SAFETY', error);
      return fallback;
    }
  }
}

// Export par défaut de tous les helpers (suppression du re-export en conflit)
