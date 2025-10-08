// Système de traduction multilingue FR/EN
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferred-language') || 'fr';
        this.translations = {
            fr: {
                // Header
                "header.title": "Dylan Carion",
                "header.subtitle": "Portfolio Professionnel",
                "header.search.placeholder": "Rechercher...",
                "header.search.button": "Rechercher",
                "header.logout": "Déconnexion",
                "header.slogan.title": "Développeur Web Junior - BTS SIO SLAM",
                "header.slogan.subtitle": "Recherche active d'alternance en développement web - Disponible septembre 2025",

                // Page d'accueil
                "home.intro.title": "Dylan Carion - Développeur Web Junior",
                "home.intro.description": "Étudiant en BTS SIO option SLAM, je recherche activement une <strong>alternance en développement web</strong> pour septembre 2025. Rigoureux, autonome et passionné par les technologies web modernes, j'apporte motivation et compétences techniques à votre équipe tout en continuant à apprendre et évoluer professionnellement.",

                // Section CV
                "home.cv.title": "Profil & Compétences Techniques",
                "home.cv.description": "<strong>Technologies maîtrisées :</strong><br>• <strong>Frontend :</strong> HTML5, CSS3, JavaScript ES6+<br>• <strong>Backend :</strong> PHP, Python, bases de données MySQL<br>• <strong>Outils :</strong> Git/GitHub, VS Code, méthodes Agiles<br>• <strong>Compétences transversales :</strong> Autonomie, rigueur, travail d'équipe, gestion de projet, résolution de problèmes",
                "home.cv.button": "Consulter mon CV complet",

                // Section Portfolio
                "home.portfolio.title": "Réalisations & Portfolio",
                "home.portfolio.description": "<strong>Portfolio de projets professionnels et académiques</strong><br>Collection complète de mes réalisations : développement de sites web responsives, applications interactives, projets collaboratifs. Chaque projet démontre ma progression technique, ma capacité d'adaptation et mon approche méthodologique du développement. Code structuré, documentation technique complète.",
                "home.portfolio.button": "Voir mes réalisations",

                // Section Recherche
                "home.research.title": "Projet de Recherche Académique",
                "home.research.description": "<strong>Étude sociologique - Développement de compétences transversales</strong><br>Projet de recherche universitaire démontrant mes compétences en méthodologie, analyse critique et rédaction technique. Gestion complète de projet : planification, recherche documentaire, analyse de données, présentation professionnelle. Exemple concret de rigueur intellectuelle et capacité à traiter des sujets complexes.",
                "home.research.skills": "<strong>Compétences développées :</strong> Gestion de projet • Recherche méthodologique • Analyse critique • Communication professionnelle",
                "home.research.button": "Voir la méthodologie",

                // Section Contact
                "home.contact.title": "Recherche d'Alternance - Septembre 2025",
                "home.contact.description": "<strong>Objectif professionnel : Contrat d'alternance en développement web</strong><br><br>Étudiant sérieux et motivé, je recherche une entreprise pour un contrat d'alternance en développement web à partir de septembre 2025. Prêt à m'investir dans vos projets, j'apporte créativité, rigueur technique et passion pour l'innovation technologique. Disponible immédiatement pour entretiens.",
                "home.contact.cv.button": "Consulter mon CV",
                "home.contact.projects.button": "Voir mes projets",
                "home.contact.status.title": "Candidature active",
                "home.contact.status.subtitle": "Disponible pour entretien • Motivé • Prêt à contribuer",

                // Footer
                "footer.title": "Dylan Carion - Développeur Web Junior - BTS SIO SLAM",
                "footer.subtitle": "Recherche alternance développement web - Septembre 2025",
                "footer.description": "Portfolio professionnel - Candidature active",

                // Notifications
                "notification.redirect": "Redirection vers",
                "notification.not.found": "Aucune page trouvée.",
                "logout.loading": "Déconnexion...",
                "logout.title": "Déconnexion en cours",
                "logout.message": "Merci d'avoir consulté mon portfolio professionnel"
            },
            en: {
                // Header
                "header.title": "Dylan Carion",
                "header.subtitle": "Professional Portfolio",
                "header.search.placeholder": "Search...",
                "header.search.button": "Search",
                "header.logout": "Logout",
                "header.slogan.title": "Junior Web Developer - BTS SIO SLAM",
                "header.slogan.subtitle": "Actively seeking web development internship - Available September 2025",

                // Home page
                "home.intro.title": "Dylan Carion - Junior Web Developer",
                "home.intro.description": "BTS SIO SLAM student, actively seeking a <strong>web development internship</strong> for September 2025. Rigorous, autonomous and passionate about modern web technologies, I bring motivation and technical skills to your team while continuing to learn and grow professionally.",

                // CV Section
                "home.cv.title": "Profile & Technical Skills",
                "home.cv.description": "<strong>Mastered Technologies:</strong><br>• <strong>Frontend:</strong> HTML5, CSS3, JavaScript ES6+<br>• <strong>Backend:</strong> PHP, Python, MySQL databases<br>• <strong>Tools:</strong> Git/GitHub, VS Code, Agile methods<br>• <strong>Soft Skills:</strong> Autonomy, rigor, teamwork, project management, problem solving",
                "home.cv.button": "View my complete CV",

                // Portfolio Section
                "home.portfolio.title": "Achievements & Portfolio",
                "home.portfolio.description": "<strong>Portfolio of professional and academic projects</strong><br>Complete collection of my achievements: responsive website development, interactive applications, collaborative projects. Each project demonstrates my technical progression, adaptability and methodological approach to development. Structured code, complete technical documentation.",
                "home.portfolio.button": "View my projects",

                // Research Section
                "home.research.title": "Academic Research Project",
                "home.research.description": "<strong>Sociological Study - Transversal Skills Development</strong><br>University research project demonstrating my skills in methodology, critical analysis and technical writing. Complete project management: planning, documentary research, data analysis, professional presentation. Concrete example of intellectual rigor and ability to handle complex subjects.",
                "home.research.skills": "<strong>Skills developed:</strong> Project management • Methodological research • Critical analysis • Professional communication",
                "home.research.button": "View methodology",

                // Contact Section
                "home.contact.title": "Seeking Internship - September 2025",
                "home.contact.description": "<strong>Professional objective: Web development internship contract</strong><br><br>Serious and motivated student, I am looking for a company for a web development internship starting September 2025. Ready to invest in your projects, I bring creativity, technical rigor and passion for technological innovation. Immediately available for interviews.",
                "home.contact.cv.button": "View my CV",
                "home.contact.projects.button": "View my projects",
                "home.contact.status.title": "Active application",
                "home.contact.status.subtitle": "Available for interview • Motivated • Ready to contribute",

                // Footer
                "footer.title": "Dylan Carion - Junior Web Developer - BTS SIO SLAM",
                "footer.subtitle": "Seeking web development internship - September 2025",
                "footer.description": "Professional portfolio - Active application",

                // Notifications
                "notification.redirect": "Redirecting to",
                "notification.not.found": "No page found.",
                "logout.loading": "Logging out...",
                "logout.title": "Logout in progress",
                "logout.message": "Thank you for visiting my professional portfolio"
            }
        };
        
        this.init();
    }

    init() {
        this.createLanguageSelector();
        this.applyLanguage(this.currentLanguage);
    }

    createLanguageSelector() {
        // Créer le sélecteur de langue
        const langSelector = document.createElement('div');
        langSelector.className = 'language-selector';
        langSelector.innerHTML = `
            <button class="lang-btn ${this.currentLanguage === 'fr' ? 'active' : ''}" data-lang="fr">
                🇫🇷 FR
            </button>
            <button class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                🇬🇧 EN
            </button>
        `;

        // Ajouter les événements
        langSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const newLang = e.target.dataset.lang;
                this.switchLanguage(newLang);
            }
        });

        // Insérer dans le header
        const searchArea = document.querySelector('.search-area');
        if (searchArea) {
            searchArea.insertBefore(langSelector, searchArea.firstChild);
        }
    }

    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Mettre à jour les boutons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.applyLanguage(lang);
        
        // Notification de changement
        this.showLanguageChangeNotification(lang);
    }

    applyLanguage(lang) {
        const translations = this.translations[lang];
        
        // Appliquer toutes les traductions
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (translations[key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[key];
                } else {
                    element.innerHTML = translations[key];
                }
            }
        });

        // Mettre à jour l'attribut lang du document
        document.documentElement.lang = lang;
    }

    showLanguageChangeNotification(lang) {
        const message = lang === 'fr' ? 'Langue changée en Français' : 'Language changed to English';
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }

    // Méthode pour obtenir une traduction
    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Initialiser le gestionnaire de langues
let languageManager;

document.addEventListener('DOMContentLoaded', function() {
    languageManager = new LanguageManager();
});

// Export pour utilisation dans d'autres scripts
window.LanguageManager = LanguageManager;