# 📚 Documentation des Composants

## Vue d'ensemble

Tous les composants suivent une architecture modulaire avec TypeScript et des méthodes standardisées.

## Structure d'un composant

```typescript
export class ComponentName {
  private element: HTMLElement;

  constructor(containerId: string) {
    this.element = this.createElement();
    this.attachToDOM(containerId);
    this.addEventListeners();
  }

  private createElement(): HTMLElement {
    // Création de l'élément DOM
  }

  private attachToDOM(containerId: string): void {
    // Attachement au DOM
  }

  private addEventListeners(): void {
    // Gestion des événements
  }

  public destroy(): void {
    // Nettoyage des ressources
  }
}
```

## Composants disponibles

### 🏠 **App**
- **Rôle** : Composant racine de l'application
- **Responsabilités** : Initialisation, coordination des autres composants
- **Méthodes** : `init()`, `destroy()`

### 🧭 **Header**
- **Rôle** : Navigation principale
- **Responsabilités** : Menu, logo, navigation responsive
- **Interactions** : Scroll spy, menu mobile

### 🎯 **Hero**
- **Rôle** : Section d'accueil
- **Responsabilités** : Présentation, CTA principal
- **Animations** : Typewriter effect, parallax

### 👤 **About**
- **Rôle** : Section à propos
- **Responsabilités** : Présentation personnelle, compétences
- **Contenu** : Texte descriptif, photo, liens sociaux

### 💼 **Projects**
- **Rôle** : Portfolio de projets
- **Responsabilités** : Galerie, filtres, détails projets
- **Interactions** : Modal, filtres, pagination

### 🛠️ **Skills**
- **Rôle** : Compétences techniques
- **Responsabilités** : Barres de progression, catégories
- **Animations** : Progress bars, reveal on scroll

### 📋 **Experience**
- **Rôle** : Parcours professionnel
- **Responsabilités** : Timeline, détails expériences
- **Layout** : Timeline verticale responsive

### 📞 **Contact**
- **Rôle** : Formulaire de contact
- **Responsabilités** : Validation, envoi, feedback
- **Fonctionnalités** : Validation temps réel, captcha

### 🦶 **Footer**
- **Rôle** : Pied de page
- **Responsabilités** : Liens utiles, copyright, mentions légales
- **Contenu** : Liens sociaux, navigation secondaire

## Services utilitaires

### 📝 **Logger**
```typescript
// Utilisation
Logger.info('Message informatif');
Logger.error('Erreur détectée', error);
Logger.debug('Debug en développement');
```

### 🎨 **ThemeManager**
```typescript
// Gestion des thèmes
ThemeManager.setTheme('dark');
ThemeManager.toggleTheme();
const currentTheme = ThemeManager.getCurrentTheme();
```

### 🌍 **I18nManager**
```typescript
// Internationalisation
I18nManager.setLanguage('en');
const text = I18nManager.t('common.welcome');
```

### 🧭 **Router**
```typescript
// Navigation
Router.navigate('/projects');
Router.addRoute('/about', AboutComponent);
```

## Cycle de vie des composants

1. **Construction** : `new Component(containerId)`
2. **Initialisation** : Création du DOM et attachement
3. **Événements** : Ajout des listeners
4. **Utilisation** : Interactions utilisateur
5. **Destruction** : `component.destroy()` - Nettoyage

## Conventions de développement

### 🏷️ **Nommage**
- Classes : PascalCase (`HeaderComponent`)
- Méthodes : camelCase (`createElement`)
- Propriétés privées : underscore (`_element`)
- Constantes : SCREAMING_SNAKE_CASE (`MAX_ITEMS`)

### 🎯 **Responsabilités**
- Un composant = une responsabilité
- Encapsulation des données privées
- Communication via événements personnalisés
- Gestion propre des ressources

### 🔄 **États**
- État local dans les propriétés privées
- État global via les services utilitaires
- Réactivité via les observateurs d'événements
- Persistence via localStorage si nécessaire

### 🎨 **Styling**
- Classes CSS préfixées par le nom du composant
- Variables CSS pour la customisation
- Responsive design mobile-first
- Thème sombre/clair supporté

### ♿ **Accessibilité**
- Attributs ARIA appropriés
- Navigation clavier fonctionnelle
- Contrastes respectés
- Labels descriptifs

## Tests

### 🧪 **Tests unitaires**
```typescript
describe('ComponentName', () => {
  it('should initialize correctly', () => {
    const component = new ComponentName('test-container');
    expect(component).toBeDefined();
  });
});
```

### 🔍 **Tests d'intégration**
```typescript
describe('App Integration', () => {
  it('should initialize all components', () => {
    const app = new App();
    app.init();
    // Vérifications...
  });
});
```