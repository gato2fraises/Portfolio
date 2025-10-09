class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.currentCategory = 'all';
        this.searchTerm = '';
        
        this.init();
    }

    async init() {
        try {
            await this.loadArticles();
            this.setupEventListeners();
            this.renderArticles();
            this.setupPagination();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du blog:', error);
            this.showError('Erreur lors du chargement des articles');
        }
    }

    async loadArticles() {
        // Simuler un appel API ou charger depuis un fichier JSON
        this.articles = [
            {
                id: 1,
                title: 'Les bases du développement web moderne',
                slug: 'bases-developpement-web-moderne',
                excerpt: 'Découvrez les fondamentaux du développement web avec HTML5, CSS3 et JavaScript ES6+',
                content: `
                    <h2>Introduction au développement web moderne</h2>
                    <p>Le développement web a considérablement évolué ces dernières années. Dans cet article, nous explorerons les technologies fondamentales qui constituent la base du développement web moderne.</p>
                    
                    <h3>HTML5 : La structure</h3>
                    <p>HTML5 apporte de nouveaux éléments sémantiques qui améliorent l'accessibilité et le référencement :</p>
                    <ul>
                        <li><code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code></li>
                        <li><code>&lt;section&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;aside&gt;</code></li>
                        <li><code>&lt;footer&gt;</code> pour une structure claire</li>
                    </ul>
                    
                    <h3>CSS3 : Le style et les animations</h3>
                    <p>CSS3 révolutionne la présentation avec :</p>
                    <ul>
                        <li>Flexbox et Grid pour les layouts</li>
                        <li>Variables CSS pour la cohérence</li>
                        <li>Animations et transitions fluides</li>
                    </ul>
                    
                    <h3>JavaScript ES6+ : L'interactivité</h3>
                    <p>Les nouvelles fonctionnalités JavaScript modernes incluent :</p>
                    <ul>
                        <li>Classes et modules</li>
                        <li>Async/await pour la programmation asynchrone</li>
                        <li>Destructuring et template literals</li>
                    </ul>
                `,
                category: 'tutorials',
                author: 'Dylan Carion',
                date: '2025-10-09',
                readTime: 5,
                tags: ['HTML5', 'CSS3', 'JavaScript', 'Développement Web'],
                image: 'images/Programming_code.jpg'
            },
            {
                id: 2,
                title: 'Créer un système de thème sombre/clair',
                slug: 'systeme-theme-sombre-clair',
                excerpt: 'Tutorial complet pour implémenter un système de thème dynamique avec JavaScript et CSS',
                content: `
                    <h2>Implémenter un système de thème dynamique</h2>
                    <p>Dans ce tutorial, nous allons créer un système complet de thème sombre/clair pour votre site web.</p>
                    
                    <h3>1. Structure CSS avec des variables</h3>
                    <pre><code>:root {
    --primary: #3498db;
    --background: #ffffff;
    --text: #333333;
}

[data-theme="dark"] {
    --primary: #2980b9;
    --background: #1a1a1a;
    --text: #ffffff;
}</code></pre>
                    
                    <h3>2. JavaScript pour le changement de thème</h3>
                    <pre><code>class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme();
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
}</code></pre>
                    
                    <h3>3. Détection des préférences système</h3>
                    <p>Respecter les préférences de l'utilisateur :</p>
                    <pre><code>const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? 'dark' : 'light';</code></pre>
                `,
                category: 'javascript',
                author: 'Dylan Carion',
                date: '2025-10-08',
                readTime: 8,
                tags: ['JavaScript', 'CSS', 'Theme', 'UX'],
                image: 'images/Programming_code.jpg'
            },
            {
                id: 3,
                title: 'Mon expérience avec le BTS SIO SLAM',
                slug: 'experience-bts-sio-slam',
                excerpt: 'Retour d\'expérience sur ma formation en BTS SIO option SLAM et les compétences acquises',
                content: `
                    <h2>Mon parcours en BTS SIO SLAM</h2>
                    <p>Je partage ici mon expérience de formation en BTS Services Informatiques aux Organisations, option Solutions Logicielles et Applications Métiers.</p>
                    
                    <h3>Les compétences développées</h3>
                    <p>Cette formation m'a permis d'acquérir :</p>
                    <ul>
                        <li>Développement d'applications web et mobiles</li>
                        <li>Gestion de bases de données</li>
                        <li>Méthodologies de développement Agile</li>
                        <li>Veille technologique et sécurité</li>
                    </ul>
                    
                    <h3>Projets réalisés</h3>
                    <p>Durant ma formation, j'ai développé plusieurs projets :</p>
                    <ul>
                        <li>Application de gestion de stock en PHP</li>
                        <li>Site web responsive avec framework CSS</li>
                        <li>API REST avec Node.js</li>
                        <li>Application mobile hybride</li>
                    </ul>
                    
                    <h3>Perspectives d'avenir</h3>
                    <p>Cette formation me prépare à intégrer le monde professionnel en tant que développeur junior, avec une solide base technique et une capacité d'adaptation aux nouvelles technologies.</p>
                `,
                category: 'experiences',
                author: 'Dylan Carion',
                date: '2025-10-07',
                readTime: 6,
                tags: ['BTS SIO', 'Formation', 'Expérience', 'Développement'],
                image: 'images/Logo Afip.jpg'
            },
            {
                id: 4,
                title: 'Optimisation CSS : Flexbox vs Grid',
                slug: 'optimisation-css-flexbox-grid',
                excerpt: 'Comparaison approfondie entre Flexbox et CSS Grid pour des layouts optimaux',
                content: `
                    <h2>Flexbox vs CSS Grid : Faire le bon choix</h2>
                    <p>Comprendre quand utiliser Flexbox ou CSS Grid est essentiel pour créer des layouts efficaces.</p>
                    
                    <h3>Flexbox : Pour les layouts 1D</h3>
                    <p>Flexbox excelle pour :</p>
                    <ul>
                        <li>Alignement d'éléments en ligne ou en colonne</li>
                        <li>Distribution d'espace dans un conteneur</li>
                        <li>Centrage d'éléments</li>
                        <li>Navigation responsive</li>
                    </ul>
                    
                    <h3>CSS Grid : Pour les layouts 2D</h3>
                    <p>CSS Grid est idéal pour :</p>
                    <ul>
                        <li>Layouts complexes à deux dimensions</li>
                        <li>Positionnement précis d'éléments</li>
                        <li>Grilles responsives</li>
                        <li>Superposition d'éléments</li>
                    </ul>
                    
                    <h3>Exemple pratique</h3>
                    <pre><code>/* Layout principal avec Grid */
.container {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    gap: 20px;
}

/* Navigation avec Flexbox */
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}</code></pre>
                `,
                category: 'html-css',
                author: 'Dylan Carion',
                date: '2025-10-06',
                readTime: 7,
                tags: ['CSS', 'Flexbox', 'Grid', 'Layout'],
                image: 'images/Programming_code.jpg'
            }
        ];
        
        this.filteredArticles = [...this.articles];
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('blog-search');
        const searchBtn = document.getElementById('search-btn');
        
        searchInput?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterArticles();
        });
        
        searchBtn?.addEventListener('click', () => {
            this.filterArticles();
        });

        // Filtres de catégorie
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Retirer la classe active des autres boutons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                e.target.classList.add('active');
                
                this.currentCategory = e.target.dataset.category;
                this.filterArticles();
            });
        });

        // Modal
        const modal = document.getElementById('article-modal');
        const closeModal = document.getElementById('close-modal');
        
        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    filterArticles() {
        this.filteredArticles = this.articles.filter(article => {
            const matchesCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
            const matchesSearch = this.searchTerm === '' || 
                article.title.toLowerCase().includes(this.searchTerm) ||
                article.excerpt.toLowerCase().includes(this.searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
            
            return matchesCategory && matchesSearch;
        });
        
        this.currentPage = 1;
        this.renderArticles();
        this.setupPagination();
    }

    renderArticles() {
        const container = document.getElementById('articles-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        if (articlesToShow.length === 0) {
            container.innerHTML = '<div class="no-articles">Aucun article trouvé</div>';
            return;
        }

        container.innerHTML = articlesToShow.map(article => `
            <article class="article-card" data-id="${article.id}">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    <div class="article-category">${this.getCategoryName(article.category)}</div>
                </div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">${this.formatDate(article.date)}</span>
                        <span class="article-read-time">${article.readTime} min</span>
                    </div>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="read-more-btn" onclick="blogManager.openArticle(${article.id})">
                        Lire l'article
                    </button>
                </div>
            </article>
        `).join('');
    }

    setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Bouton précédent
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="blogManager.changePage(${this.currentPage - 1})">‹</button>`;
        }
        
        // Numéros de page
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="page-btn ${isActive}" onclick="blogManager.changePage(${i})">${i}</button>`;
        }
        
        // Bouton suivant
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" onclick="blogManager.changePage(${this.currentPage + 1})">›</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.renderArticles();
        this.setupPagination();
        
        // Scroll vers le haut des articles
        document.getElementById('articles-container').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    openArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        const modal = document.getElementById('article-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <article class="full-article">
                <header class="article-header">
                    <div class="article-category">${this.getCategoryName(article.category)}</div>
                    <h1>${article.title}</h1>
                    <div class="article-meta">
                        <span>Par ${article.author}</span>
                        <span>${this.formatDate(article.date)}</span>
                        <span>${article.readTime} min de lecture</span>
                    </div>
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </header>
                <div class="article-body">
                    ${article.content}
                </div>
            </article>
        `;
        
        modal.style.display = 'flex';
    }

    getCategoryName(category) {
        const categories = {
            'javascript': 'JavaScript',
            'html-css': 'HTML/CSS',
            'tutorials': 'Tutorials',
            'experiences': 'Expériences'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showError(message) {
        const container = document.getElementById('articles-container');
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// Initialiser le blog quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
});