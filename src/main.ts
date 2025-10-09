// Import du CSS principal
import './style.css'

// Interface pour les éléments animés
interface AnimatedElement extends HTMLElement {
  dataset: DOMStringMap & {
    progress?: string;
  };
}

// Classe principale pour gérer le portfolio
class Portfolio {
  private header: HTMLElement | null = null;
  private navToggle: HTMLElement | null = null;
  private navLinks: HTMLElement | null = null;
  private skillBars: NodeListOf<AnimatedElement> | null = null;
  private contactForm: HTMLFormElement | null = null;
  private themeToggle: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    this.setupElements();
    this.setupTheme();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupSkillsAnimation();
    this.setupContactForm();
    this.setupSmoothScrolling();
    this.setupTypewriter();
  }

  private setupElements(): void {
    this.header = document.querySelector('.header');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navLinks = document.querySelector('.nav__links');
    this.skillBars = document.querySelectorAll('.skill__progress');
    this.contactForm = document.querySelector('.contact__form') as HTMLFormElement;
    this.themeToggle = document.querySelector('.theme-toggle');
  }

  private setupTheme(): void {
    // Récupérer le thème sauvegardé ou utiliser le thème système
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    // Appliquer le thème initial
    this.setTheme(initialTheme);
    
    // Écouter les changements de thème
    this.themeToggle?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    });
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  private setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Mettre à jour l'icône du bouton
    const icon = this.themeToggle?.querySelector('svg');
    if (icon) {
      icon.innerHTML = theme === 'dark' 
        ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }

  private setupTypewriter(): void {
    const typewriterElement = document.querySelector('.hero__typewriter');
    if (!typewriterElement) return;

    const texts = ['Développeur Full-Stack', 'Créateur d\'expériences', 'Passionné de code'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentText.length) {
        speed = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }

      setTimeout(type, speed);
    };

    type();
  }

  private setupNavigation(): void {
    // Toggle menu mobile
    this.navToggle?.addEventListener('click', () => {
      this.navLinks?.classList.toggle('nav__links--open');
      this.navToggle?.classList.toggle('nav__toggle--open');
    });

    // Fermer le menu lors du clic sur un lien
    const navLinksElements = document.querySelectorAll('.nav__link');
    navLinksElements.forEach(link => {
      link.addEventListener('click', () => {
        this.navLinks?.classList.remove('nav__links--open');
        this.navToggle?.classList.remove('nav__toggle--open');
      });
    });

    // Activer le lien de navigation correspondant à la section visible
    this.updateActiveNavLink();
    window.addEventListener('scroll', () => this.updateActiveNavLink());
  }

  private updateActiveNavLink(): void {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      
      if (window.scrollY >= sectionTop - 100) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('nav__link--active');
      }
    });
  }

  private setupScrollEffects(): void {
    // Header avec effet de transparence
    const updateHeaderBackground = () => {
      if (!this.header) return;
      
      if (window.scrollY > 50) {
        this.header.classList.add('header--scrolled');
      } else {
        this.header.classList.remove('header--scrolled');
      }
    };

    window.addEventListener('scroll', updateHeaderBackground);
    updateHeaderBackground();

    // Animation d'apparition des éléments au scroll
    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category, .stat');
    elementsToAnimate.forEach(el => observer.observe(el));
  }

  private setupSkillsAnimation(): void {
    const skillsSection = document.querySelector('#skills');
    
    if (!skillsSection || !this.skillBars) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillBars();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
  }

  private animateSkillBars(): void {
    if (!this.skillBars) return;

    this.skillBars.forEach((bar, index) => {
      const progress = bar.dataset.progress || '0';
      
      setTimeout(() => {
        bar.style.width = `${progress}%`;
      }, index * 100);
    });
  }

  private setupContactForm(): void {
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  private handleFormSubmission(): void {
    const formData = new FormData(this.contactForm!);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };

    // Validation simple
    if (!data.name || !data.email || !data.message) {
      this.showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!this.isValidEmail(data.email)) {
      this.showNotification('Veuillez entrer un email valide', 'error');
      return;
    }

    // Simulation d'envoi (à remplacer par une vraie API)
    this.showNotification('Message envoyé avec succès !', 'success');
    this.contactForm?.reset();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    // Créer et afficher une notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => notification.classList.add('notification--show'), 100);
    
    // Suppression automatique
    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  private setupSmoothScrolling(): void {
    // Smooth scroll pour les liens d'ancrage
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          const headerHeight = this.header?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }
}

// Utilitaires
class Utils {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    content?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  }
}

// Initialisation de l'application
new Portfolio();

// Export pour utilisation externe si nécessaire
export { Portfolio, Utils };