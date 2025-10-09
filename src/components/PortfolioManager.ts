import type { 
  PortfolioManager as IPortfolioManager, 
  ComponentManager, 
  ComponentState, 
  PortfolioConfig,
  Language,
  NotificationType 
} from '../types/index.js';
import { log } from '../utils/logger';

/**
 * Gestionnaire principal du portfolio avancé en TypeScript
 * Orchestre tous les composants et gère leur cycle de vie
 */
export class PortfolioManager implements IPortfolioManager {
  private components = new Map<string, ComponentManager>();
  private state: ComponentState = {
    isInitialized: false,
    isLoading: false,
    hasError: false
  };

  private config: PortfolioConfig = {
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    theme: {
      defaultTheme: 'light',
      enableSystemDetection: true,
      transitionDuration: 300
    },
    analytics: {
      enabled: true,
      gdprCompliant: true,
      cookieConsent: true
    },
    pwa: {
      enabled: true,
      autoInstallPrompt: true,
      offlineSupport: true,
      pushNotifications: false
    }
  };

  constructor() {
    this.init().catch(error => {
      log.error(`❌ Erreur initialisation portfolio: ${error.message}`, 'PORTFOLIO', error);
      this.handleInitError(error);
    });
  }

  /**
   * Initialise le portfolio et tous ses composants
   */
  async init(): Promise<void> {
    try {
      log.info('🚀 Initialisation du Portfolio Avancé (TypeScript)...');
      
      this.state.isLoading = true;
      this.showLoader();
      
      // Attendre que le DOM soit chargé
      await this.waitForDOMReady();
      
      // Exposer la configuration globale
      window.__PORTFOLIO_CONFIG__ = this.config;
      window.__DEV__ = process.env.NODE_ENV === 'development';
      window.__ADMIN_MODE__ = localStorage.getItem('admin_mode') === 'true';
      
      // Initialiser les composants en parallèle
      await this.initializeComponents();
      
      // Configurer les event listeners globaux
      this.setupGlobalEventListeners();
      
      // Masquer le loader et démarrer les animations
      this.hideLoader();
      
      this.state.isInitialized = true;
      this.state.isLoading = false;
      log.info('✅ Portfolio initialisé avec succès (TypeScript)');
      
      // Afficher les stats d'initialisation
      this.showInitStats();
      
    } catch (error) {
      this.state.hasError = true;
      this.state.errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw error;
    }
  }

  /**
   * Attend que le DOM soit prêt
   */
  private waitForDOMReady(): Promise<void> {
    return new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve());
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialise tous les composants du portfolio
   */
  private async initializeComponents(): Promise<void> {
    const initPromises: Promise<ComponentManager>[] = [];
    
    // Attendre que les gestionnaires soient disponibles
    initPromises.push(this.waitForComponent('languageManager', 'i18n'));
    initPromises.push(this.waitForComponent('themeManager', 'theme'));
    initPromises.push(this.waitForComponent('analytics', 'analytics'));
    initPromises.push(this.waitForComponent('pwa', 'PWA'));
    initPromises.push(this.waitForComponent('gsapManager', 'GSAP'));
    
    // Attendre que tous les composants soient initialisés
    const results = await Promise.allSettled(initPromises);
    
    // Vérifier les résultats
    results.forEach((result, index) => {
      const componentNames = ['i18n', 'theme', 'analytics', 'PWA', 'GSAP'];
      if (result.status === 'fulfilled') {
        log.info(`✅ ${componentNames[index]} initialisé`);
        this.components.set(componentNames[index], result.value);
      } else {
        log.warn(`⚠️ ${componentNames[index]} non disponible:`, result.reason);
      }
    });
    
    // Initialiser les fonctionnalités spécifiques à la page
    this.initializePageSpecificFeatures();
    
    // Configurer les interactions entre composants
    this.setupComponentInteractions();
  }

  /**
   * Attend qu'un composant soit disponible
   */
  private waitForComponent(globalVar: string, name: string, timeout = 5000): Promise<ComponentManager> {
    return new Promise((resolve, reject) => {
      const checkComponent = (): void => {
        const component = (window as any)[globalVar];
        if (component) {
          resolve(component);
        } else {
          setTimeout(checkComponent, 100);
        }
      };
      
      checkComponent();
      
      // Timeout de sécurité
      setTimeout(() => {
        if (!(window as any)[globalVar]) {
          reject(new Error(`${name} non chargé dans les ${timeout}ms`));
        }
      }, timeout);
    });
  }

  /**
   * Initialise les fonctionnalités spécifiques à chaque page
   */
  private initializePageSpecificFeatures(): void {
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'index':
        this.initializeHomePage();
        break;
      case 'blog':
        this.initializeBlogPage();
        break;
      case 'contact':
        this.initializeContactPage();
        break;
      case 'cv':
        this.initializeCVPage();
        break;
      case 'projet':
        this.initializeProjectPage();
        break;
    }
  }

  /**
   * Obtient la page actuelle
   */
  private getCurrentPage(): string {
    const path = window.location.pathname;
    const page = path.split('/').pop()?.replace('.html', '') || 'index';
    return page;
  }

  /**
   * Initialise la page d'accueil
   */
  private initializeHomePage(): void {
    this.setupHeroAnimations();
    this.setupScrollEffects();
    this.setupNavigationEffects();
  }

  /**
   * Initialise la page blog
   */
  private initializeBlogPage(): void {
    if (window.blogManager) {
      log.info('📝 Blog système activé');
    }
  }

  /**
   * Initialise la page contact
   */
  private initializeContactPage(): void {
    if (window.contactManager) {
      log.info('✉️ Système de contact activé');
    }
  }

  /**
   * Initialise la page CV
   */
  private initializeCVPage(): void {
    this.setupCVAnimations();
  }

  /**
   * Initialise la page projets
   */
  private initializeProjectPage(): void {
    this.setupProjectAnimations();
  }

  /**
   * Configure les animations de la section héro
   */
  private setupHeroAnimations(): void {
    if (window.gsapManager) {
      const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
      heroElements.forEach(el => el.classList.add('animate-on-load'));
    }
  }

  /**
   * Configure les effets de scroll
   */
  private setupScrollEffects(): void {
    if (!window.gsapManager) {
      this.setupFallbackScrollEffects();
    }
  }

  /**
   * Configure les effets de scroll de fallback
   */
  private setupFallbackScrollEffects(): void {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(50px)';
      element.style.transition = 'all 0.6s ease';
      observer.observe(element);
    });
  }

  /**
   * Configure les effets de navigation
   */
  private setupNavigationEffects(): void {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleSmoothScroll);
    });
  }

  /**
   * Gère le scroll fluide
   */
  private handleSmoothScroll = (e: Event): void => {
    e.preventDefault();
    const target = e.currentTarget as HTMLAnchorElement;
    const targetId = target.getAttribute('href')?.substring(1);
    
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  /**
   * Configure les animations du CV
   */
  private setupCVAnimations(): void {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      const element = bar as HTMLElement;
      const percentage = element.dataset.percent;
      if (percentage) {
        setTimeout(() => {
          element.style.width = `${percentage}%`;
        }, 500);
      }
    });
  }

  /**
   * Configure les animations des projets
   */
  private setupProjectAnimations(): void {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      const element = card as HTMLElement;
      element.style.animationDelay = `${index * 0.2}s`;
      element.classList.add('animate-on-scroll');
    });
  }

  /**
   * Configure les interactions entre composants
   */
  private setupComponentInteractions(): void {
    this.setupAnalyticsTracking();
    this.setupThemeSync();
    this.setupLanguageSync();
    this.setupPWAIntegration();
  }

  /**
   * Configure le tracking analytics
   */
  private setupAnalyticsTracking(): void {
    if (window.analytics) {
      // Tracker les changements de thème
      document.addEventListener('themeChanged', (e: Event) => {
        const customEvent = e as CustomEvent;
        (window.analytics as any).trackEvent?.('theme_changed', {
          theme: customEvent.detail.theme
        });
      });
      
      // Tracker les changements de langue
      document.addEventListener('languageChanged', (e: Event) => {
        const customEvent = e as CustomEvent;
        (window.analytics as any).trackEvent?.('language_changed', {
          language: customEvent.detail.language
        });
      });
      
      // Tracker les interactions avec les composants
      document.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.matches('.btn, .contact-btn, .download-btn')) {
          (window.analytics as any).trackEvent?.('button_click', {
            button: target.textContent?.trim(),
            page: this.getCurrentPage()
          });
        }
      });
    }
  }

  /**
   * Synchronise le thème avec PWA
   */
  private setupThemeSync(): void {
    if (window.themeManager && window.pwa) {
      document.addEventListener('themeChanged', (e: CustomEvent) => {
        const themeColor = e.detail.theme === 'dark' ? '#1a1a1a' : '#667eea';
        const themeMetaTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (themeMetaTag) {
          themeMetaTag.setAttribute('content', themeColor);
        }
      });
    }
  }

  /**
   * Synchronise la langue avec tous les composants
   */
  private setupLanguageSync(): void {
    if (window.languageManager) {
      document.addEventListener('languageChanged', (e: CustomEvent) => {
        const newLang: Language = e.detail.language;
        document.documentElement.lang = newLang;
        
        // Notifier les autres composants
        this.components.forEach((component) => {
          if ('updateLanguage' in component) {
            (component as any).updateLanguage(newLang);
          }
        });
      });
    }
  }

  /**
   * Configure l'intégration PWA
   */
  private setupPWAIntegration(): void {
    if (window.pwa) {
      document.addEventListener('pwaInstalled', () => {
        if (window.analytics) {
          (window.analytics as any).trackEvent?.('pwa_installed');
        }
        this.showNotification('Portfolio installé avec succès !', 'success');
      });
      
      document.addEventListener('pwaUpdateAvailable', () => {
        this.showNotification('Mise à jour disponible', 'info');
      });
    }
  }

  /**
   * Configure les event listeners globaux
   */
  private setupGlobalEventListeners(): void {
    // Gestion des erreurs globales
    window.addEventListener('error', (e: ErrorEvent) => {
      log.error(`Erreur JavaScript: ${e.message}`, 'JS_ERROR', e.error);
      if (window.analytics) {
        (window.analytics as any).trackEvent?.('javascript_error', {
          message: e.message,
          filename: e.filename,
          line: e.lineno
        });
      }
    });
    
    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Gestion du redimensionnement
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  /**
   * Met en pause les animations
   */
  private pauseAnimations(): void {
    if (window.gsapManager && 'pauseAllAnimations' in window.gsapManager) {
      (window.gsapManager as any).pauseAllAnimations();
    }
  }

  /**
   * Reprend les animations
   */
  private resumeAnimations(): void {
    if (window.gsapManager && 'resumeAllAnimations' in window.gsapManager) {
      (window.gsapManager as any).resumeAllAnimations();
    }
  }

  /**
   * Gère le redimensionnement
   */
  private handleResize(): void {
    // Notifier les autres composants
    this.components.forEach(component => {
      if ('handleResize' in component) {
        (component as any).handleResize();
      }
    });
  }

  /**
   * Affiche le loader
   */
  private showLoader(): void {
    const loader = document.querySelector('.page-loader') as HTMLElement;
    if (loader) {
      loader.style.display = 'flex';
    }
  }

  /**
   * Masque le loader
   */
  private hideLoader(): void {
    const loader = document.querySelector('.page-loader') as HTMLElement;
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }

  /**
   * Affiche une notification
   */
  private showNotification(message: string, type: NotificationType = 'info'): void {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      log.info(`${type.toUpperCase()}: ${message}`);
    }
  }

  /**
   * Affiche les statistiques d'initialisation
   */
  private showInitStats(): void {
    if (window.__ADMIN_MODE__) {
      log.info('📊 Statistiques d\'initialisation (TypeScript):');
      log.info(`- Composants chargés: ${this.components.size}`);
      log.info(`- Page: ${this.getCurrentPage()}`);
      log.info(`- Thème: ${document.documentElement.dataset.theme || 'light'}`);
      log.info(`- Langue: ${document.documentElement.lang || 'fr'}`);
      
      // Exposer les méthodes d'administration
      window.portfolioManager = this;
      window.getPortfolioStats = () => ({
        components: Array.from(this.components.keys()),
        page: this.getCurrentPage(),
        theme: document.documentElement.dataset.theme,
        language: document.documentElement.lang,
        initialized: this.state.isInitialized
      });
    }
  }

  /**
   * Gère les erreurs d'initialisation
   */
  private handleInitError(error: Error): void {
    log.error(`Erreur critique: ${error.message}`, 'PORTFOLIO', error);
    
    // Afficher un message d'erreur à l'utilisateur
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 9999;
      max-width: 300px;
    `;
    errorMessage.textContent = 'Erreur de chargement. Veuillez actualiser la page.';
    document.body.appendChild(errorMessage);
    
    // Masquer le loader même en cas d'erreur
    this.hideLoader();
    
    // Tracker l'erreur si possible
    if (window.analytics) {
      (window.analytics as any).trackEvent?.('init_error', {
        error: error.message
      });
    }
  }

  // Méthodes publiques de l'interface
  destroy(): void {
    // Arrêter toutes les animations
    this.pauseAnimations();
    
    // Nettoyer les composants
    this.components.forEach(component => {
      if ('destroy' in component) {
        (component as any).destroy();
      }
    });
    this.components.clear();
    
    this.state.isInitialized = false;
    log.info('Portfolio TypeScript détruit');
  }

  getState(): ComponentState {
    return { ...this.state };
  }

  updateConfig(config: Partial<PortfolioConfig>): void {
    this.config = { ...this.config, ...config };
    window.__PORTFOLIO_CONFIG__ = this.config;
  }

  getComponent<T extends ComponentManager>(name: string): T | null {
    return this.components.get(name) as T || null;
  }

  getAllComponents(): Map<string, ComponentManager> {
    return new Map(this.components);
  }

  async reinitialize(): Promise<void> {
    log.info('🔄 Réinitialisation du portfolio TypeScript...');
    this.destroy();
    this.components.clear();
    this.state.isInitialized = false;
    await this.init();
  }
}

// Initialisation automatique
new PortfolioManager();
