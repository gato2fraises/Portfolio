function handleLogout(e) {
    e.preventDefault();
    
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Étape 1: Animation du bouton
    const loadingText = window.languageManager ? window.languageManager.t('logout.loading') : 'Déconnexion...';
    logoutBtn.textContent = loadingText;
    logoutBtn.classList.add('loading');
    
    setTimeout(() => {
        // Étape 2: Créer l'overlay de déconnexion
        const overlay = document.createElement('div');
        overlay.className = 'logout-overlay';
        
        const titleText = window.languageManager ? window.languageManager.t('logout.title') : 'Déconnexion en cours';
        const messageText = window.languageManager ? window.languageManager.t('logout.message') : 'Merci d\'avoir consulté mon portfolio professionnel';
        
        const message = document.createElement('div');
        message.className = 'logout-message';
        message.innerHTML = `
            <div class="logout-icon">👋</div>
            <div class="logout-title">${titleText}</div>
            <div class="logout-text">${messageText}</div>
            <div class="logout-progress">
                <div class="logout-progress-bar"></div>
            </div>
        `;
        
        overlay.appendChild(message);
        document.body.appendChild(overlay);
        
        // Étape 3: Animation de sortie de la page
        setTimeout(() => {
            document.body.classList.add('logout-animation');
        }, 1000);
        
        // Étape 4: Redirection
        setTimeout(() => {
            window.location.href = 'connection.html';
        }, 2200);
        
    }, 800);
}

function handleSearch(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const query = input.value.trim().toLowerCase();
    
    const pages = {
        "secte": "page secte.html",
        "accueil": "index.html",
        "home": "index.html",
        "portfolio": "index.html",
        "cv": "cv.html",
        "easteregg": "easteregg.html",
        "projet": "projet.html",
        "projets": "projet.html"
    };

    if (pages[query]) {
        const redirectText = window.languageManager ? window.languageManager.t('notification.redirect') : 'Redirection vers';
        showNotification(`${redirectText} ${query}...`, "success");
        setTimeout(() => {
            window.location.href = pages[query];
        }, 800);
    } else {
        const notFoundText = window.languageManager ? window.languageManager.t('notification.not.found') : 'Aucune page trouvée.';
        showNotification(notFoundText, "error");
    }
}

function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-bar-header');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // Exposer languageManager globalement pour les autres fonctions
    window.languageManager = window.LanguageManager ? new window.LanguageManager() : null;
});