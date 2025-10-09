const CACHE_NAME = 'portfolio-dylan-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Fichiers à mettre en cache immédiatement
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/cv.html',
    '/projet.html',
    '/blog.html',
    '/contact.html',
    '/page secte.html',
    '/easteregg.html',
    '/connection.html',
    '/styles.css',
    '/script.js',
    '/i18n.js',
    '/theme.js',
    '/blog.js',
    '/contact.js',
    '/analytics.js',
    '/manifest.json',
    '/locales/fr.json',
    '/locales/en.json',
    '/images/Logo Afip.jpg',
    '/images/bonhomme.png',
    '/images/Programming_code.jpg',
    '/images/Accueil.png',
    '/Document/cv.pdf'
];

// Fichiers à mettre en cache lors de la première visite
const DYNAMIC_CACHE_URLS = [
    '/images/secte.jpg'
];

// Événement d'installation du service worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation en cours...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Mise en cache des fichiers statiques');
            return cache.addAll(STATIC_CACHE_URLS);
        }).then(() => {
            console.log('Service Worker: Installation terminée');
            // Forcer l'activation immédiate
            return self.skipWaiting();
        }).catch((error) => {
            console.error('Service Worker: Erreur installation:', error);
        })
    );
});

// Événement d'activation du service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activation en cours...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprimer les anciens caches
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation terminée');
            // Prendre le contrôle immédiatement
            return self.clients.claim();
        })
    );
});

// Événement de récupération des ressources (stratégie de cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        handleFetchRequest(event.request)
    );
});

async function handleFetchRequest(request) {
    const url = new URL(request.url);
    
    // Ignorer les requêtes non-HTTP
    if (!request.url.startsWith('http')) {
        return fetch(request);
    }
    
    // Stratégie différente selon le type de ressource
    if (isStaticAsset(url)) {
        return cacheFirst(request);
    } else if (isHTMLPage(url)) {
        return networkFirst(request);
    } else if (isAPICall(url)) {
        return networkOnly(request);
    } else {
        return staleWhileRevalidate(request);
    }
}

// Vérifier si c'est un asset statique
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.pdf'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Vérifier si c'est une page HTML
function isHTMLPage(url) {
    return url.pathname.endsWith('.html') || url.pathname === '/';
}

// Vérifier si c'est un appel API
function isAPICall(url) {
    return url.pathname.includes('/api/') || 
           url.hostname.includes('analytics') ||
           url.hostname.includes('emailjs');
}

// Stratégie Cache First (pour les assets statiques)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache First error:', error);
        return getOfflineFallback(request);
    }
}

// Stratégie Network First (pour les pages HTML)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network First fallback to cache:', request.url);
        const cachedResponse = await caches.match(request);
        return cachedResponse || getOfflineFallback(request);
    }
}

// Stratégie Network Only (pour les APIs)
async function networkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('Network Only error:', error);
        return new Response(JSON.stringify({ 
            error: 'Connexion réseau requise',
            offline: true 
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Page de fallback hors ligne
function getOfflineFallback(request) {
    if (isHTMLPage(new URL(request.url))) {
        return caches.match('/offline.html') || createOfflinePage();
    }
    
    return new Response('Contenu non disponible hors ligne', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// Créer une page hors ligne dynamique
function createOfflinePage() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hors ligne - Dylan Carion</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .offline-container {
                    text-align: center;
                    max-width: 500px;
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }
                h1 { margin-bottom: 20px; }
                p { margin-bottom: 30px; line-height: 1.6; }
                .retry-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: #2980b9;
                    transform: translateY(-2px);
                }
                .cached-pages {
                    margin-top: 30px;
                    text-align: left;
                }
                .cached-pages a {
                    color: #ecf0f1;
                    text-decoration: none;
                    display: block;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .cached-pages a:hover {
                    color: #3498db;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>Vous êtes hors ligne</h1>
                <p>Cette page n'est pas disponible sans connexion internet. Vérifiez votre connexion et réessayez.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    Réessayer
                </button>
                
                <div class="cached-pages">
                    <h3>Pages disponibles hors ligne :</h3>
                    <a href="/">🏠 Accueil</a>
                    <a href="/cv.html">📄 CV</a>
                    <a href="/projet.html">💼 Projets</a>
                    <a href="/blog.html">📝 Blog</a>
                    <a href="/contact.html">📧 Contact</a>
                </div>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-72x72.png',
        image: data.image,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: data.primaryKey || 1,
            url: data.url || '/'
        },
        actions: [
            {
                action: 'explore',
                title: 'Voir le portfolio',
                icon: '/images/icons/icon-96x96.png'
            },
            {
                action: 'close',
                title: 'Fermer',
                icon: '/images/icons/close-icon.png'
            }
        ],
        requireInteraction: true,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Si une fenêtre est déjà ouverte, la focus
            for (const client of clientList) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Sinon, ouvrir une nouvelle fenêtre
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Synchroniser les données en attente
        const pendingData = await getStoredPendingData();
        
        for (const data of pendingData) {
            try {
                await sendPendingData(data);
                await removePendingData(data.id);
            } catch (error) {
                console.error('Erreur sync:', error);
            }
        }
    } catch (error) {
        console.error('Erreur background sync:', error);
    }
}

// Utilitaires pour les données en attente
async function getStoredPendingData() {
    // Récupérer les données stockées (formulaires, analytics, etc.)
    return [];
}

async function sendPendingData(data) {
    // Envoyer les données au serveur
    return fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function removePendingData(id) {
    // Supprimer les données synchronisées
    console.log('Données synchronisées:', id);
}

// Nettoyage périodique du cache
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        event.waitUntil(cleanOldCaches());
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_VERSION,
            cacheName: CACHE_NAME
        });
    }
});

async function cleanOldCaches() {
    const cacheWhitelist = [CACHE_NAME];
    const cacheNames = await caches.keys();
    
    return Promise.all(
        cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
                console.log('Suppression cache obsolète:', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
}