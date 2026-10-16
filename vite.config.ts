import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  // Projekt-Pages laufen unter /justserve-kispi-175/; im Dev-Server unter /.
  base: command === 'build' ? '/justserve-kispi-175/' : '/',
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
