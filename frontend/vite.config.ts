import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// When deploying to GitHub Pages the app lives at /CancerProgressionAtlas/
// In production with a custom domain or Railway it lives at /
const base = process.env.GITHUB_PAGES === 'true' ? '/CancerProgressionAtlas/' : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
