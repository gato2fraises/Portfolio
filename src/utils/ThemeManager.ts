/**
 * Gestionnaire de thèmes pour le portfolio
 * Gère les thèmes clair/sombre et les transitions
 */

import type { Theme } from '../types/index.js';
import { Logger } from './logger.js';

export class ThemeManager {
  private currentTheme: Theme;
  private systemTheme: 'light' | 'dark' = 'light';

  constructor(initialTheme: Theme = 'auto') {
    this.currentTheme = initialTheme;
  }

  /**
   * Initialise le gestionnaire de thèmes
   */
  async init(): Promise<void> {
    Logger.info('🎨 Initialisation du gestionnaire de thèmes');

    // Détecter le thème système
    this.detectSystemTheme();

    // Appliquer le thème initial
    this.applyTheme();

    // Écouter les changements de thème système
    this.watchSystemTheme();

    Logger.debug('✅ Gestionnaire de thèmes initialisé');
  }

  /**
   * Définit le thème actuel
   */
  setTheme(theme: Theme): void {
    const oldTheme = this.currentTheme;
    this.currentTheme = theme;

    if (oldTheme !== theme) {
      this.applyTheme();
      this.dispatchThemeChange(theme);
      Logger.debug(`🎨 Thème changé: ${oldTheme} → ${theme}`);
    }
  }

  /**
   * Obtient le thème actuel
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Obtient le thème effectif (résout 'auto')
   */
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      return this.systemTheme;
    }
    return this.currentTheme;
  }

  /**
   * Bascule entre les thèmes
   */
  toggleTheme(): void {
    const currentEffective = this.getEffectiveTheme();
    const newTheme: Theme = currentEffective === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Détecte le thème système
   */
  private detectSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemTheme = mediaQuery.matches ? 'dark' : 'light';
    Logger.debug(`🖥️ Thème système détecté: ${this.systemTheme}`);
  }

  /**
   * Surveille les changements de thème système
   */
  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      this.systemTheme = e.matches ? 'dark' : 'light';
      Logger.debug(`🖥️ Changement de thème système: ${this.systemTheme}`);
      
      // Si on est en mode auto, appliquer le nouveau thème
      if (this.currentTheme === 'auto') {
        this.applyTheme();
        this.dispatchThemeChange('auto');
      }
    });
  }

  /**
   * Applique le thème au DOM
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    const root = document.documentElement;

    // Enlever les anciennes classes de thème
    root.classList.remove('theme-light', 'theme-dark');
    
    // Ajouter la nouvelle classe de thème
    root.classList.add(`theme-${effectiveTheme}`);

    // Mettre à jour l'attribut data-theme pour les sélecteurs CSS
    root.setAttribute('data-theme', effectiveTheme);

    // Mettre à jour la couleur du thème dans le meta tag
    this.updateThemeColorMeta(effectiveTheme);

    Logger.debug(`🎨 Thème appliqué: ${effectiveTheme}`);
  }

  /**
   * Met à jour la couleur du thème dans le meta tag
   */
  private updateThemeColorMeta(theme: 'light' | 'dark'): void {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    // Couleurs pour les thèmes
    const colors = {
      light: '#ffffff',
      dark: '#1a1a1a'
    };

    metaThemeColor.setAttribute('content', colors[theme]);
  }

  /**
   * Dispatche un événement de changement de thème
   */
  private dispatchThemeChange(theme: Theme): void {
    const event = new CustomEvent('theme-change', {
      detail: { theme },
      bubbles: true
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Sauvegarde le thème dans localStorage
   */
  saveTheme(): void {
    try {
      localStorage.setItem('portfolio-theme', this.currentTheme);
      Logger.debug('💾 Thème sauvegardé');
    } catch (error) {
      Logger.warn('⚠️ Erreur lors de la sauvegarde du thème:', error);
    }
  }

  /**
   * Charge le thème depuis localStorage
   */
  loadTheme(): Theme {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved && ['light', 'dark', 'auto'].includes(saved)) {
        Logger.debug('📱 Thème chargé depuis localStorage:', saved);
        return saved as Theme;
      }
    } catch (error) {
      Logger.warn('⚠️ Erreur lors du chargement du thème:', error);
    }
    
    return 'auto';
  }
}