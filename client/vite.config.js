import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'SelvaGuide — Tu guía en el bolsillo',
        short_name: 'SelvaGuide',
        description: 'Guía digital para descubrir la Amazonía peruana: catálogo de flora y fauna, rutas guiadas por GPS, trivia y mapas sin conexión.',
        lang: 'es',
        theme_color: '#2C3E35',
        background_color: '#F7F5F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\/mods\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapas-voyager',
              expiration: { maxEntries: 3000, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\/tile\.openstreetmap\.org\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapas-osm',
              expiration: { maxEntries: 3000, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:9000',
      '/uploads': 'http://localhost:9000'
    }
  }
});