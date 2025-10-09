/**
 * Index des données - Export centralisé
 * Contenu et configuration du portfolio
 */

export { projects, experiences, education, skills, contactInfo } from './portfolio.js';
export { translations, getTranslation } from './translations.js';

// Types de données
export type { 
  Project, 
  Experience, 
  Education, 
  Skill, 
  ContactInfo 
} from '../types/index.js';