// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'shanti-dm-automation.onrender.com',
      'cyclonic-sam-difficultly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok.io',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'https://shanti-dm-automation.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/webhooks': {
        target: 'https://shanti-dm-automation.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'https://shanti-dm-automation.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
