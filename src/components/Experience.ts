/**
 * Composant Experience du portfolio
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Experience {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation de Experience');
    this.element.innerHTML = `
      <div class="experience-container">
        <h2 data-i18n="experience.title">Expérience</h2>
        <p>Section en cours de développement...</p>
      </div>
    `;
    Logger.debug('✅ Experience initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}