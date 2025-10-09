/**
 * Application principale du Portfolio Dylan Carion
 * Gère l'orchestration de tous les composants
 */

import type { Language, Theme, AppSettings } from '../types/index.js';
import { Logger } from '../utils/logger.js';
import { ThemeManager } from '../utils/ThemeManager.js';
import { I18nManager } from '../utils/I18nManager.js';
import { Router } from '../utils/Router.js';
import { Header } from './Header.js';
import { Hero } from './Hero.js';
import { About } from './About.js';
import { Projects } from './Projects.js';
import { Skills } from './Skills.js';
import { Experience } from './Experience.js';
import { Contact } from './Contact.js';
import { Footer } from './Footer.js';

/**
 * Classe principale de l'application
 */
export class App {
  private themeManager: ThemeManager;
  private i18nManager: I18nManager;
  private router: Router;
  private components: Map<string, any> = new Map();
  private settings: AppSettings;

  constructor() {
    // Initialiser les paramètres par défaut
    this.settings = {
      language: 'fr',
      theme: 'auto',
      animationsEnabled: true,
      reducedMotion: false
    };

    // Initialiser les gestionnaires
    this.themeManager = new ThemeManager(this.settings.theme);
    this.i18nManager = new I18nManager(this.settings.language);
    this.router = new Router();
  }

  /**
   * Initialise l'application complète
   */
  async init(): Promise<void> {
    try {
      Logger.info('🏗️ Initialisation des gestionnaires...');
      
      // Charger les préférences utilisateur
      await this.loadUserSettings();
      
      // Initialiser les gestionnaires
      await this.themeManager.init();
      await this.i18nManager.init();
      
      // Créer la structure HTML de base
      this.createAppStructure();
      
      // Initialiser les composants
      await this.initComponents();
      
      // Configurer le routeur
      this.setupRouter();
      
      // Configurer les événements globaux
      this.setupGlobalEvents();
      
      // Détecter les préférences système
      this.detectSystemPreferences();
      
      Logger.info('🎉 Application initialisée');
      
    } catch (error) {
      Logger.error('❌ Erreur lors de l\'initialisation de l\'App:', error);
      throw error;
    }
  }

  /**
   * Crée la structure HTML de base
   */
  private createAppStructure(): void {
    document.body.innerHTML = `
      <div id="app" class="app">
        <header id="header" class="header"></header>
        <main id="main" class="main">
          <section id="hero" class="hero section"></section>
          <section id="about" class="about section"></section>
          <section id="projects" class="projects section"></section>
          <section id="skills" class="skills section"></section>
          <section id="experience" class="experience section"></section>
          <section id="contact" class="contact section"></section>
        </main>
        <footer id="footer" class="footer"></footer>
      </div>
    `;
  }

  /**
   * Initialise tous les composants
   */
  private async initComponents(): Promise<void> {
    const componentConfigs = [
      { name: 'header', class: Header, selector: '#header' },
      { name: 'hero', class: Hero, selector: '#hero' },
      { name: 'about', class: About, selector: '#about' },
      { name: 'projects', class: Projects, selector: '#projects' },
      { name: 'skills', class: Skills, selector: '#skills' },
      { name: 'experience', class: Experience, selector: '#experience' },
      { name: 'contact', class: Contact, selector: '#contact' },
      { name: 'footer', class: Footer, selector: '#footer' }
    ];

    for (const config of componentConfigs) {
      try {
        const element = document.querySelector(config.selector);
        if (!element) {
          throw new Error(`Element ${config.selector} not found`);
        }

        const component = new config.class(element as HTMLElement);
        await component.init();
        this.components.set(config.name, component);
        
        Logger.debug(`✅ Composant ${config.name} initialisé`);
      } catch (error) {
        Logger.error(`❌ Erreur lors de l'initialisation du composant ${config.name}:`, error);
      }
    }
  }

  /**
   * Configure le routeur
   */
  private setupRouter(): void {
    this.router.addRoute('/', () => this.showSection('hero'));
    this.router.addRoute('/about', () => this.showSection('about'));
    this.router.addRoute('/projects', () => this.showSection('projects'));
    this.router.addRoute('/skills', () => this.showSection('skills'));
    this.router.addRoute('/experience', () => this.showSection('experience'));
    this.router.addRoute('/contact', () => this.showSection('contact'));
    
    this.router.init();
  }

  /**
   * Affiche une section spécifique
   */
  private showSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Configure les événements globaux
   */
  private setupGlobalEvents(): void {
    // Changement de langue
    document.addEventListener('language-change', (event: any) => {
      this.changeLanguage(event.detail.language);
    });

    // Changement de thème
    document.addEventListener('theme-change', (event: any) => {
      this.changeTheme(event.detail.theme);
    });

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Détecte les préférences système
   */
  private detectSystemPreferences(): void {
    // Détecter la préférence de mouvement réduit
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.settings.reducedMotion = prefersReducedMotion.matches;
    
    prefersReducedMotion.addEventListener('change', (e) => {
      this.settings.reducedMotion = e.matches;
      this.updateAnimationSettings();
    });

    // Détecter le thème système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (this.settings.theme === 'auto') {
      this.themeManager.setTheme(prefersDark.matches ? 'dark' : 'light');
    }
    
    prefersDark.addEventListener('change', (e) => {
      if (this.settings.theme === 'auto') {
        this.themeManager.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Change la langue de l'application
   */
  private async changeLanguage(language: Language): Promise<void> {
    this.settings.language = language;
    await this.i18nManager.setLanguage(language);
    await this.saveUserSettings();
    
    // Mettre à jour tous les composants
    for (const component of this.components.values()) {
      if (component.updateLanguage) {
        component.updateLanguage(language);
      }
    }
  }

  /**
   * Change le thème de l'application
   */
  private async changeTheme(theme: Theme): Promise<void> {
    this.settings.theme = theme;
    await this.themeManager.setTheme(theme);
    await this.saveUserSettings();
  }

  /**
   * Gère le redimensionnement de la fenêtre
   */
  private handleResize(): void {
    // Débounce pour éviter trop d'appels
    clearTimeout((this as any).resizeTimeout);
    (this as any).resizeTimeout = setTimeout(() => {
      for (const component of this.components.values()) {
        if (component.handleResize) {
          component.handleResize();
        }
      }
    }, 250);
  }

  /**
   * Gère le changement de visibilité de la page
   */
  private handleVisibilityChange(): void {
    const isVisible = !document.hidden;
    
    for (const component of this.components.values()) {
      if (component.handleVisibilityChange) {
        component.handleVisibilityChange(isVisible);
      }
    }
  }

  /**
   * Met à jour les paramètres d'animation
   */
  private updateAnimationSettings(): void {
    document.documentElement.style.setProperty(
      '--animation-duration',
      this.settings.reducedMotion ? '0.01ms' : '300ms'
    );
    
    document.documentElement.classList.toggle(
      'reduce-motion',
      this.settings.reducedMotion
    );
  }

  /**
   * Charge les paramètres utilisateur depuis le localStorage
   */
  private async loadUserSettings(): Promise<void> {
    try {
      const saved = localStorage.getItem('portfolio-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.settings = { ...this.settings, ...settings };
        Logger.debug('📱 Paramètres utilisateur chargés:', this.settings);
      }
    } catch (error) {
      Logger.warn('⚠️ Erreur lors du chargement des paramètres:', error);
    }
  }

  /**
   * Sauvegarde les paramètres utilisateur dans le localStorage
   */
  private async saveUserSettings(): Promise<void> {
    try {
      localStorage.setItem('portfolio-settings', JSON.stringify(this.settings));
      Logger.debug('💾 Paramètres sauvegardés');
    } catch (error) {
      Logger.warn('⚠️ Erreur lors de la sauvegarde des paramètres:', error);
    }
  }
}