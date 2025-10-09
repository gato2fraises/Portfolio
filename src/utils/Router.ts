/**
 * Routeur simple pour la navigation dans le portfolio SPA
 * Gère la navigation entre les sections et l'historique
 */

import { Logger } from './logger.js';

export interface Route {
  path: string;
  handler: () => void;
  title?: string;
}

export class Router {
  private routes: Map<string, Route> = new Map();
  private currentPath: string = '/';
  private isInitialized: boolean = false;

  constructor() {
    // Bind les méthodes pour les event listeners
    this.handlePopState = this.handlePopState.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  /**
   * Initialise le routeur
   */
  init(): void {
    if (this.isInitialized) return;

    Logger.info('🧭 Initialisation du routeur');

    // Écouter les changements d'historique
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('hashchange', this.handleHashChange);

    // Naviguer vers la route actuelle
    this.navigateToCurrentLocation();

    this.isInitialized = true;
    Logger.debug('✅ Routeur initialisé');
  }

  /**
   * Ajoute une route
   */
  addRoute(path: string, handler: () => void, title?: string): void {
    const route: Route = { path, handler };
    if (title) {
      route.title = title;
    }
    this.routes.set(path, route);
    Logger.debug(`🛤️ Route ajoutée: ${path}`);
  }

  /**
   * Supprime une route
   */
  removeRoute(path: string): void {
    this.routes.delete(path);
    Logger.debug(`🗑️ Route supprimée: ${path}`);
  }

  /**
   * Navigue vers un chemin
   */
  navigate(path: string, pushState: boolean = true): void {
    const route = this.routes.get(path);
    
    if (!route) {
      Logger.warn(`⚠️ Route non trouvée: ${path}`);
      return;
    }

    // Mettre à jour l'historique si nécessaire
    if (pushState && path !== this.currentPath) {
      const title = route.title || document.title;
      window.history.pushState({ path }, title, `#${path}`);
    }

    // Exécuter le handler
    try {
      route.handler();
      this.currentPath = path;
      
      // Mettre à jour le titre si spécifié
      if (route.title) {
        document.title = route.title;
      }

      // Dispatcher un événement de navigation
      this.dispatchNavigationEvent(path);
      
      Logger.debug(`🧭 Navigation vers: ${path}`);
      
    } catch (error) {
      Logger.error(`❌ Erreur lors de la navigation vers ${path}:`, error);
    }
  }

  /**
   * Navigue vers la page précédente
   */
  back(): void {
    window.history.back();
  }

  /**
   * Navigue vers la page suivante
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * Obtient le chemin actuel
   */
  getCurrentPath(): string {
    return this.currentPath;
  }

  /**
   * Vérifie si une route existe
   */
  hasRoute(path: string): boolean {
    return this.routes.has(path);
  }

  /**
   * Obtient toutes les routes
   */
  getRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  /**
   * Navigue vers la section spécifiée avec défilement smooth
   */
  navigateToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Mettre à jour l'URL sans déclencher une navigation
      const path = sectionId === 'hero' ? '/' : `/${sectionId}`;
      window.history.replaceState({ path }, document.title, `#${path}`);
      this.currentPath = path;
      
      Logger.debug(`📍 Défilement vers la section: ${sectionId}`);
    }
  }

  /**
   * Gère les changements d'état de l'historique
   */
  private handlePopState(event: PopStateEvent): void {
    const state = event.state;
    if (state && state.path) {
      this.navigate(state.path, false);
    } else {
      this.navigateToCurrentLocation();
    }
  }

  /**
   * Gère les changements de hash
   */
  private handleHashChange(): void {
    this.navigateToCurrentLocation();
  }

  /**
   * Navigue vers la location actuelle
   */
  private navigateToCurrentLocation(): void {
    const hash = window.location.hash;
    const path = hash ? hash.substring(1) : '/';
    
    if (this.routes.has(path)) {
      this.navigate(path, false);
    } else {
      // Route par défaut
      this.navigate('/', false);
    }
  }

  /**
   * Dispatche un événement de navigation
   */
  private dispatchNavigationEvent(path: string): void {
    const event = new CustomEvent('route-change', {
      detail: { path },
      bubbles: true
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Nettoie les event listeners
   */
  destroy(): void {
    if (!this.isInitialized) return;

    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('hashchange', this.handleHashChange);
    
    this.routes.clear();
    this.isInitialized = false;
    
    Logger.debug('🧹 Routeur nettoyé');
  }
}