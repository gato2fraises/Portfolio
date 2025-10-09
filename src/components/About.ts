/**
 * Composant About du portfolio
 * Section présentation personnelle
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class About {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation du About');
    this.element.innerHTML = `
      <div class="about-container">
        <h2 data-i18n="about.title">À propos de moi</h2>
        <p data-i18n="about.description">Section en cours de développement...</p>
      </div>
    `;
    Logger.debug('✅ About initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}