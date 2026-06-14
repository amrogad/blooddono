import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    // Bind IPv4 loopback explicitly: on Windows, Vite's default host resolves to ::1 only, which Playwright's 127.0.0.1 webServer check can't reach.
    host: '127.0.0.1',
  },
})
