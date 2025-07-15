import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['node-forge']
  },
  build: {
    commonjsOptions: {
      include: [/node-forge/, /node_modules/]
    }
  }
})
