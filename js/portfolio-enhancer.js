/**
 * Portfolio Modernisé - JavaScript Avancé
 * Animations, interactions et UX améliorée
 */

class PortfolioEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollIndicator();
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    this.setupParallaxEffects();
    this.setupTypewriterEffect();
    this.setupImageLazyLoading();
    this.setupPerformanceOptimizations();
    this.setupAccessibilityEnhancements();
  }

  // Indicateur de progression de scroll
  setupScrollIndicator() {
    // Créer l'indicateur
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    // Mettre à jour l'indicateur lors du scroll
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      indicator.style.width = scrolled + '%';
    });
  }

  // Animations à l'apparition des éléments
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Animation décalée pour les enfants
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in-delay');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observer tous les éléments avec animation
    document.querySelectorAll('.section-card, .project-item, .skill-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Défilement fluide amélioré
  setupSmoothScrolling() {
    // CSS smooth scroll avec fallback JS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Amélioration pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Effets parallax légers
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length > 0) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach(element => {
          element.style.transform = `translateY(${rate}px)`;
        });
      });
    }
  }

  // Effet machine à écrire pour les titres
  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent)';
      
      let index = 0;
      const typeInterval = setInterval(() => {
        element.textContent += text[index];
        index++;
        
        if (index >= text.length) {
          clearInterval(typeInterval);
          // Faire clignoter le curseur
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 500);
        }
      }, 100);
    });
  }

  // Lazy loading amélioré pour les images
  setupImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Effet de chargement
          img.style.filter = 'blur(5px)';
          img.style.transition = 'filter 0.3s ease';
          
          img.src = img.dataset.src;
          img.onload = () => {
            img.style.filter = 'none';
            img.classList.add('loaded');
          };
          
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Optimisations de performance
  setupPerformanceOptimizations() {
    // Debounce pour les événements de scroll
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Optimiser les animations lors du redimensionnement
    const handleResize = debounce(() => {
      // Recalculer les positions si nécessaire
      this.recalculateAnimations();
    }, 250);

    window.addEventListener('resize', handleResize);

    // Réduire les animations si l'utilisateur préfère
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', 'none');
      document.documentElement.style.setProperty('--transition-normal', 'none');
      document.documentElement.style.setProperty('--transition-slow', 'none');
    }
  }

  // Améliorations d'accessibilité
  setupAccessibilityEnhancements() {
    // Focus visible amélioré
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });

    // Skip link pour la navigation
    this.addSkipLink();

    // Améliorer les annonces pour les lecteurs d'écran
    this.setupScreenReaderAnnouncements();
  }

  // Ajouter un lien de saut pour l'accessibilité
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--accent);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      transition: top 0.3s;
      z-index: 10000;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Annonces pour les lecteurs d'écran
  setupScreenReaderAnnouncements() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(announcer);

    // Annoncer les changements de section
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionTitle = entry.target.querySelector('h2')?.textContent;
          if (sectionTitle) {
            announcer.textContent = `Section: ${sectionTitle}`;
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // Recalculer les animations (pour le redimensionnement)
  recalculateAnimations() {
    // Logique pour recalculer les positions d'animation si nécessaire
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach(el => {
      // Reset et recalcul si nécessaire
    });
  }

  // Méthode utilitaire pour les animations personnalisées
  animateElement(element, keyframes, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    };

    return element.animate(keyframes, { ...defaultOptions, ...options });
  }

  // Gestion des erreurs d'animation
  handleAnimationError(error) {
    console.warn('Animation error:', error);
    // Fallback gracieux sans animations
  }
}

// Utilitaires pour les effets visuels
class VisualEffects {
  static createParticles(container, count = 50) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
        animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(particle);
    }
  }

  static addGlowEffect(element) {
    element.addEventListener('mouseenter', () => {
      element.style.boxShadow = '0 0 20px var(--accent)';
    });

    element.addEventListener('mouseleave', () => {
      element.style.boxShadow = '';
    });
  }

  static rippleEffect(element) {
    element.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioEnhancer();

  // Ajouter des effets aux boutons
  document.querySelectorAll('.cta-button').forEach(button => {
    VisualEffects.rippleEffect(button);
  });

  // Ajouter l'effet de lueur aux cartes importantes
  document.querySelectorAll('.section-card').forEach(card => {
    VisualEffects.addGlowEffect(card);
  });
});

// Style CSS pour l'effet ripple
const rippleCSS = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);