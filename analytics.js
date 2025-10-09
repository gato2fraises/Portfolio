class AnalyticsManager {
    constructor() {
        this.trackingId = 'G-XXXXXXXXXX'; // À remplacer par votre vraie ID
        this.isEnabled = false;
        this.consentGiven = false;
        this.pageViews = [];
        this.events = [];
        
        this.init();
    }

    async init() {
        // Vérifier le consentement stocké
        this.checkStoredConsent();
        
        // Afficher la bannière de cookies si nécessaire
        if (!this.hasConsentDecision()) {
            this.showCookieBanner();
        }
        
        // Initialiser les analytics si le consentement est donné
        if (this.consentGiven) {
            await this.enableAnalytics();
        }
        
        // Tracker la page actuelle
        this.trackPageView();
        
        // Setup des event listeners
        this.setupEventListeners();
    }

    checkStoredConsent() {
        const consent = localStorage.getItem('analytics_consent');
        if (consent !== null) {
            this.consentGiven = consent === 'true';
        }
    }

    hasConsentDecision() {
        return localStorage.getItem('analytics_consent') !== null;
    }

    showCookieBanner() {
        const banner = this.createCookieBanner();
        document.body.appendChild(banner);
        
        // Animation d'apparition
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    createCookieBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookie-banner';
        
        const currentLang = window.languageManager ? window.languageManager.currentLanguage : 'fr';
        const texts = this.getCookieTexts(currentLang);
        
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-icon">🍪</div>
                <div class="cookie-text">
                    <h3>${texts.title}</h3>
                    <p>${texts.description}</p>
                    <div class="cookie-details">
                        <p><strong>${texts.dataCollected}:</strong></p>
                        <ul>
                            <li>${texts.pageViews}</li>
                            <li>${texts.interactions}</li>
                            <li>${texts.performance}</li>
                            <li>${texts.deviceInfo}</li>
                        </ul>
                    </div>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn cookie-btn-accept" onclick="window.analytics.acceptCookies()">
                        ${texts.accept}
                    </button>
                    <button class="cookie-btn cookie-btn-decline" onclick="window.analytics.declineCookies()">
                        ${texts.decline}
                    </button>
                    <button class="cookie-btn cookie-btn-settings" onclick="window.analytics.showSettings()">
                        ${texts.settings}
                    </button>
                </div>
            </div>
        `;
        
        return banner;
    }

    getCookieTexts(lang) {
        const texts = {
            fr: {
                title: 'Respect de votre vie privée',
                description: 'Ce site utilise des cookies analytiques pour améliorer votre expérience et comprendre l\'utilisation du site.',
                dataCollected: 'Données collectées',
                pageViews: 'Pages visitées et temps passé',
                interactions: 'Clics et interactions avec le contenu',
                performance: 'Performance et temps de chargement',
                deviceInfo: 'Type d\'appareil et navigateur (anonymisé)',
                accept: 'Accepter',
                decline: 'Refuser',
                settings: 'Paramètres'
            },
            en: {
                title: 'Respecting your privacy',
                description: 'This site uses analytical cookies to improve your experience and understand site usage.',
                dataCollected: 'Data collected',
                pageViews: 'Pages visited and time spent',
                interactions: 'Clicks and content interactions',
                performance: 'Performance and loading times',
                deviceInfo: 'Device type and browser (anonymized)',
                accept: 'Accept',
                decline: 'Decline',
                settings: 'Settings'
            }
        };
        
        return texts[lang] || texts.fr;
    }

    async acceptCookies() {
        this.consentGiven = true;
        localStorage.setItem('analytics_consent', 'true');
        
        await this.enableAnalytics();
        this.hideCookieBanner();
        
        // Tracker l'événement de consentement
        this.trackEvent('consent_given', {
            consent_type: 'analytics',
            method: 'banner'
        });
        
        this.showNotification('Cookies analytiques activés', 'success');
    }

    declineCookies() {
        this.consentGiven = false;
        localStorage.setItem('analytics_consent', 'false');
        
        this.disableAnalytics();
        this.hideCookieBanner();
        
        this.showNotification('Cookies analytiques refusés', 'info');
    }

    showSettings() {
        // Afficher une modal avec les paramètres détaillés
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'privacy-modal';
        modal.id = 'privacy-modal';
        
        const currentLang = window.languageManager ? window.languageManager.currentLanguage : 'fr';
        const texts = this.getSettingsTexts(currentLang);
        
        modal.innerHTML = `
            <div class="modal-content privacy-content">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <h2>${texts.title}</h2>
                
                <div class="privacy-section">
                    <h3>${texts.essential.title}</h3>
                    <p>${texts.essential.description}</p>
                    <label class="toggle-switch">
                        <input type="checkbox" checked disabled>
                        <span class="slider"></span>
                        <span class="label">${texts.essential.label}</span>
                    </label>
                </div>
                
                <div class="privacy-section">
                    <h3>${texts.analytics.title}</h3>
                    <p>${texts.analytics.description}</p>
                    <label class="toggle-switch">
                        <input type="checkbox" id="analytics-toggle" ${this.consentGiven ? 'checked' : ''}>
                        <span class="slider"></span>
                        <span class="label">${texts.analytics.label}</span>
                    </label>
                </div>
                
                <div class="privacy-actions">
                    <button class="cookie-btn cookie-btn-accept" onclick="window.analytics.saveSettings()">
                        ${texts.save}
                    </button>
                </div>
                
                <div class="privacy-info">
                    <h4>${texts.dataInfo.title}</h4>
                    <ul>
                        <li>${texts.dataInfo.retention}</li>
                        <li>${texts.dataInfo.sharing}</li>
                        <li>${texts.dataInfo.rights}</li>
                    </ul>
                </div>
            </div>
        `;
        
        return modal;
    }

    getSettingsTexts(lang) {
        const texts = {
            fr: {
                title: 'Paramètres de confidentialité',
                essential: {
                    title: 'Cookies essentiels',
                    description: 'Nécessaires au fonctionnement du site (langue, thème).',
                    label: 'Toujours activés'
                },
                analytics: {
                    title: 'Cookies analytiques',
                    description: 'Nous aident à comprendre comment vous utilisez le site.',
                    label: 'Cookies analytiques'
                },
                save: 'Sauvegarder les préférences',
                dataInfo: {
                    title: 'Informations sur vos données',
                    retention: 'Conservation: 26 mois maximum',
                    sharing: 'Aucun partage avec des tiers',
                    rights: 'Vous pouvez modifier vos préférences à tout moment'
                }
            },
            en: {
                title: 'Privacy Settings',
                essential: {
                    title: 'Essential Cookies',
                    description: 'Necessary for the site to function (language, theme).',
                    label: 'Always enabled'
                },
                analytics: {
                    title: 'Analytics Cookies',
                    description: 'Help us understand how you use the site.',
                    label: 'Analytics cookies'
                },
                save: 'Save preferences',
                dataInfo: {
                    title: 'Information about your data',
                    retention: 'Retention: 26 months maximum',
                    sharing: 'No sharing with third parties',
                    rights: 'You can modify your preferences at any time'
                }
            }
        };
        
        return texts[lang] || texts.fr;
    }

    saveSettings() {
        const analyticsToggle = document.getElementById('analytics-toggle');
        if (analyticsToggle) {
            if (analyticsToggle.checked && !this.consentGiven) {
                this.acceptCookies();
            } else if (!analyticsToggle.checked && this.consentGiven) {
                this.declineCookies();
            }
        }
        
        document.getElementById('privacy-modal').remove();
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => banner.remove(), 300);
        }
    }

    async enableAnalytics() {
        if (this.isEnabled) return;
        
        try {
            // Charger Google Analytics 4
            await this.loadGoogleAnalytics();
            this.isEnabled = true;
            
            // Configuration GA4
            gtag('config', this.trackingId, {
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
            });
            
            console.log('Analytics activés');
        } catch (error) {
            console.error('Erreur chargement Analytics:', error);
        }
    }

    loadGoogleAnalytics() {
        return new Promise((resolve, reject) => {
            if (window.gtag) {
                resolve();
                return;
            }
            
            // Charger gtag
            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
            
            script1.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                
                gtag('js', new Date());
                resolve();
            };
            
            script1.onerror = reject;
            document.head.appendChild(script1);
        });
    }

    disableAnalytics() {
        this.isEnabled = false;
        
        // Désactiver GA4
        if (window.gtag) {
            gtag('config', this.trackingId, {
                send_page_view: false
            });
        }
        
        console.log('Analytics désactivés');
    }

    trackPageView(page = null) {
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            language: window.languageManager ? window.languageManager.currentLanguage : 'fr',
            timestamp: new Date().toISOString()
        };
        
        // Stocker localement
        this.pageViews.push(pageData);
        
        // Envoyer à GA4 si activé
        if (this.isEnabled && window.gtag) {
            gtag('event', 'page_view', pageData);
        }
        
        console.log('Page view tracked:', pageData);
    }

    trackEvent(eventName, parameters = {}) {
        const eventData = {
            event_name: eventName,
            ...parameters,
            timestamp: new Date().toISOString(),
            page_path: window.location.pathname
        };
        
        // Stocker localement
        this.events.push(eventData);
        
        // Envoyer à GA4 si activé
        if (this.isEnabled && window.gtag) {
            gtag('event', eventName, parameters);
        }
        
        console.log('Event tracked:', eventData);
    }

    setupEventListeners() {
        // Tracker les clics sur les liens
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                this.trackEvent('click', {
                    link_text: link.textContent.trim(),
                    link_url: link.href,
                    link_type: link.hostname !== window.location.hostname ? 'external' : 'internal'
                });
            }
        });

        // Tracker les soumissions de formulaires
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.trackEvent('form_submit', {
                    form_id: form.id || 'unknown',
                    form_action: form.action || window.location.href
                });
            }
        });

        // Tracker le temps passé sur la page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('page_timing', {
                time_spent: timeSpent,
                engagement_time: timeSpent
            });
        });

        // Tracker les erreurs JavaScript
        window.addEventListener('error', (e) => {
            this.trackEvent('javascript_error', {
                error_message: e.message,
                error_filename: e.filename,
                error_line: e.lineno
            });
        });
    }

    // Dashboard simple pour visualiser les données
    showDashboard() {
        if (!this.hasAdminAccess()) {
            console.log('Accès admin requis');
            return;
        }
        
        const dashboard = this.createDashboard();
        document.body.appendChild(dashboard);
    }

    hasAdminAccess() {
        return localStorage.getItem('admin_mode') === 'true';
    }

    createDashboard() {
        const modal = document.createElement('div');
        modal.className = 'analytics-dashboard';
        modal.innerHTML = `
            <div class="dashboard-content">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <h2>📊 Tableau de bord Analytics</h2>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Pages vues</h3>
                        <div class="stat-number">${this.pageViews.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Événements</h3>
                        <div class="stat-number">${this.events.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Consentement</h3>
                        <div class="stat-number">${this.consentGiven ? '✅' : '❌'}</div>
                    </div>
                </div>
                
                <div class="dashboard-actions">
                    <button onclick="window.analytics.exportData()" class="dashboard-btn">
                        Exporter les données
                    </button>
                    <button onclick="window.analytics.clearData()" class="dashboard-btn">
                        Effacer les données
                    </button>
                </div>
            </div>
        `;
        
        return modal;
    }

    exportData() {
        const data = {
            pageViews: this.pageViews,
            events: this.events,
            consent: this.consentGiven,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `analytics_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    clearData() {
        if (confirm('Êtes-vous sûr de vouloir effacer toutes les données analytics ?')) {
            this.pageViews = [];
            this.events = [];
            localStorage.removeItem('analytics_consent');
            console.log('Données analytics effacées');
        }
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialiser les analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AnalyticsManager();
    
    // Exposer les méthodes d'administration
    if (localStorage.getItem('admin_mode') === 'true') {
        window.showAnalyticsDashboard = () => window.analytics.showDashboard();
        console.log('Mode admin activé. Utilisez showAnalyticsDashboard()');
    }
});