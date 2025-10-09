/**
 * Composant Skills du portfolio
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Skills {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation des Skills');
    this.element.innerHTML = `
      <div class="skills-container">
        <h2 data-i18n="skills.title">Compétences</h2>
        <p>Section en cours de développement...</p>
      </div>
    `;
    Logger.debug('✅ Skills initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}