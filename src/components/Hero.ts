/**
 * Composant Hero du portfolio
 * Section d'accueil avec présentation principale
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Hero {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Initialise le composant Hero
   */
  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation du Hero');
    
    this.render();
    this.attachEventListeners();
    this.setupAnimations();
    
    Logger.debug('✅ Hero initialisé');
  }

  /**
   * Rend le contenu du hero
   */
  private render(): void {
    this.element.innerHTML = `
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <p class="hero-greeting" data-i18n="hero.greeting">Salut, je suis</p>
            <h1 class="hero-name" data-i18n="hero.name">Dylan Carion</h1>
            <h2 class="hero-title" data-i18n="hero.title">Développeur Web Junior</h2>
            <p class="hero-subtitle" data-i18n="hero.subtitle">
              Étudiant BTS SIO SLAM passionné par le développement web moderne
            </p>
            
            <div class="hero-actions">
              <a href="#/projects" class="btn btn-primary" data-i18n="hero.cta">
                Voir mes projets
              </a>
              <a href="#/contact" class="btn btn-outline" data-i18n="hero.ctaSecondary">
                Me contacter
              </a>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="hero-image-container">
              <img 
                src="/images/bonhomme.png" 
                alt="Dylan Carion - Développeur Web" 
                class="hero-image"
                loading="eager"
              >
              <div class="hero-decoration">
                <div class="decoration-circle"></div>
                <div class="decoration-dots"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="hero-scroll-indicator">
          <div class="scroll-indicator">
            <span class="scroll-text" data-i18n="common.scroll">Défiler</span>
            <div class="scroll-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5l-5-5h10l-5 5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attache les event listeners
   */
  private attachEventListeners(): void {
    // Boutons d'action
    const actionButtons = this.element.querySelectorAll('.btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', this.handleActionClick.bind(this));
    });

    // Indicateur de défilement
    const scrollIndicator = this.element.querySelector('.scroll-indicator');
    scrollIndicator?.addEventListener('click', this.handleScrollClick.bind(this));

    // Parallax sur défilement
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  /**
   * Configure les animations d'entrée
   */
  private setupAnimations(): void {
    // Animation d'apparition des éléments
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observer les éléments à animer
    const animatedElements = this.element.querySelectorAll(
      '.hero-greeting, .hero-name, .hero-title, .hero-subtitle, .hero-actions, .hero-image'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    // Animation du texte caractère par caractère
    this.animateTypewriter();
  }

  /**
   * Animation machine à écrire pour le nom
   */
  private animateTypewriter(): void {
    const nameElement = this.element.querySelector('.hero-name');
    if (!nameElement) return;

    const text = nameElement.textContent || '';
    nameElement.textContent = '';
    nameElement.classList.add('typewriter');

    let i = 0;
    const typeInterval = setInterval(() => {
      nameElement.textContent += text.charAt(i);
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
        nameElement.classList.remove('typewriter');
        nameElement.classList.add('typewriter-complete');
      }
    }, 100);
  }

  /**
   * Gère les clics sur les boutons d'action
   */
  private handleActionClick(event: Event): void {
    const btn = event.currentTarget as HTMLAnchorElement;
    const href = btn.getAttribute('href');
    
    if (href?.startsWith('#/')) {
      event.preventDefault();
      window.location.hash = href.substring(1);
    }
  }

  /**
   * Gère le clic sur l'indicateur de défilement
   */
  private handleScrollClick(): void {
    const nextSection = document.querySelector('.about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Gère l'effet parallax au défilement
   */
  private handleScroll(): void {
    const scrollY = window.scrollY;
    const heroHeight = this.element.offsetHeight;
    
    // Effet parallax uniquement si on est dans la section hero
    if (scrollY < heroHeight) {
      const parallaxFactor = scrollY * 0.5;
      
      const heroImage = this.element.querySelector('.hero-image') as HTMLElement;
      const heroDecoration = this.element.querySelector('.hero-decoration') as HTMLElement;
      
      if (heroImage) {
        heroImage.style.transform = `translateY(${parallaxFactor}px)`;
      }
      
      if (heroDecoration) {
        heroDecoration.style.transform = `translateY(${parallaxFactor * 0.3}px)`;
      }

      // Fade out de l'indicateur de défilement
      const scrollIndicator = this.element.querySelector('.hero-scroll-indicator') as HTMLElement;
      if (scrollIndicator) {
        const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.5)));
        scrollIndicator.style.opacity = opacity.toString();
      }
    }
  }

  /**
   * Met à jour la langue du composant
   */
  updateLanguage(language: Language): void {
    Logger.debug(`🌍 Hero: langue mise à jour vers ${language}`);
    // Les traductions sont gérées automatiquement par le système i18n
  }

  /**
   * Gère les changements de visibilité
   */
  handleVisibilityChange(isVisible: boolean): void {
    if (isVisible) {
      // Reprendre les animations si nécessaire
      this.resumeAnimations();
    } else {
      // Suspendre les animations pour économiser les ressources
      this.pauseAnimations();
    }
  }

  /**
   * Reprend les animations
   */
  private resumeAnimations(): void {
    // Reprendre les animations CSS si elles étaient en pause
    const animatedElements = this.element.querySelectorAll('[style*="animation-play-state"]');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'running';
    });
  }

  /**
   * Met en pause les animations
   */
  private pauseAnimations(): void {
    // Mettre en pause les animations CSS pour économiser les ressources
    const animatedElements = this.element.querySelectorAll('.animate-in, .hero-decoration');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
    });
  }
}