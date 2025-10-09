import type { Project, Experience, Education, Skill, ContactInfo } from '../types/index.js';

/**
 * Données des projets de Dylan Carion
 */
export const projects: Project[] = [
  {
    id: 'portfolio-v3',
    title: 'Portfolio Personnel v3.0',
    description: 'Portfolio moderne et responsive développé en TypeScript avec Vite, animations GSAP et PWA.',
    technologies: ['TypeScript', 'HTML5', 'CSS3', 'GSAP', 'Vite', 'PWA'],
    imageUrl: '/images/Programming_code.jpg',
    demoUrl: 'https://gato2fraises.github.io/Portfolio',
    githubUrl: 'https://github.com/gato2fraises/Portfolio',
    featured: true,
    category: 'web'
  },
  {
    id: 'easter-egg-game',
    title: 'Mini Jeu Plateforme',
    description: 'Jeu de plateforme développé en JavaScript vanilla avec système de collision et animations.',
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3'],
    imageUrl: '/images/bonhomme.png',
    demoUrl: '#',
    featured: false,
    category: 'game'
  }
];

/**
 * Expériences professionnelles
 */
export const experiences: Experience[] = [
  {
    id: 'bts-sio-slam',
    company: 'Formation BTS SIO SLAM',
    position: 'Étudiant en Développement Web',
    startDate: '2023-09',
    description: 'Formation en développement d\'applications web et mobile. Apprentissage des technologies modernes et des bonnes pratiques de développement.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Python'],
    location: 'France'
  }
];

/**
 * Formation et éducation
 */
export const education: Education[] = [
  {
    id: 'bts-sio-slam',
    institution: 'BTS SIO SLAM',
    degree: 'BTS Services Informatiques aux Organisations',
    field: 'Solutions Logicielles et Applications Métiers',
    startDate: '2023-09',
    location: 'France',
    description: 'Spécialisation en développement d\'applications web et mobile'
  }
];

/**
 * Compétences techniques et soft skills
 */
export const skills: Skill[] = [
  // Frontend
  { id: 'html', name: 'HTML5', category: 'frontend', level: 'advanced' },
  { id: 'css', name: 'CSS3', category: 'frontend', level: 'advanced' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', level: 'intermediate' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 'intermediate' },
  
  // Backend
  { id: 'php', name: 'PHP', category: 'backend', level: 'intermediate' },
  { id: 'python', name: 'Python', category: 'backend', level: 'beginner' },
  
  // Base de données
  { id: 'mysql', name: 'MySQL', category: 'database', level: 'intermediate' },
  
  // Outils
  { id: 'git', name: 'Git', category: 'tools', level: 'intermediate' },
  { id: 'vscode', name: 'VS Code', category: 'tools', level: 'advanced' },
  { id: 'vite', name: 'Vite', category: 'tools', level: 'intermediate' },
  
  // Soft skills
  { id: 'teamwork', name: 'Travail d\'équipe', category: 'soft', level: 'advanced' },
  { id: 'problem-solving', name: 'Résolution de problèmes', category: 'soft', level: 'advanced' },
  { id: 'learning', name: 'Apprentissage continu', category: 'soft', level: 'expert' }
];

/**
 * Informations de contact
 */
export const contactInfo: ContactInfo = {
  email: 'contact@dylan-carion.dev',
  location: 'France',
  github: 'https://github.com/gato2fraises',
  website: 'https://gato2fraises.github.io/Portfolio'
};