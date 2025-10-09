/**
 * Configuration Vite pour le portfolio TypeScript
 * Build et développement moderne
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Configuration du build
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    
    // Configuration Rollup
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html'),
        contact: resolve(__dirname, 'contact.html'),
        projet: resolve(__dirname, 'projet.html'),
        connection: resolve(__dirname, 'connection.html'),
        easteregg: resolve(__dirname, 'easteregg.html'),
        sectePage: resolve(__dirname, 'page secte.html')
      },
      output: {
        manualChunks: {
          vendor: ['gsap'],
          utils: ['./src/utils/helpers.ts']
        }
      }
    },
    
    // Optimisation des chunks
    chunkSizeWarningLimit: 1000,
    
    // Configuration Terser pour la minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Configuration du serveur de développement
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    cors: true
  },
  
  // Résolution des modules
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  
  // Configuration CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/variables.scss";'
      }
    }
  },
  
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['gsap'],
    exclude: []
  },
  
  // Configuration des variables d'environnement
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },
  
  // Configuration PWA (si plugin installé)
  // plugins: [
  //   // VitePWA plugin configuration would go here
  // ],
  
  // Base URL pour le déploiement
  base: process.env.NODE_ENV === 'production' ? '/Portfolio/' : '/',
  
  // Configuration des assets
  assetsInclude: ['**/*.pdf'],
  
  // Mode expérimental
  experimental: {
    renderBuiltUrl(filename) {
      return { relative: true };
    }
  }
});