/**
 * Constantes globales du portfolio
 * Valeurs fixes utilisées dans l'application
 */

// Informations personnelles
export const PERSONAL_INFO = {
  name: 'Dylan Carion',
  title: 'Développeur Web Junior',
  subtitle: 'BTS SIO SLAM',
  email: 'contact@dylancarion.dev',
  location: 'France',
  availability: 'Recherche alternance - Septembre 2025'
} as const;

// Réseaux sociaux et liens
export const SOCIAL_LINKS = {
  github: 'https://github.com/gato2fraises',
  linkedin: 'https://linkedin.com/in/dylancarion',
  portfolio: 'https://gato2fraises.github.io/Portfolio'
} as const;

// Métadonnées
export const META_DATA = {
  keywords: [
    'Dylan Carion',
    'développeur web',
    'BTS SIO SLAM',
    'alternance',
    'TypeScript',
    'JavaScript',
    'portfolio'
  ],
  description: 'Portfolio professionnel de Dylan Carion - Développeur Web Junior en BTS SIO SLAM, recherche alternance en développement web pour septembre 2025.',
  ogImage: '/images/og-image.jpg'
} as const;

// Configuration des animations
export const ANIMATION_CONFIG = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  easings: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)'
  }
} as const;

// Breakpoints responsive
export const BREAKPOINTS = {
  mobile: '475px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const;

// Configuration des logs
export const LOG_CONFIG = {
  levels: ['debug', 'info', 'warn', 'error'] as const,
  colors: {
    debug: '#6b7280',
    info: '#3b82f6',
    warn: '#f59e0b',
    error: '#ef4444'
  }
} as const;