class PWAManager {
    constructor() {
        this.swRegistration = null;
        this.isInstallable = false;
        this.deferredPrompt = null;
        this.isInstalled = false;
        
        this.init();
    }

    async init() {
        // Vérifier le support des service workers
        if ('serviceWorker' in navigator) {
            await this.registerServiceWorker();
        }
        
        // Vérifier le support PWA
        this.checkPWASupport();
        
        // Setup des event listeners
        this.setupEventListeners();
        
        // Vérifier si déjà installé
        this.checkInstallStatus();
        
        // Afficher le prompt d'installation si applicable
        this.setupInstallPrompt();
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker enregistré:', this.swRegistration);
            
            // Vérifier les mises à jour
            this.swRegistration.addEventListener('updatefound', () => {
                this.handleSWUpdate();
            });
            
            // Vérifier si un SW est en attente
            if (this.swRegistration.waiting) {
                this.showUpdatePrompt();
            }
            
            // Nettoyage périodique du cache
            this.scheduleCleanup();
            
        } catch (error) {
            console.error('Erreur enregistrement Service Worker:', error);
        }
    }

    checkPWASupport() {
        this.isInstallable = 'serviceWorker' in navigator && 
                           'PushManager' in window &&
                           'Notification' in window;
        
        console.log('Support PWA:', this.isInstallable);
    }

    setupEventListeners() {
        // Événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Événement appinstalled
        window.addEventListener('appinstalled', () => {
            console.log('PWA installée avec succès');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showWelcomeMessage();
            
            // Tracker l'installation
            if (window.analytics) {
                window.analytics.trackEvent('pwa_installed', {
                    platform: this.getPlatform()
                });
            }
        });

        // Changement d'état du réseau
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    checkInstallStatus() {
        // Vérifier si lancé depuis l'écran d'accueil
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('PWA lancée en mode standalone');
        }
        
        // Vérifier sur iOS
        if (window.navigator.standalone) {
            this.isInstalled = true;
            console.log('PWA installée sur iOS');
        }
    }

    setupInstallPrompt() {
        if (!this.isInstalled && this.isInstallable) {
            // Afficher le prompt après un délai
            setTimeout(() => {
                if (this.deferredPrompt) {
                    this.showInstallBanner();
                }
            }, 30000); // 30 secondes
        }
    }

    showInstallButton() {
        let installBtn = document.getElementById('install-pwa-btn');
        
        if (!installBtn) {
            installBtn = this.createInstallButton();
            document.body.appendChild(installBtn);
        }
        
        installBtn.style.display = 'flex';
        setTimeout(() => installBtn.classList.add('show'), 100);
    }

    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'install-pwa-btn';
        button.className = 'install-pwa-btn';
        button.innerHTML = `
            <div class="install-icon">📱</div>
            <div class="install-text">
                <div class="install-title">Installer l'app</div>
                <div class="install-subtitle">Accès rapide depuis votre écran d'accueil</div>
            </div>
            <div class="install-close" onclick="event.stopPropagation(); this.parentElement.style.display='none'">×</div>
        `;
        
        button.addEventListener('click', () => this.installPWA());
        
        return button;
    }

    showInstallBanner() {
        if (this.isInstalled || document.getElementById('install-banner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'install-banner';
        banner.className = 'install-banner';
        
        const currentLang = window.languageManager ? window.languageManager.currentLanguage : 'fr';
        const texts = this.getInstallTexts(currentLang);
        
        banner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">🚀</div>
                <div class="banner-text">
                    <strong>${texts.title}</strong>
                    <p>${texts.description}</p>
                </div>
                <div class="banner-actions">
                    <button class="banner-btn install" onclick="window.pwa.installPWA()">
                        ${texts.install}
                    </button>
                    <button class="banner-btn dismiss" onclick="window.pwa.dismissInstallBanner()">
                        ${texts.later}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        setTimeout(() => banner.classList.add('show'), 100);
        
        // Auto-dismiss après 15 secondes
        setTimeout(() => this.dismissInstallBanner(), 15000);
    }

    getInstallTexts(lang) {
        const texts = {
            fr: {
                title: 'Installer le Portfolio',
                description: 'Ajoutez cette app à votre écran d\'accueil pour un accès rapide',
                install: 'Installer',
                later: 'Plus tard'
            },
            en: {
                title: 'Install Portfolio',
                description: 'Add this app to your home screen for quick access',
                install: 'Install',
                later: 'Later'
            }
        };
        
        return texts[lang] || texts.fr;
    }

    async installPWA() {
        if (!this.deferredPrompt) return;
        
        try {
            // Afficher le prompt d'installation
            this.deferredPrompt.prompt();
            
            // Attendre le choix de l'utilisateur
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log('Choix installation PWA:', outcome);
            
            if (outcome === 'accepted') {
                this.showNotification('Installation en cours...', 'info');
            } else {
                this.showNotification('Installation annulée', 'info');
            }
            
            // Nettoyer
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.dismissInstallBanner();
            
        } catch (error) {
            console.error('Erreur installation PWA:', error);
            this.showNotification('Erreur lors de l\'installation', 'error');
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-pwa-btn');
        if (installBtn) {
            installBtn.classList.remove('show');
            setTimeout(() => installBtn.remove(), 300);
        }
    }

    dismissInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
        
        // Mémoriser le refus (ne plus proposer pendant 7 jours)
        localStorage.setItem('install_banner_dismissed', Date.now().toString());
    }

    shouldShowInstallBanner() {
        const dismissed = localStorage.getItem('install_banner_dismissed');
        if (!dismissed) return true;
        
        const dismissedTime = parseInt(dismissed);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        return Date.now() - dismissedTime > oneWeek;
    }

    showWelcomeMessage() {
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'welcome-modal';
        welcomeModal.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-icon">🎉</div>
                <h2>Bienvenue dans l'app !</h2>
                <p>Le portfolio de Dylan Carion est maintenant installé sur votre appareil.</p>
                <div class="welcome-features">
                    <div class="feature">
                        <span class="feature-icon">⚡</span>
                        <span>Chargement ultra-rapide</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📱</span>
                        <span>Accès hors ligne</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🔔</span>
                        <span>Notifications de mise à jour</span>
                    </div>
                </div>
                <button class="welcome-btn" onclick="this.parentElement.parentElement.remove()">
                    C'est parti !
                </button>
            </div>
        `;
        
        document.body.appendChild(welcomeModal);
        setTimeout(() => welcomeModal.classList.add('show'), 100);
        
        // Auto-remove après 10 secondes
        setTimeout(() => {
            if (welcomeModal.parentElement) {
                welcomeModal.remove();
            }
        }, 10000);
    }

    handleSWUpdate() {
        const newWorker = this.swRegistration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdatePrompt();
            }
        });
    }

    showUpdatePrompt() {
        const updateModal = document.createElement('div');
        updateModal.className = 'update-modal';
        updateModal.innerHTML = `
            <div class="update-content">
                <div class="update-icon">🔄</div>
                <h3>Mise à jour disponible</h3>
                <p>Une nouvelle version du portfolio est disponible. Voulez-vous mettre à jour ?</p>
                <div class="update-actions">
                    <button class="update-btn update" onclick="window.pwa.applyUpdate()">
                        Mettre à jour
                    </button>
                    <button class="update-btn later" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Plus tard
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(updateModal);
        setTimeout(() => updateModal.classList.add('show'), 100);
    }

    applyUpdate() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Recharger la page après l'activation
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
        
        // Fermer la modal
        const updateModal = document.querySelector('.update-modal');
        if (updateModal) {
            updateModal.remove();
        }
    }

    handleOnline() {
        console.log('Connexion rétablie');
        this.showNotification('Connexion rétablie', 'success');
        
        // Synchroniser les données en attente
        if (this.swRegistration) {
            this.swRegistration.sync.register('background-sync');
        }
    }

    handleOffline() {
        console.log('Connexion perdue');
        this.showNotification('Mode hors ligne activé', 'warning');
    }

    scheduleCleanup() {
        // Nettoyer le cache tous les jours
        setInterval(() => {
            if (this.swRegistration) {
                this.swRegistration.active.postMessage({ type: 'CLEAN_CACHE' });
            }
        }, 24 * 60 * 60 * 1000);
    }

    // Notifications push
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('Notifications non supportées');
            return false;
        }
        
        if (Notification.permission === 'granted') {
            return true;
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        
        return false;
    }

    async subscribeToPushNotifications() {
        if (!this.swRegistration) {
            console.error('Service Worker non enregistré');
            return;
        }
        
        const hasPermission = await this.requestNotificationPermission();
        if (!hasPermission) {
            console.log('Permission notifications refusée');
            return;
        }
        
        try {
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });
            
            console.log('Abonnement push créé:', subscription);
            
            // Envoyer l'abonnement au serveur
            await this.sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Erreur abonnement push:', error);
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async sendSubscriptionToServer(subscription) {
        // Envoyer l'abonnement à votre serveur
        console.log('Abonnement à envoyer au serveur:', subscription);
    }

    getPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/android/.test(userAgent)) return 'android';
        if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
        if (/windows/.test(userAgent)) return 'windows';
        if (/mac/.test(userAgent)) return 'macos';
        if (/linux/.test(userAgent)) return 'linux';
        
        return 'unknown';
    }

    showNotification(message, type = 'info') {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Méthodes d'administration
    getServiceWorkerInfo() {
        if (!this.swRegistration) return null;
        
        return {
            scope: this.swRegistration.scope,
            active: !!this.swRegistration.active,
            waiting: !!this.swRegistration.waiting,
            installing: !!this.swRegistration.installing,
            updateAvailable: !!this.swRegistration.waiting
        };
    }

    async getCacheInfo() {
        if (!('caches' in window)) return null;
        
        const cacheNames = await caches.keys();
        const cacheInfo = [];
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            cacheInfo.push({
                name: cacheName,
                size: keys.length,
                urls: keys.map(req => req.url)
            });
        }
        
        return cacheInfo;
    }
}

// Initialiser PWA
document.addEventListener('DOMContentLoaded', () => {
    window.pwa = new PWAManager();
    
    // Exposer les méthodes d'administration
    if (localStorage.getItem('admin_mode') === 'true') {
        window.getPWAInfo = () => ({
            swInfo: window.pwa.getServiceWorkerInfo(),
            isInstalled: window.pwa.isInstalled,
            isInstallable: window.pwa.isInstallable
        });
        window.getCacheInfo = () => window.pwa.getCacheInfo();
        window.enablePushNotifications = () => window.pwa.subscribeToPushNotifications();
        console.log('Mode admin PWA activé. Utilisez getPWAInfo(), getCacheInfo(), enablePushNotifications()');
    }
});