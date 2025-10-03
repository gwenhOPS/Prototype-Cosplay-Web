import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // bikin server bisa diakses dari jaringan lokal
    port: 5190,      // ganti kalau port ini bentrok
    
  },
})
