// Gestionnaire principal du portfolio avancé
class PortfolioManager {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initialisation du Portfolio Avancé...');
            
            // Afficher le loader
            this.showLoader();
            
            // Attendre que le DOM soit chargé
            await this.waitForDOMReady();
            
            // Initialiser les composants en parallèle
            await this.initializeComponents();
            
            // Configurer les event listeners globaux
            this.setupGlobalEventListeners();
            
            // Masquer le loader et démarrer les animations
            this.hideLoader();
            
            this.isInitialized = true;
            console.log('✅ Portfolio initialisé avec succès');
            
            // Afficher les stats d'initialisation
            this.showInitStats();
            
        } catch (error) {
            console.error('❌ Erreur initialisation portfolio:', error);
            this.handleInitError(error);
        }
    }

    waitForDOMReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeComponents() {
        const initPromises = [];
        
        // Attendre que les gestionnaires soient disponibles
        initPromises.push(this.waitForComponent('languageManager', 'i18n'));
        initPromises.push(this.waitForComponent('themeManager', 'theme'));
        initPromises.push(this.waitForComponent('analytics', 'analytics'));
        initPromises.push(this.waitForComponent('pwa', 'PWA'));
        initPromises.push(this.waitForComponent('gsapManager', 'GSAP'));
        
        // Attendre que tous les composants soient initialisés
        const results = await Promise.allSettled(initPromises);
        
        // Vérifier les résultats
        results.forEach((result, index) => {
            const componentNames = ['i18n', 'theme', 'analytics', 'PWA', 'GSAP'];
            if (result.status === 'fulfilled') {
                console.log(`✅ ${componentNames[index]} initialisé`);
                this.components.set(componentNames[index], result.value);
            } else {
                console.warn(`⚠️ ${componentNames[index]} non disponible:`, result.reason);
            }
        });
        
        // Initialiser les fonctionnalités spécifiques à la page
        this.initializePageSpecificFeatures();
        
        // Configurer les interactions entre composants
        this.setupComponentInteractions();
    }

    waitForComponent(globalVar, name, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const checkComponent = () => {
                if (window[globalVar]) {
                    resolve(window[globalVar]);
                } else {
                    setTimeout(checkComponent, 100);
                }
            };
            
            checkComponent();
            
            // Timeout de sécurité
            setTimeout(() => {
                if (!window[globalVar]) {
                    reject(new Error(`${name} non chargé dans les ${timeout}ms`));
                }
            }, timeout);
        });
    }

    initializePageSpecificFeatures() {
        // Fonctionnalités spécifiques à chaque page
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initializeHomePage();
                break;
            case 'blog':
                this.initializeBlogPage();
                break;
            case 'contact':
                this.initializeContactPage();
                break;
            case 'cv':
                this.initializeCVPage();
                break;
            case 'projet':
                this.initializeProjectPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    initializeHomePage() {
        // Animations spécifiques à la page d'accueil
        this.setupHeroAnimations();
        this.setupScrollEffects();
        this.setupNavigationEffects();
    }

    initializeBlogPage() {
        // Initialiser le système de blog si disponible
        if (window.blogManager) {
            console.log('📝 Blog système activé');
        }
    }

    initializeContactPage() {
        // Initialiser le formulaire de contact si disponible
        if (window.contactManager) {
            console.log('✉️ Système de contact activé');
        }
    }

    initializeCVPage() {
        // Animations spécifiques au CV
        this.setupCVAnimations();
    }

    initializeProjectPage() {
        // Animations spécifiques aux projets
        this.setupProjectAnimations();
    }

    setupHeroAnimations() {
        if (window.gsapManager) {
            // Animations de la section héro
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
            heroElements.forEach(el => el.classList.add('animate-on-load'));
        }
    }

    setupScrollEffects() {
        // Effet de parallaxe simple si GSAP n'est pas disponible
        if (!window.gsapManager) {
            this.setupFallbackScrollEffects();
        }
    }

    setupFallbackScrollEffects() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    setupNavigationEffects() {
        // Effet de navigation smooth
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll);
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupCVAnimations() {
        // Animations spécifiques pour la page CV
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const percentage = bar.dataset.percent;
            if (percentage) {
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                }, 500);
            }
        });
    }

    setupProjectAnimations() {
        // Animations spécifiques pour les projets
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-on-scroll');
        });
    }

    setupComponentInteractions() {
        // Interactions entre les composants
        this.setupAnalyticsTracking();
        this.setupThemeSync();
        this.setupLanguageSync();
        this.setupPWAIntegration();
    }

    setupAnalyticsTracking() {
        if (window.analytics) {
            // Tracker les changements de thème
            document.addEventListener('themeChanged', (e) => {
                window.analytics.trackEvent('theme_changed', {
                    theme: e.detail.theme
                });
            });
            
            // Tracker les changements de langue
            document.addEventListener('languageChanged', (e) => {
                window.analytics.trackEvent('language_changed', {
                    language: e.detail.language
                });
            });
            
            // Tracker les interactions avec les composants
            document.addEventListener('click', (e) => {
                if (e.target.matches('.btn, .contact-btn, .download-btn')) {
                    window.analytics.trackEvent('button_click', {
                        button: e.target.textContent.trim(),
                        page: this.getCurrentPage()
                    });
                }
            });
        }
    }

    setupThemeSync() {
        // Synchroniser le thème avec PWA
        if (window.themeManager && window.pwa) {
            document.addEventListener('themeChanged', (e) => {
                // Mettre à jour la couleur du thème PWA
                const themeColor = e.detail.theme === 'dark' ? '#1a1a1a' : '#667eea';
                let themeMetaTag = document.querySelector('meta[name="theme-color"]');
                if (themeMetaTag) {
                    themeMetaTag.setAttribute('content', themeColor);
                }
            });
        }
    }

    setupLanguageSync() {
        // Synchroniser la langue avec tous les composants
        if (window.languageManager) {
            document.addEventListener('languageChanged', (e) => {
                // Mettre à jour la langue dans tous les composants
                const newLang = e.detail.language;
                document.documentElement.lang = newLang;
                
                // Notifier les autres composants
                this.components.forEach((component, name) => {
                    if (component.updateLanguage) {
                        component.updateLanguage(newLang);
                    }
                });
            });
        }
    }

    setupPWAIntegration() {
        // Intégration PWA avec les autres composants
        if (window.pwa) {
            // Tracker les événements PWA
            document.addEventListener('pwaInstalled', () => {
                if (window.analytics) {
                    window.analytics.trackEvent('pwa_installed');
                }
                this.showNotification('Portfolio installé avec succès !', 'success');
            });
            
            document.addEventListener('pwaUpdateAvailable', () => {
                this.showNotification('Mise à jour disponible', 'info');
            });
        }
    }

    setupGlobalEventListeners() {
        // Gestion des erreurs globales
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            if (window.analytics) {
                window.analytics.trackEvent('javascript_error', {
                    message: e.message,
                    filename: e.filename,
                    line: e.lineno
                });
            }
        });
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Gestion du redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    pauseAnimations() {
        if (window.gsapManager) {
            window.gsapManager.pauseAllAnimations();
        }
    }

    resumeAnimations() {
        if (window.gsapManager) {
            window.gsapManager.resumeAllAnimations();
        }
    }

    handleResize() {
        // Recalculer les animations sensibles à la taille
        if (window.gsapManager) {
            // GSAP gère automatiquement le redimensionnement
        }
        
        // Notifier les autres composants
        this.components.forEach(component => {
            if (component.handleResize) {
                component.handleResize();
            }
        });
    }

    showLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    hideLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback console
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    showInitStats() {
        if (localStorage.getItem('admin_mode') === 'true') {
            console.log('📊 Statistiques d\'initialisation:');
            console.log(`- Composants chargés: ${this.components.size}`);
            console.log(`- Page: ${this.getCurrentPage()}`);
            console.log(`- Thème: ${document.documentElement.dataset.theme || 'light'}`);
            console.log(`- Langue: ${document.documentElement.lang || 'fr'}`);
            
            // Exposer les méthodes d'administration
            window.portfolio = this;
            window.getPortfolioStats = () => ({
                components: Array.from(this.components.keys()),
                page: this.getCurrentPage(),
                theme: document.documentElement.dataset.theme,
                language: document.documentElement.lang,
                initialized: this.isInitialized
            });
        }
    }

    handleInitError(error) {
        console.error('Erreur critique:', error);
        
        // Afficher un message d'erreur à l'utilisateur
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 300px;
        `;
        errorMessage.textContent = 'Erreur de chargement. Veuillez actualiser la page.';
        document.body.appendChild(errorMessage);
        
        // Masquer le loader même en cas d'erreur
        this.hideLoader();
        
        // Tracker l'erreur si possible
        if (window.analytics) {
            window.analytics.trackEvent('init_error', {
                error: error.message
            });
        }
    }

    // Méthodes publiques
    getComponent(name) {
        return this.components.get(name);
    }

    getAllComponents() {
        return Array.from(this.components.keys());
    }

    reinitialize() {
        console.log('🔄 Réinitialisation du portfolio...');
        this.components.clear();
        this.isInitialized = false;
        this.init();
    }
}

// Fonction utilitaire pour les notifications
window.showNotification = function(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
    return container;
}

// Initialisation automatique
window.portfolioManager = new PortfolioManager();