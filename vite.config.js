import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Bind IPv4 loopback explicitly: on Windows, Vite's default host resolves to ::1 only, which Playwright's 127.0.0.1 webServer check can't reach.
    host: '127.0.0.1',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
    env: {
      VITE_SUPABASE_URL: 'http://localhost',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
  },
})
