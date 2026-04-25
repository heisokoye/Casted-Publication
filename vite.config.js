import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks to reduce initial bundle size and TBT
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion', 'gsap'],
          'ui': ['react-icons', 'swiper']
        }
      }
    }
  },
  // Optimize dependencies for faster initial load
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Exclude heavy libraries from pre-bundling to reduce TBT
    exclude: ['framer-motion', 'gsap']
  },
  resolve: {
    conditions: ['import', 'module', 'browser', 'default']
  }
})