import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },

  server: {
    host: true,
    allowedHosts: [
      "consensus-corporations-administered-movement.trycloudflare.com"
    ]
  }
})