/**
 * Composant Footer du portfolio
 */

import type { Language } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class Footer {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  async init(): Promise<void> {
    Logger.debug('🏗️ Initialisation du Footer');
    this.element.innerHTML = `
      <div class="footer-container">
        <p data-i18n="footer.copyright">© 2025 Dylan Carion. Tous droits réservés.</p>
        <p data-i18n="footer.madeWith">Fait avec ❤️ et TypeScript</p>
      </div>
    `;
    Logger.debug('✅ Footer initialisé');
  }

  updateLanguage(_language: Language): void {
    // À implémenter
  }
}