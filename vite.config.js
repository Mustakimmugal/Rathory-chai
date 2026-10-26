import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/logo.jpg', 'images/hero-bg.jpg', 'images/masala-chai.jpg', 'images/kulhad-chai.jpg'],
      manifest: {
        name: 'Rathory Chai Wale',
        short_name: 'Rathory Chai',
        description: 'Premium Artisanal Chai Cafe — Har Cup Mein Ek Kahani',
        theme_color: '#0B1220',
        background_color: '#0B1220',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/images/logo.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/images/logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}']
      }
    })
  ],
})
