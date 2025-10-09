# 🚀 Portfolio de Dylan Carion

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://github.com/dylancarion/portfolio)

## 📖 À propos

Portfolio moderne et responsive développé pour présenter mes compétences en tant qu'étudiant en **BTS SIO SLAM** (Services Informatiques aux Organisations - Solutions Logicielles et Applications Métiers).

Ce projet démontre ma maîtrise des technologies web modernes et de l'architecture logicielle.

### 🎯 **Objectifs du projet**
- ✅ Présenter mes compétences techniques et projets
- ✅ Démontrer la maîtrise de TypeScript et de l'architecture moderne
- ✅ Créer une expérience utilisateur fluide et accessible
- ✅ Optimiser les performances et le SEO

## 🛠️ Stack technique

### **Frontend**
- **TypeScript** : Typage statique et développement robuste
- **CSS3** : Variables CSS, Grid, Flexbox, animations
- **HTML5** : Sémantique moderne et accessibilité

### **Build & Tooling**
- **Vite** : Build tool ultrarapide avec HMR
- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique
- **Husky** : Git hooks pour la qualité

### **Testing**
- **Jest** : Tests unitaires et d'intégration
- **Playwright** : Tests end-to-end
- **Testing Library** : Tests centrés utilisateur

### **Déploiement**
- **GitHub Pages** : Hébergement gratuit et fiable
- **GitHub Actions** : CI/CD automatisé

## 🚀 Démarrage rapide

### **Prérequis**
- Node.js 18+ 
- npm 9+

### **Installation**
```bash
# Cloner le projet
git clone https://github.com/dylancarion/portfolio.git
cd portfolio

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### **Scripts disponibles**
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run test         # Tests unitaires
npm run e2e          # Tests end-to-end
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript
```

## 📁 Architecture

```
src/
├── components/           # Composants TypeScript
│   ├── App.ts           # Composant racine
│   ├── Header.ts        # Navigation
│   ├── Hero.ts          # Section d'accueil
│   ├── About.ts         # À propos
│   ├── Projects.ts      # Portfolio projets
│   ├── Skills.ts        # Compétences
│   ├── Experience.ts    # Parcours
│   ├── Contact.ts       # Formulaire contact
│   ├── Footer.ts        # Pied de page
│   └── index.ts         # Exports centralisés
│
├── utils/               # Services utilitaires
│   ├── Logger.ts        # Système de logs
│   ├── ThemeManager.ts  # Gestion thèmes
│   ├── I18nManager.ts   # Internationalisation
│   ├── Router.ts        # Navigation SPA
│   └── index.ts         # Exports centralisés
│
├── styles/              # Architecture CSS
│   ├── base/           # Reset, variables, typo
│   ├── layouts/        # Layouts globaux
│   ├── components/     # Styles composants
│   ├── themes/         # Thèmes (dark/light)
│   └── main.css        # Point d'entrée CSS
│
├── data/               # Données structurées
│   ├── projects.ts     # Données projets
│   ├── skills.ts       # Compétences techniques
│   ├── experiences.ts  # Parcours professionnel
│   └── index.ts        # Exports centralisés
│
├── types/              # Définitions TypeScript
│   ├── components.ts   # Types composants
│   ├── data.ts         # Types données
│   └── index.ts        # Exports centralisés
│
├── config/             # Configuration app
│   └── index.ts        # Config centralisée
│
├── constants/          # Constantes globales
│   └── index.ts        # Constantes
│
├── tests/              # Tests et utilitaires
│   ├── helpers/        # Helpers de test
│   └── setup.ts        # Configuration Jest
│
└── main.ts             # Point d'entrée app
```

## ✨ Fonctionnalités

### 🎨 **Interface utilisateur**
- Design moderne et épuré
- Animation fluides et micro-interactions
- Thème sombre/clair avec persistance
- Navigation responsive et intuitive

### 📱 **Responsive Design**
- Mobile-first approach
- Breakpoints optimisés
- Images adaptatives
- Touch-friendly sur mobile

### ♿ **Accessibilité**
- Navigation clavier complète
- Attributs ARIA appropriés
- Contrastes respectés (WCAG 2.1)
- Screen readers friendly

### ⚡ **Performance**
- Code splitting automatique
- Lazy loading des images
- CSS critique inline
- Bundle optimisé < 100KB

### 🌍 **SEO & PWA**
- Meta tags optimisés
- Schema.org markup
- Sitemap XML
- Service Worker (à venir)

## 🎯 Sections du portfolio

### **🏠 Accueil**
- Présentation avec effet typewriter
- Call-to-action principal
- Animation de parallax

### **👤 À propos**
- Présentation personnelle
- Photo professionnelle
- Liens vers réseaux sociaux

### **💼 Projets**
- Galerie interactive
- Filtres par technologie
- Modal avec détails projets
- Liens GitHub et démo

### **🛠️ Compétences**
- Barres de progression animées
- Catégories organisées
- Icons représentatives

### **📋 Expérience**
- Timeline responsive
- Détails des expériences
- Progression chronologique

### **📞 Contact**
- Formulaire fonctionnel
- Validation en temps réel
- Feedback utilisateur

## 🧪 Tests

### **Tests unitaires**
```bash
npm run test                    # Tests simples
npm run test:watch             # Mode watch
npm run test:coverage          # Avec couverture
```

### **Tests end-to-end**
```bash
npm run e2e                    # Tests Playwright
npm run e2e:ui                 # Interface graphique
```

### **Couverture de code**
- Objectif : > 90% de couverture
- Composants critiques : 100%
- Tests automatisés en CI/CD

## 📈 Performance

### **Metrics Lighthouse**
- 🟢 Performance : 95+
- 🟢 Accessibilité : 100
- 🟢 Best Practices : 100
- 🟢 SEO : 100

### **Bundle Analysis**
- Total size : < 100KB (gzipped)
- CSS : < 15KB
- JavaScript : < 35KB
- Images : Optimisées WebP

## 🚀 Déploiement

### **GitHub Pages**
```bash
npm run build
npm run deploy
```

### **CI/CD Pipeline**
- Tests automatiques sur PR
- Build et déploiement sur main
- Notifications de status

## 📄 Documentation

- 📖 [Architecture](docs/ARCHITECTURE.md)
- 🛠️ [Guide développement](docs/DEVELOPMENT.md)
- 📚 [Documentation composants](docs/COMPONENTS.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Dylan Carion**
- Étudiant BTS SIO SLAM
- 📧 Email : [dylan.carion@example.com](mailto:dylan.carion@example.com)
- 💼 LinkedIn : [linkedin.com/in/dylancarion](https://linkedin.com/in/dylancarion)
- 🐙 GitHub : [github.com/dylancarion](https://github.com/dylancarion)

---

<div align="center">
  <p>Développé avec ❤️ par Dylan Carion</p>
  <p>© 2024 - Tous droits réservés</p>
</div>