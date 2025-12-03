import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Polyfill Node.js stream module for browser
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define global for Node.js compatibility
      define: {
        global: 'globalThis',
      },
    },
  },
})
