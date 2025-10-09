/**
 * Point d'entrée principal du Portfolio Dylan Carion
 * Application moderne en TypeScript avec architecture modulaire
 */

import './styles/main.css';
import { App } from './components/index.js';
import { Logger } from './utils/index.js';

/**
 * Initialisation de l'application
 */
async function init(): Promise<void> {
  try {
    Logger.info('🚀 Initialisation du Portfolio Dylan Carion');
    
    // Vérifier que le DOM est prêt
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
    
    // Initialiser l'application principale
    const app = new App();
    await app.init();
    
    Logger.info('✅ Application initialisée avec succès');
    
  } catch (error) {
    Logger.error('❌ Erreur lors de l\'initialisation:', error);
    
    // Afficher un message d'erreur à l'utilisateur
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: system-ui, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div>
          <h1 style="color: #ef4444; margin-bottom: 1rem;">
            Erreur de chargement
          </h1>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">
            Une erreur est survenue lors du chargement du portfolio.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Recharger la page
          </button>
        </div>
      </div>
    `;
  }
}

// Démarrer l'application
init();