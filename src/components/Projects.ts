/**
 * Composant Projects du portfolio
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Projects {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation des Projects');
    this.element.innerHTML = `
      <div class="projects-container">
        <h2 data-i18n="projects.title">Mes Projets</h2>
        <p>Section en cours de développement...</p>
      </div>
    `;
    Logger.debug('✅ Projects initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}