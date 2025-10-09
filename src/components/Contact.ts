/**
 * Composant Contact du portfolio
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Contact {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation du Contact');
    this.element.innerHTML = `
      <div class="contact-container">
        <h2 data-i18n="contact.title">Contactez-moi</h2>
        <p>Section en cours de développement...</p>
      </div>
    `;
    Logger.debug('✅ Contact initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}