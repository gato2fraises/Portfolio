class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.detectSystemTheme();
        this.init();
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio_theme');
    }

    detectSystemTheme() {
        // Détection de la préférence système
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.setupSystemThemeListener();
    }

    createThemeToggle() {
        // Supprimer l'ancien toggle s'il existe
        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Basculer entre mode sombre et clair / Toggle dark/light mode');
        toggle.setAttribute('title', this.getToggleTitle());
        
        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.textContent = this.getThemeIcon();
        
        toggle.appendChild(icon);

        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Insérer le toggle dans le body
        document.body.appendChild(toggle);
    }

    getThemeIcon() {
        return this.currentTheme === 'dark' ? '☀️' : '🌙';
    }

    getToggleTitle() {
        return this.currentTheme === 'dark' 
            ? 'Passer en mode clair / Switch to light mode'
            : 'Passer en mode sombre / Switch to dark mode';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.showThemeNotification(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('portfolio_theme', theme);
        this.applyTheme(theme);
        this.updateToggleButton();
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // Mettre à jour la couleur de la barre d'adresse mobile
        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        
        themeColorMeta.content = theme === 'dark' ? '#1a1a1a' : '#667eea';
    }

    updateToggleButton() {
        const toggle = document.querySelector('.theme-toggle');
        const icon = toggle?.querySelector('.icon');
        
        if (toggle && icon) {
            icon.textContent = this.getThemeIcon();
            toggle.setAttribute('title', this.getToggleTitle());
            
            // Animation de rotation
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 300);
        }
    }

    showThemeNotification(theme) {
        const message = theme === 'dark' 
            ? 'Mode sombre activé / Dark mode enabled'
            : 'Mode clair activé / Light mode enabled';

        // Créer une notification discrète
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${theme === 'dark' ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            color: ${theme === 'dark' ? '#e9ecef' : '#2c3e50'};
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            transform: translateX(300px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
            font-weight: 500;
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
        }, 2500);
    }

    setupSystemThemeListener() {
        // Écouter les changements de préférence système
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Ne changer que si l'utilisateur n'a pas de préférence stockée
                if (!localStorage.getItem('portfolio_theme')) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                }
            });
        }
    }

    // Méthode pour forcer un thème (utile pour les tests)
    forceTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.setTheme(theme);
        }
    }

    // Méthode pour réinitialiser aux préférences système
    resetToSystemTheme() {
        localStorage.removeItem('portfolio_theme');
        const systemTheme = this.detectSystemTheme();
        this.setTheme(systemTheme);
        this.showThemeNotification(systemTheme);
    }
}

// Initialisation automatique avec gestion d'erreur
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.themeManager = new ThemeManager();
        
        // Ajouter des raccourcis clavier (optionnel)
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T pour basculer le thème
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                window.themeManager.toggleTheme();
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize theme manager:', error);
    }
});

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}