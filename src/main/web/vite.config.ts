import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['node-forge']
  },
  build: {
    commonjsOptions: {
      include: [/node-forge/, /node_modules/]
    }
  }
})
