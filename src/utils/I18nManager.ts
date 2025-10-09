/**
 * Gestionnaire d'internationalisation pour le portfolio
 * Gère les traductions et le changement de langue
 */

import type { Language, TranslationKey } from '../types/index.js';
import { getTranslation } from '../data/translations.js';
import { Logger } from './logger.js';

export class I18nManager {
  private currentLanguage: Language;
  private observers: Set<(language: Language) => void> = new Set();

  constructor(initialLanguage: Language = 'fr') {
    this.currentLanguage = initialLanguage;
  }

  /**
   * Initialise le gestionnaire d'i18n
   */
  async init(): Promise<void> {
    Logger.info('🌍 Initialisation du gestionnaire i18n');

    // Charger la langue sauvegardée
    const savedLanguage = this.loadLanguage();
    if (savedLanguage !== this.currentLanguage) {
      this.currentLanguage = savedLanguage;
    }

    // Appliquer la langue au DOM
    this.applyLanguage();

    // Mettre à jour tous les éléments traduits
    this.updateTranslations();

    Logger.debug(`✅ I18n initialisé avec la langue: ${this.currentLanguage}`);
  }

  /**
   * Définit la langue actuelle
   */
  async setLanguage(language: Language): Promise<void> {
    if (this.currentLanguage === language) return;

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // Appliquer au DOM
    this.applyLanguage();

    // Mettre à jour les traductions
    this.updateTranslations();

    // Sauvegarder
    this.saveLanguage();

    // Notifier les observateurs
    this.notifyObservers(language);

    // Dispatcher l'événement
    this.dispatchLanguageChange(language);

    Logger.debug(`🌍 Langue changée: ${oldLanguage} → ${language}`);
  }

  /**
   * Obtient la langue actuelle
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Obtient une traduction par clé
   */
  t(key: TranslationKey, fallback?: string): string {
    const translation = getTranslation(key as any, this.currentLanguage);
    return translation || fallback || key;
  }

  /**
   * Bascule entre les langues disponibles
   */
  toggleLanguage(): void {
    const newLanguage: Language = this.currentLanguage === 'fr' ? 'en' : 'fr';
    this.setLanguage(newLanguage);
  }

  /**
   * Ajoute un observateur pour les changements de langue
   */
  observe(callback: (language: Language) => void): () => void {
    this.observers.add(callback);
    
    // Retourner une fonction de nettoyage
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Applique la langue au DOM
   */
  private applyLanguage(): void {
    // Mettre à jour l'attribut lang du document
    document.documentElement.lang = this.currentLanguage;

    // Mettre à jour la direction du texte si nécessaire
    // (utile pour l'arabe, l'hébreu, etc.)
    const direction = this.getTextDirection(this.currentLanguage);
    document.documentElement.dir = direction;

    Logger.debug(`🌍 Langue appliquée au DOM: ${this.currentLanguage}`);
  }

  /**
   * Met à jour toutes les traductions dans le DOM
   */
  private updateTranslations(): void {
    // Mettre à jour les éléments avec data-i18n
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    
    elementsWithI18n.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key as TranslationKey);
        
        // Déterminer quel contenu mettre à jour
        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Mettre à jour les attributs avec data-i18n-attr
    const elementsWithI18nAttr = document.querySelectorAll('[data-i18n-attr]');
    
    elementsWithI18nAttr.forEach(element => {
      const attrConfig = element.getAttribute('data-i18n-attr');
      if (attrConfig) {
        try {
          const config = JSON.parse(attrConfig);
          Object.entries(config).forEach(([attr, key]) => {
            const translation = this.t(key as TranslationKey);
            element.setAttribute(attr, translation);
          });
        } catch (error) {
          Logger.warn('⚠️ Erreur lors de la mise à jour des attributs i18n:', error);
        }
      }
    });

    Logger.debug('🔄 Traductions mises à jour dans le DOM');
  }

  /**
   * Obtient la direction du texte pour une langue
   */
  private getTextDirection(_language: Language): 'ltr' | 'rtl' {
    // Pour le moment, toutes nos langues sont LTR
    // À adapter si on ajoute l'arabe, l'hébreu, etc.
    return 'ltr';
  }

  /**
   * Notifie tous les observateurs
   */
  private notifyObservers(language: Language): void {
    this.observers.forEach(callback => {
      try {
        callback(language);
      } catch (error) {
        Logger.warn('⚠️ Erreur dans un observateur i18n:', error);
      }
    });
  }

  /**
   * Dispatche un événement de changement de langue
   */
  private dispatchLanguageChange(language: Language): void {
    const event = new CustomEvent('language-change', {
      detail: { language },
      bubbles: true
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Sauvegarde la langue dans localStorage
   */
  private saveLanguage(): void {
    try {
      localStorage.setItem('portfolio-language', this.currentLanguage);
      Logger.debug('💾 Langue sauvegardée');
    } catch (error) {
      Logger.warn('⚠️ Erreur lors de la sauvegarde de la langue:', error);
    }
  }

  /**
   * Charge la langue depuis localStorage
   */
  private loadLanguage(): Language {
    try {
      const saved = localStorage.getItem('portfolio-language');
      if (saved && ['fr', 'en'].includes(saved)) {
        Logger.debug('📱 Langue chargée depuis localStorage:', saved);
        return saved as Language;
      }
    } catch (error) {
      Logger.warn('⚠️ Erreur lors du chargement de la langue:', error);
    }

    // Détecter la langue du navigateur
    const browserLanguage = this.detectBrowserLanguage();
    Logger.debug('🌐 Langue détectée du navigateur:', browserLanguage);
    
    return browserLanguage;
  }

  /**
   * Détecte la langue préférée du navigateur
   */
  private detectBrowserLanguage(): Language {
    const browserLang = navigator.language.toLowerCase();
    
    // Vérifier les langues supportées
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('en')) return 'en';
    
    // Par défaut, français
    return 'fr';
  }

  /**
   * Formate un nombre selon la locale
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * Formate une date selon la locale
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  /**
   * Formate une durée relative (ex: "il y a 2 jours")
   */
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    const locale = this.currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    return rtf.format(value, unit);
  }
}