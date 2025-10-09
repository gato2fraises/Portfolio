import type { Language } from '../types/index.js';

/**
 * Système de traductions pour le portfolio
 */
export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      about: 'À propos',
      projects: 'Projets',
      skills: 'Compétences',
      experience: 'Expérience',
      contact: 'Contact',
      cv: 'CV'
    },
    
    // Héros / Accueil
    hero: {
      greeting: 'Salut, je suis',
      name: 'Dylan Carion',
      title: 'Développeur Web Junior',
      subtitle: 'Étudiant BTS SIO SLAM passionné par le développement web moderne',
      cta: 'Voir mes projets',
      ctaSecondary: 'Me contacter'
    },
    
    // À propos
    about: {
      title: 'À propos de moi',
      description: 'Étudiant passionné en BTS SIO SLAM, je me spécialise dans le développement web moderne. J\'aime créer des expériences utilisateur engageantes et apprendre de nouvelles technologies.',
      availability: 'Recherche d\'alternance',
      location: 'France'
    },
    
    // Projets
    projects: {
      title: 'Mes Projets',
      subtitle: 'Voici quelques-uns de mes projets récents',
      viewDemo: 'Voir la démo',
      viewCode: 'Voir le code',
      featured: 'Projet phare'
    },
    
    // Compétences
    skills: {
      title: 'Compétences',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Base de données',
      tools: 'Outils',
      soft: 'Soft Skills',
      levels: {
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        advanced: 'Avancé',
        expert: 'Expert'
      }
    },
    
    // Expérience
    experience: {
      title: 'Expérience',
      education: 'Formation',
      current: 'Actuel'
    },
    
    // Contact
    contact: {
      title: 'Contactez-moi',
      subtitle: 'N\'hésitez pas à me contacter pour discuter d\'opportunités',
      form: {
        name: 'Nom',
        email: 'Email',
        subject: 'Sujet',
        message: 'Message',
        send: 'Envoyer',
        sending: 'Envoi en cours...',
        success: 'Message envoyé avec succès !',
        error: 'Erreur lors de l\'envoi du message'
      }
    },
    
    // Footer
    footer: {
      copyright: '© 2025 Dylan Carion. Tous droits réservés.',
      madeWith: 'Fait avec ❤️ et TypeScript'
    },
    
    // Commun
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer',
      close: 'Fermer'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      experience: 'Experience',
      contact: 'Contact',
      cv: 'Resume'
    },
    
    // Hero / Home
    hero: {
      greeting: 'Hi, I\'m',
      name: 'Dylan Carion',
      title: 'Junior Web Developer',
      subtitle: 'BTS SIO SLAM student passionate about modern web development',
      cta: 'View my projects',
      ctaSecondary: 'Contact me'
    },
    
    // About
    about: {
      title: 'About me',
      description: 'Passionate student in BTS SIO SLAM, I specialize in modern web development. I love creating engaging user experiences and learning new technologies.',
      availability: 'Looking for apprenticeship',
      location: 'France'
    },
    
    // Projects
    projects: {
      title: 'My Projects',
      subtitle: 'Here are some of my recent projects',
      viewDemo: 'View demo',
      viewCode: 'View code',
      featured: 'Featured project'
    },
    
    // Skills
    skills: {
      title: 'Skills',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Database',
      tools: 'Tools',
      soft: 'Soft Skills',
      levels: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert'
      }
    },
    
    // Experience
    experience: {
      title: 'Experience',
      education: 'Education',
      current: 'Current'
    },
    
    // Contact
    contact: {
      title: 'Contact me',
      subtitle: 'Feel free to reach out to discuss opportunities',
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Error sending message'
      }
    },
    
    // Footer
    footer: {
      copyright: '© 2025 Dylan Carion. All rights reserved.',
      madeWith: 'Made with ❤️ and TypeScript'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      close: 'Close'
    }
  }
} as const;

export type TranslationKeys = typeof translations['fr'];
export type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: `${K & string}${'' | `.${NestedKeyOf<T[K]>}`}` }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

/**
 * Obtient une traduction par clé
 */
export function getTranslation(
  key: TranslationKey,
  language: Language = 'fr'
): string {
  const keys = key.split('.');
  let current: any = translations[language];
  
  for (const k of keys) {
    current = current?.[k];
  }
  
  return current || key;
}