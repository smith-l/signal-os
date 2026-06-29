import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://signal-os-81e.pages.dev',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
