/**
 * Script d'optimisation des images
 * Convertit et compresse les images pour de meilleures performances
 */

class ImageOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.createOptimizedImages();
    this.setupResponsiveImages();
    this.setupWebPSupport();
  }

  // Créer des versions optimisées des images
  createOptimizedImages() {
    const images = [
      {
        original: 'images/Programming_code.jpg',
        sizes: [
          { width: 800, suffix: '-large' },
          { width: 400, suffix: '-medium' },
          { width: 200, suffix: '-small' }
        ]
      },
      {
        original: 'images/Logo Afip.jpg',
        sizes: [
          { width: 200, suffix: '-large' },
          { width: 100, suffix: '-medium' },
          { width: 50, suffix: '-small' }
        ]
      }
    ];

    // Instructions pour optimiser manuellement les images
    console.log('🖼️ Instructions pour optimiser les images:');
    console.log('1. Utilisez un outil comme TinyPNG, Squoosh.app ou ImageOptim');
    console.log('2. Créez plusieurs tailles pour chaque image:');
    
    images.forEach(img => {
      console.log(`\n📁 ${img.original}:`);
      img.sizes.forEach(size => {
        const newName = img.original.replace(/\.(jpg|jpeg|png)$/, `${size.suffix}.$1`);
        console.log(`  - ${newName} (largeur: ${size.width}px)`);
      });
    });

    console.log('\n3. Convertissez aussi en format WebP pour une meilleure compression');
    console.log('4. Utilisez les attributs srcset et sizes dans le HTML');
  }

  // Configuration des images responsives
  setupResponsiveImages() {
    const imgElements = document.querySelectorAll('img[data-responsive]');
    
    imgElements.forEach(img => {
      const baseName = img.src.replace(/\.(jpg|jpeg|png)$/, '');
      const extension = img.src.match(/\.(jpg|jpeg|png)$/)[0];
      
      // Créer le srcset
      const srcset = [
        `${baseName}-small${extension} 200w`,
        `${baseName}-medium${extension} 400w`,
        `${baseName}-large${extension} 800w`
      ].join(', ');
      
      img.setAttribute('srcset', srcset);
      img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
    });
  }

  // Support WebP avec fallback
  setupWebPSupport() {
    const supportsWebP = this.checkWebPSupport();
    
    if (supportsWebP) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  }

  checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  // Lazy loading avancé avec Intersection Observer
  setupAdvancedLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const picture = img.closest('picture');
          
          if (picture) {
            // Charger les sources WebP et fallback
            const sources = picture.querySelectorAll('source');
            sources.forEach(source => {
              if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
              }
            });
          }
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// CSS pour les images optimisées
const imageCSS = `
  /* Support WebP */
  .webp .hero-image {
    background-image: url('images/hero.webp');
  }
  
  .no-webp .hero-image {
    background-image: url('images/hero.jpg');
  }

  /* Images responsives */
  img {
    max-width: 100%;
    height: auto;
    transition: opacity 0.3s ease;
  }

  img[data-src] {
    opacity: 0;
  }

  img.loaded {
    opacity: 1;
  }

  /* Placeholder pour le loading */
  img.loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    min-height: 200px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Progressive JPEG effect */
  img.progressive {
    filter: blur(5px);
    transition: filter 0.3s ease;
  }

  img.progressive.loaded {
    filter: none;
  }
`;

const style = document.createElement('style');
style.textContent = imageCSS;
document.head.appendChild(style);

// Initialiser l'optimiseur d'images
document.addEventListener('DOMContentLoaded', () => {
  new ImageOptimizer();
});

export default ImageOptimizer;