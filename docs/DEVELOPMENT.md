# 🚀 Guide de Développement

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build

# Tests
npm run test

# Vérification des types
npm run type-check

# Linting
npm run lint
```

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `dev` | Serveur de développement avec HMR |
| `build` | Build de production optimisé |
| `preview` | Aperçu du build de production |
| `test` | Exécution des tests Jest |
| `test:watch` | Tests en mode watch |
| `test:coverage` | Tests avec rapport de couverture |
| `e2e` | Tests end-to-end avec Playwright |
| `type-check` | Vérification TypeScript |
| `lint` | ESLint + Prettier |
| `lint:fix` | Correction automatique |

## Architecture technique

### 🏗️ **Stack technologique**
- **TypeScript** : Typage statique et développement moderne
- **Vite** : Build tool rapide avec HMR
- **CSS moderne** : Variables CSS, Grid, Flexbox
- **ESM** : Modules ES6 avec imports/exports
- **Jest** : Tests unitaires et d'intégration
- **Playwright** : Tests end-to-end
- **ESLint + Prettier** : Qualité et formatage du code

### 📁 **Organisation des imports**
```typescript
// ✅ Correct - avec extension .js pour ESM
import { Component } from './Component.js';
import { utils } from '../utils/index.js';

// ❌ Incorrect - sans extension
import { Component } from './Component';
```

### 🎨 **Conventions CSS**
```css
/* Variables organisées par catégorie */
:root {
  /* Couleurs */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  
  /* Typographie */
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}
```

### 🧪 **Convention de tests**
```typescript
// Nom du fichier : Component.test.ts
describe('Component', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

## Bonnes pratiques

### 📦 **Gestion des modules**
- Utilisez les index.ts pour centraliser les exports
- Préférez les imports nommés aux imports par défaut
- Organisez les imports par catégorie (externes, internes, relatifs)

### 🔧 **Configuration**
- Toutes les constantes dans `src/config/` ou `src/constants/`
- Variables d'environnement documentées
- Configuration TypeScript stricte

### 🎯 **Performance**
- Lazy loading des composants non critiques
- Optimisation des images (WebP, tailles multiples)
- Code splitting automatique avec Vite
- CSS critique inline

### ♿ **Accessibilité**
- Attributs ARIA appropriés
- Navigation au clavier
- Contrastes suffisants
- Textes alternatifs pour les images

## Déploiement

### 📤 **GitHub Pages**
```bash
npm run build
npm run deploy
```

### 🚀 **Production**
- Build optimisé avec minification
- Source maps pour le debugging
- Compression gzip/brotli
- Cache headers appropriés