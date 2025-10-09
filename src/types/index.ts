/**
 * Types principaux pour le portfolio Dylan Carion
 */

// Types de base
export type Language = 'fr' | 'en';
export type Theme = 'light' | 'dark' | 'auto';

// Types pour les traductions
export type TranslationKey = string;

// Types de contenu
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: ProjectCategory;
}

export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'game' | 'other';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  location: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools' | 'soft';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Types d'interface
export interface ComponentState {
  isVisible: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

// Types d'événements
export interface CustomEventMap {
  'language-change': CustomEvent<{ language: Language }>;
  'theme-change': CustomEvent<{ theme: Theme }>;
  'section-view': CustomEvent<{ section: string }>;
  'project-view': CustomEvent<{ projectId: string }>;
}

// Types de navigation
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

// Type pour les métadonnées
export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// Types de contact
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}