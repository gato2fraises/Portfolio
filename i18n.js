class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage();
        this.translations = {};
        this.loadingPromise = null;
        this.init();
    }

    getStoredLanguage() {
        return localStorage.getItem('portfolio_language');
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('fr') ? 'fr' : 'en';
    }

    async init() {
        try {
            await this.loadTranslations();
            this.createLanguageSelector();
            this.applyTranslations();
            this.updateUrl();
        } catch (error) {
            console.warn('Translation loading failed, using fallback:', error);
            this.loadFallbackTranslations();
            this.createLanguageSelector();
            this.applyTranslations();
            this.updateUrl();
        }
    }

    async loadTranslations() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = Promise.all([
            this.loadLanguageFile('fr'),
            this.loadLanguageFile('en')
        ]);

        const [frTranslations, enTranslations] = await this.loadingPromise;
        
        this.translations = {
            fr: frTranslations,
            en: enTranslations
        };

        return this.translations;
    }

    async loadLanguageFile(lang) {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Failed to load ${lang} translations:`, error);
            return this.getFallbackTranslations(lang);
        }
    }

    loadFallbackTranslations() {
        // Traductions de base intégrées en cas d'échec de chargement
        this.translations = {
            fr: this.getFallbackTranslations('fr'),
            en: this.getFallbackTranslations('en')
        };
    }

    getFallbackTranslations(lang) {
        const fallback = {
            fr: {
                navigation: {
                    home: 'Accueil',
                    cv: 'CV',
                    projects: 'Projets',
                    research: 'Recherche',
                    game: 'Jeu',
                    login: 'Connexion'
                },
                header: {
                    title: 'Dylan Carion',
                    subtitle: 'Portfolio Professionnel'
                },
                home: {
                    sections: {
                        skills: { title: 'Profil & Compétences Techniques' },
                        portfolio: { title: 'Réalisations & Portfolio' },
                        research: { title: 'Projet de Recherche Académique' },
                        internship: { title: 'Recherche de Stage - Septembre 2025' }
                    }
                }
            },
            en: {
                navigation: {
                    home: 'Home',
                    cv: 'Resume',
                    projects: 'Projects',
                    research: 'Research',
                    game: 'Game',
                    login: 'Login'
                },
                header: {
                    title: 'Dylan Carion',
                    subtitle: 'Professional Portfolio'
                },
                home: {
                    sections: {
                        skills: { title: 'Profile & Technical Skills' },
                        portfolio: { title: 'Achievements & Portfolio' },
                        research: { title: 'Academic Research Project' },
                        internship: { title: 'Seeking Internship - September 2025' }
                    }
                }
            }
        };

        return fallback[lang] || fallback.en;
    }

    createLanguageSelector() {
        const header = document.querySelector('header') || document.body;
        
        // Supprimer l'ancien sélecteur s'il existe
        const existingSelector = document.querySelector('.language-selector');
        if (existingSelector) {
            existingSelector.remove();
        }

        const currentLangData = this.translations[this.currentLanguage]?.meta || {};
        const flag = currentLangData.flag || (this.currentLanguage === 'fr' ? '🇫🇷' : '🇬🇧');

        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="language-toggle" aria-label="Changer de langue / Switch language" title="${this.getTranslation('navigation.languageSwitch') || 'Change language'}">
                <span class="flag">${flag}</span>
                <span class="lang-code">${this.currentLanguage.toUpperCase()}</span>
                <span class="toggle-icon">⇄</span>
            </button>
        `;

        // Ajouter les styles améliorés
        this.addLanguageSelectorStyles();

        selector.querySelector('.language-toggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        header.appendChild(selector);
    }

    addLanguageSelectorStyles() {
        if (document.querySelector('#language-selector-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'language-selector-styles';
        styles.textContent = `
            .language-selector {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }

            .language-toggle {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 30px;
                padding: 10px 18px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(15px);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 14px;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .language-toggle:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .language-toggle:active {
                transform: translateY(-1px) scale(1.02);
            }

            .language-toggle .flag {
                font-size: 18px;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
            }

            .language-toggle .lang-code {
                font-weight: 700;
                letter-spacing: 1.2px;
                font-size: 13px;
            }

            .language-toggle .toggle-icon {
                font-size: 16px;
                opacity: 0.8;
                transition: transform 0.3s ease;
            }

            .language-toggle:hover .toggle-icon {
                transform: rotate(180deg);
                opacity: 1;
            }

            @media (max-width: 768px) {
                .language-selector {
                    top: 15px;
                    right: 15px;
                }
                
                .language-toggle {
                    padding: 8px 14px;
                    font-size: 12px;
                    gap: 8px;
                }

                .language-toggle .flag {
                    font-size: 16px;
                }

                .language-toggle .toggle-icon {
                    font-size: 14px;
                }
            }

            /* Animation d'apparition */
            @keyframes languageSelectorAppear {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .language-selector {
                animation: languageSelectorAppear 0.5s ease-out;
            }
        `;
        document.head.appendChild(styles);
    }

    async toggleLanguage() {
        const previousLanguage = this.currentLanguage;
        this.currentLanguage = this.currentLanguage === 'fr' ? 'en' : 'fr';
        localStorage.setItem('portfolio_language', this.currentLanguage);
        
        // Animation de transition
        const toggle = document.querySelector('.language-toggle');
        if (toggle) {
            toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = '';
            }, 150);
        }

        // Mettre à jour le sélecteur
        const flag = document.querySelector('.language-toggle .flag');
        const code = document.querySelector('.language-toggle .lang-code');
        
        if (flag && code) {
            const currentLangData = this.translations[this.currentLanguage]?.meta || {};
            const newFlag = currentLangData.flag || (this.currentLanguage === 'fr' ? '🇫🇷' : '🇬🇧');
            
            flag.textContent = newFlag;
            code.textContent = this.currentLanguage.toUpperCase();
        }

        try {
            await this.applyTranslations();
            this.updateUrl();
            this.showNotification(this.getTranslation('notifications.languageChanged') || 'Language changed');
        } catch (error) {
            console.warn('Translation application failed:', error);
            // Revenir à la langue précédente en cas d'erreur
            this.currentLanguage = previousLanguage;
            localStorage.setItem('portfolio_language', this.currentLanguage);
        }
    }

    async applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                    element.placeholder = translation;
                } else if (element.hasAttribute('title')) {
                    element.title = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });

        // Mettre à jour le titre de la page
        const currentPage = this.detectPageType();
        const pageTitle = this.getPageTitle(currentPage);
        if (pageTitle) {
            document.title = pageTitle;
        }

        // Mettre à jour la direction du texte si nécessaire
        const direction = this.translations[this.currentLanguage]?.meta?.direction || 'ltr';
        document.documentElement.setAttribute('dir', direction);
    }

    getTranslation(key) {
        if (!key) return null;
        
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object' && translation[k] !== undefined) {
                translation = translation[k];
            } else {
                // Fallback vers l'anglais si la traduction française n'existe pas
                if (this.currentLanguage === 'fr') {
                    let fallback = this.translations.en;
                    for (const fk of keys) {
                        if (fallback && typeof fallback === 'object' && fallback[fk] !== undefined) {
                            fallback = fallback[fk];
                        } else {
                            return null;
                        }
                    }
                    return fallback;
                }
                return null;
            }
        }
        
        return typeof translation === 'string' ? translation : null;
    }

    detectPageType() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        if (page.includes('cv')) return 'cv';
        if (page.includes('projet')) return 'projects';
        if (page.includes('secte')) return 'research';
        if (page.includes('easteregg')) return 'game';
        if (page.includes('connection')) return 'login';
        return 'home';
    }

    getPageTitle(pageType) {
        const metaKey = `${pageType}.metaTitle`;
        return this.getTranslation(metaKey) || this.getTranslation('header.title') || 'Dylan Carion - Portfolio';
    }

    updateUrl() {
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLanguage);
        window.history.replaceState({}, '', url);
    }

    showNotification(message) {
        // Créer une notification discrète
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            transform: translateX(300px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Disparition automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Méthode utilitaire pour formater les dates selon la locale
    formatDate(date, options = {}) {
        const locale = this.translations[this.currentLanguage]?.meta?.dateFormat === 'DD/MM/YYYY' ? 'fr-FR' : 'en-US';
        return new Intl.DateTimeFormat(locale, options).format(date);
    }

    // Méthode utilitaire pour formater les nombres selon la locale
    formatNumber(number, options = {}) {
        const locale = this.translations[this.currentLanguage]?.meta?.numberFormat || 'en-US';
        return new Intl.NumberFormat(locale, options).format(number);
    }
}

// Initialisation automatique avec gestion d'erreur
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.languageManager = new LanguageManager();
    } catch (error) {
        console.error('Failed to initialize language manager:', error);
        // Fallback basique sans traductions
        document.title = 'Dylan Carion - Portfolio';
    }
});

// Gestion du changement de langue via URL
window.addEventListener('popstate', () => {
    if (window.languageManager) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['fr', 'en'].includes(urlLang) && urlLang !== window.languageManager.currentLanguage) {
            window.languageManager.currentLanguage = urlLang;
            window.languageManager.applyTranslations();
        }
    }
});

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}