import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
  },
  preview: {
    https: true,
  },
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  }
})
