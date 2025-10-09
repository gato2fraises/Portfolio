/**
 * Types et interfaces pour le portfolio Dylan Carion
 * Définitions TypeScript centralisées avec référence DOM
 */

/// <reference lib="dom" />

// Types globaux du portfolio
export interface PortfolioConfig {
  defaultLanguage: Language;
  supportedLanguages: Language[];
  theme: ThemeConfig;
  analytics: AnalyticsConfig;
  pwa: PWAConfig;
}

// Interfaces pour le système d'événements personnalisés
export interface CustomEventMap {
  'themeChanged': CustomEvent<{ theme: string }>;
  'languageChanged': CustomEvent<{ language: Language }>;
  'pwaInstalled': CustomEvent<{}>;
  'pwaUpdateAvailable': CustomEvent<{}>;
}

// Extension de Document pour les événements personnalisés
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
  
  interface Window {
    analytics: ComponentManager;
    themeManager: ComponentManager;
    languageManager: ComponentManager;
    pwa: ComponentManager;
    gsapManager: ComponentManager;
    blogManager: ComponentManager;
    contactManager: ComponentManager;
    showNotification: (message: string, type?: NotificationType) => void;
    portfolioManager: ComponentManager;
    getPortfolioStats: () => any;
    __PORTFOLIO_CONFIG__: PortfolioConfig;
    __DEV__: boolean;
    __ADMIN_MODE__: boolean;
  }
}

export type Language = 'fr' | 'en';

export interface ThemeConfig {
  defaultTheme: Theme;
  enableSystemDetection: boolean;
  transitionDuration: number;
}

export type Theme = 'light' | 'dark';

export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  gdprCompliant: boolean;
  cookieConsent: boolean;
}

export interface PWAConfig {
  enabled: boolean;
  autoInstallPrompt: boolean;
  offlineSupport: boolean;
  pushNotifications: boolean;
}

// Types pour les composants
export interface ComponentState {
  isInitialized: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface EventListenerMap {
  [key: string]: Array<(event: Event) => void>;
}

// Types pour le blog
export interface BlogArticle {
  id: string;
  title: Record<Language, string>;
  content: Record<Language, string>;
  excerpt: Record<Language, string>;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishDate: Date;
  readTime: number;
  featured: boolean;
  image?: string;
}

export type BlogCategory = 'Frontend' | 'Backend' | 'DevOps' | 'AI';

export interface BlogState {
  articles: BlogArticle[];
  currentPage: number;
  articlesPerPage: number;
  searchQuery: string;
  selectedCategory: BlogCategory | 'all';
  loading: boolean;
}

// Types pour le formulaire de contact
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  gdprConsent: boolean;
  newsletter?: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface FormField {
  name: keyof ContactFormData;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox';
  validation: ValidationRule;
  placeholder: Record<Language, string>;
  label: Record<Language, string>;
}

export interface ValidationError {
  field: keyof ContactFormData;
  message: string;
}

// Types pour les animations GSAP
export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
}

export interface ScrollTriggerConfig {
  trigger: string | Element;
  start: string;
  end?: string;
  scrub?: boolean;
  toggleActions?: string;
}

export interface GSAPTimeline {
  id: string;
  timeline: any; // gsap.core.Timeline - will be properly typed when GSAP types are installed
  isPlaying: boolean;
  isPaused: boolean;
}

// Types pour PWA
export interface ServiceWorkerConfig {
  scope: string;
  cacheName: string;
  cacheUrls: string[];
  strategies: CacheStrategy[];
}

export interface CacheStrategy {
  urlPattern: RegExp;
  strategy: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate';
  cacheName: string;
  expiration?: {
    maxEntries: number;
    maxAgeSeconds: number;
  };
}

export interface PWAInstallPrompt {
  platforms: string[];
  userChoice: 'accepted' | 'dismissed';
}

// Types pour les analytics
export interface AnalyticsEvent {
  eventName: string;
  parameters: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface AnalyticsData {
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  events: AnalyticsEvent[];
}

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: Date;
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Types pour l'internationalisation
export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

export interface I18nConfig {
  currentLanguage: Language;
  translations: Record<Language, TranslationKeys>;
  fallbackLanguage: Language;
}

// Types utilitaires
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface LocalStorageData {
  theme: Theme;
  language: Language;
  cookieConsent?: CookieConsent;
  formBackups?: Partial<ContactFormData>;
  userPreferences?: UserPreferences;
}

export interface UserPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
}

// Types pour les gestionnaires de composants
export interface ComponentManager {
  init(): Promise<void>;
  destroy(): void;
  getState(): ComponentState;
  updateConfig(config: Partial<any>): void;
}

export interface PortfolioManager extends ComponentManager {
  getComponent<T extends ComponentManager>(name: string): T | null;
  getAllComponents(): Map<string, ComponentManager>;
  reinitialize(): Promise<void>;
}

// Déclarations globales pour les bibliothèques externes
declare global {
  interface Window {
    // Gestionnaires principaux
    portfolioManager: ComponentManager;
    languageManager: ComponentManager;
    themeManager: ComponentManager;
    analytics: ComponentManager;
    pwa: ComponentManager;
    gsapManager: ComponentManager;
    blogManager: ComponentManager;
    contactManager: ComponentManager;
    
    // Fonctions utilitaires
    showNotification: (message: string, type?: NotificationType) => void;
    getPortfolioStats: () => any;
    getPWAInfo: () => any;
    getCacheInfo: () => Promise<any>;
    
    // Variables globales
    __PORTFOLIO_CONFIG__: PortfolioConfig;
    __DEV__: boolean;
    __ADMIN_MODE__: boolean;
  }
  
  // Extensions pour Service Worker
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: Array<{url: string, revision: string}>;
  }
}

export {};