import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {

      "/dashboard/stats": {
        target: "http://localhost:3000",
        changeOrigin: true
      },

      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true
      },

      "/admin-api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },

      "/assinatura": {
        target: "http://localhost:3000",
        changeOrigin: true
      }

    }
  }

})
