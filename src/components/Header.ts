/**
 * Composant Header du portfolio
 * Gère la navigation principale, le logo et les contrôles
 */

import type { Language, Theme } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Header {
  private element: HTMLElement;
  private isMenuOpen: boolean = false;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Initialise le composant Header
   */
  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation du Header');
    
    this.render();
    this.attachEventListeners();
    this.setupScrollEffect();
    
    Logger.debug('✅ Header initialisé');
  }

  /**
   * Rend le contenu du header
   */
  private render(): void {
    this.element.innerHTML = `
      <div class="header-container">
        <div class="header-content">
          <!-- Logo et nom -->
          <div class="header-brand">
            <img src="/images/Logo Afip.jpg" alt="Dylan Carion" class="brand-logo">
            <div class="brand-text">
              <h1 class="brand-name" data-i18n="hero.name">Dylan Carion</h1>
              <p class="brand-subtitle" data-i18n="hero.title">Développeur Web Junior</p>
            </div>
          </div>

          <!-- Navigation principale -->
          <nav class="header-nav" role="navigation" aria-label="Navigation principale">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#/" class="nav-link" data-i18n="nav.home">Accueil</a>
              </li>
              <li class="nav-item">
                <a href="#/about" class="nav-link" data-i18n="nav.about">À propos</a>
              </li>
              <li class="nav-item">
                <a href="#/projects" class="nav-link" data-i18n="nav.projects">Projets</a>
              </li>
              <li class="nav-item">
                <a href="#/skills" class="nav-link" data-i18n="nav.skills">Compétences</a>
              </li>
              <li class="nav-item">
                <a href="#/experience" class="nav-link" data-i18n="nav.experience">Expérience</a>
              </li>
              <li class="nav-item">
                <a href="#/contact" class="nav-link" data-i18n="nav.contact">Contact</a>
              </li>
            </ul>
          </nav>

          <!-- Contrôles -->
          <div class="header-controls">
            <!-- Sélecteur de langue -->
            <div class="language-selector">
              <button class="language-btn" type="button" aria-label="Changer de langue">
                <span class="language-current">FR</span>
                <svg class="language-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12l-4-4h8l-4 4z"/>
                </svg>
              </button>
              <div class="language-dropdown">
                <button class="language-option" data-lang="fr">
                  <span class="language-flag">🇫🇷</span>
                  <span>Français</span>
                </button>
                <button class="language-option" data-lang="en">
                  <span class="language-flag">🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>

            <!-- Sélecteur de thème -->
            <button class="theme-toggle" type="button" aria-label="Changer de thème">
              <svg class="theme-icon theme-icon-light" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm4.24 2.34a1 1 0 010 1.42l-.71.71a1 1 0 11-1.42-1.42l.71-.71a1 1 0 011.42 0zm2.83 3.66a1 1 0 100-2H16a1 1 0 100 2h1.07zm-2.83 3.66a1 1 0 01-1.42 0l-.71-.71a1 1 0 111.42-1.42l.71.71a1 1 0 010 1.42zM10 17a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-4.24-2.34a1 1 0 010-1.42l.71-.71a1 1 0 011.42 1.42l-.71.71a1 1 0 01-1.42 0zM3 10a1 1 0 100 2h1a1 1 0 100-2H3zm2.24-4.24a1 1 0 011.42 0l.71.71a1 1 0 01-1.42 1.42l-.71-.71a1 1 0 010-1.42z"/>
              </svg>
              <svg class="theme-icon theme-icon-dark" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.218 4.162a1 1 0 01.168 1.116 5.002 5.002 0 005.336 5.336 1 1 0 011.116.168 1 1 0 01.225 1.024c-.8 2.736-3.282 4.724-6.063 4.724-3.59 0-6.5-2.91-6.5-6.5 0-2.781 1.988-5.263 4.724-6.063a1 1 0 01.994.195z"/>
              </svg>
            </button>

            <!-- Menu burger pour mobile -->
            <button class="mobile-menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attache les event listeners
   */
  private attachEventListeners(): void {
    // Navigation
    const navLinks = this.element.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Sélecteur de langue
    const languageBtn = this.element.querySelector('.language-btn');
    const languageOptions = this.element.querySelectorAll('.language-option');
    
    languageBtn?.addEventListener('click', this.toggleLanguageDropdown.bind(this));
    languageOptions.forEach(option => {
      option.addEventListener('click', this.handleLanguageChange.bind(this));
    });

    // Toggle de thème
    const themeToggle = this.element.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', this.handleThemeToggle.bind(this));

    // Menu mobile
    const mobileToggle = this.element.querySelector('.mobile-menu-toggle');
    mobileToggle?.addEventListener('click', this.toggleMobileMenu.bind(this));

    // Fermer les dropdowns en cliquant ailleurs
    document.addEventListener('click', this.handleDocumentClick.bind(this));

    // Écouter les changements de route
    document.addEventListener('route-change', this.handleRouteChange.bind(this));
  }

  /**
   * Configure l'effet de défilement du header
   */
  private setupScrollEffect(): void {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ajouter la classe "scrolled" après 50px de défilement
      if (currentScrollY > 50) {
        this.element.classList.add('scrolled');
      } else {
        this.element.classList.remove('scrolled');
      }

      // Masquer/afficher le header selon la direction du défilement
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.element.classList.add('hidden');
      } else {
        this.element.classList.remove('hidden');
      }

      lastScrollY = currentScrollY;
    };

    // Throttle pour les performances
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Gère les clics sur la navigation
   */
  private handleNavClick(event: Event): void {
    event.preventDefault();
    const link = event.currentTarget as HTMLAnchorElement;
    const href = link.getAttribute('href');
    
    if (href) {
      // Fermer le menu mobile si ouvert
      this.closeMobileMenu();
      
      // Naviguer vers la route
      window.location.hash = href.substring(1);
    }
  }

  /**
   * Toggle du dropdown de langue
   */
  private toggleLanguageDropdown(): void {
    const dropdown = this.element.querySelector('.language-dropdown');
    const btn = this.element.querySelector('.language-btn');
    
    dropdown?.classList.toggle('open');
    btn?.setAttribute('aria-expanded', dropdown?.classList.contains('open') ? 'true' : 'false');
  }

  /**
   * Gère le changement de langue
   */
  private handleLanguageChange(event: Event): void {
    const option = event.currentTarget as HTMLButtonElement;
    const lang = option.getAttribute('data-lang') as Language;
    
    if (lang) {
      // Dispatcher l'événement de changement de langue
      const changeEvent = new CustomEvent('language-change', {
        detail: { language: lang },
        bubbles: true
      });
      document.dispatchEvent(changeEvent);
      
      // Mettre à jour l'affichage
      this.updateLanguageDisplay(lang);
      
      // Fermer le dropdown
      this.element.querySelector('.language-dropdown')?.classList.remove('open');
    }
  }

  /**
   * Gère le toggle de thème
   */
  private handleThemeToggle(): void {
    const changeEvent = new CustomEvent('theme-change', {
      detail: { theme: 'toggle' as Theme },
      bubbles: true
    });
    document.dispatchEvent(changeEvent);
  }

  /**
   * Toggle du menu mobile
   */
  private toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    const nav = this.element.querySelector('.header-nav');
    const toggle = this.element.querySelector('.mobile-menu-toggle');
    
    nav?.classList.toggle('open', this.isMenuOpen);
    toggle?.classList.toggle('open', this.isMenuOpen);
    toggle?.setAttribute('aria-expanded', this.isMenuOpen ? 'true' : 'false');
    
    // Prévenir le défilement du body quand le menu est ouvert
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  /**
   * Ferme le menu mobile
   */
  private closeMobileMenu(): void {
    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Gère les clics sur le document pour fermer les dropdowns
   */
  private handleDocumentClick(event: Event): void {
    const target = event.target as Element;
    
    // Fermer le dropdown de langue si on clique ailleurs
    if (!target.closest('.language-selector')) {
      this.element.querySelector('.language-dropdown')?.classList.remove('open');
    }
  }

  /**
   * Gère les changements de route pour mettre à jour la navigation active
   */
  private handleRouteChange(event: any): void {
    const path = event.detail.path;
    
    // Enlever la classe active de tous les liens
    this.element.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Ajouter la classe active au lien correspondant
    const activeLink = this.element.querySelector(`[href="#${path}"]`);
    activeLink?.classList.add('active');
  }

  /**
   * Met à jour l'affichage de la langue
   */
  private updateLanguageDisplay(language: Language): void {
    const current = this.element.querySelector('.language-current');
    if (current) {
      current.textContent = language.toUpperCase();
    }
  }

  /**
   * Met à jour la langue du composant
   */
  updateLanguage(language: Language): void {
    this.updateLanguageDisplay(language);
    Logger.debug(`🌍 Header: langue mise à jour vers ${language}`);
  }

  /**
   * Gère le redimensionnement
   */
  handleResize(): void {
    // Fermer le menu mobile sur redimensionnement vers desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
}