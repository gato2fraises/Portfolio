/**
 * Configuration centralisée du portfolio
 * Constantes et paramètres globaux
 */

export const APP_CONFIG = {
  // Informations de base
  name: 'Dylan Carion Portfolio',
  version: '3.0.0',
  author: 'Dylan Carion',
  description: 'Portfolio professionnel de Dylan Carion - Développeur Web Junior BTS SIO SLAM',
  
  // URLs et liens
  urls: {
    github: 'https://github.com/gato2fraises/Portfolio',
    demo: 'https://gato2fraises.github.io/Portfolio',
    repository: 'https://github.com/gato2fraises/Portfolio'
  },
  
  // Configuration de développement
  dev: {
    port: 3000,
    hmr: true,
    sourcemap: true
  },
  
  // Configuration de production
  prod: {
    minify: true,
    sourcemap: true,
    base: '/Portfolio/'
  },
  
  // Thèmes disponibles
  themes: ['light', 'dark', 'auto'] as const,
  
  // Langues supportées
  languages: ['fr', 'en'] as const,
  
  // Configuration par défaut
  defaults: {
    language: 'fr' as const,
    theme: 'auto' as const,
    animationsEnabled: true,
    reducedMotion: false
  },
  
  // Métadonnées SEO
  seo: {
    keywords: [
      'Dylan Carion',
      'développeur web',
      'BTS SIO SLAM',
      'portfolio',
      'alternance',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS'
    ],
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image'
  },
  
  // Configuration des animations
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  // Breakpoints responsive
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
} as const;

// Types dérivés de la configuration
export type Theme = typeof APP_CONFIG.themes[number];
export type Language = typeof APP_CONFIG.languages[number];
export type AppTheme = Theme;
export type AppLanguage = Language;