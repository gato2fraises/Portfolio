# 📁 Architecture du Projet

## Structure des dossiers

```
📁 src/
├── 📁 components/     # Composants de l'interface utilisateur
│   ├── App.ts         # Composant principal
│   ├── Header.ts      # En-tête et navigation
│   ├── Hero.ts        # Section d'accueil
│   ├── About.ts       # Section à propos
│   ├── Projects.ts    # Portfolio de projets
│   ├── Skills.ts      # Compétences techniques
│   ├── Experience.ts  # Expérience professionnelle
│   ├── Contact.ts     # Formulaire de contact
│   ├── Footer.ts      # Pied de page
│   └── index.ts       # Export centralisé
│
├── 📁 utils/          # Utilitaires et services
│   ├── logger.ts      # Système de logging
│   ├── ThemeManager.ts # Gestion des thèmes
│   ├── I18nManager.ts # Internationalisation
│   ├── Router.ts      # Navigation SPA
│   └── index.ts       # Export centralisé
│
├── 📁 types/          # Définitions TypeScript
│   └── index.ts       # Types globaux
│
├── 📁 data/           # Données et contenu
│   ├── portfolio.ts   # Projets, expériences, compétences
│   ├── translations.ts # Traductions fr/en
│   └── index.ts       # Export centralisé
│
├── 📁 config/         # Configuration
│   └── index.ts       # Constantes et paramètres
│
├── 📁 styles/         # Styles CSS modulaires
│   ├── 📁 base/       # Styles fondamentaux
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── typography.css
│   │   └── index.css
│   │
│   ├── 📁 layouts/    # Systèmes de mise en page
│   │   ├── grid.css
│   │   └── index.css
│   │
│   ├── 📁 themes/     # Variantes de couleurs
│   │   ├── light.css
│   │   ├── dark.css
│   │   └── index.css
│   │
│   ├── 📁 components/ # Styles de composants
│   │   └── index.css
│   │
│   └── main.css       # Point d'entrée CSS
│
└── main.ts            # Point d'entrée principal
```

## Principes d'organisation

### 🎯 **Modularité**
- Chaque dossier a son propre `index.ts` pour les exports
- Imports relatifs avec extensions `.js` pour la compatibilité ESM
- Séparation claire des responsabilités

### 🔧 **Configuration centralisée**
- `src/config/index.ts` : toutes les constantes et paramètres
- Configuration TypeScript optimisée
- Variables CSS organisées par thème

### 🎨 **Styles organisés**
- Architecture CSS modulaire et scalable
- Index CSS pour chaque catégorie de styles
- Thèmes séparés pour faciliter la maintenance

### 📊 **Types structurés**
- Définitions TypeScript centralisées
- Types exportés depuis les modules appropriés
- Compatibilité stricte avec ESM

### 🧪 **Tests organisés**
- Helpers et utilitaires partagés
- Structure miroir du code source
- Configuration Jest centralisée