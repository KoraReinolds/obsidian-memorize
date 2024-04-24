import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: false,
    lib: {
      entry: './src/main.ts',
      fileName: () => 'main.js',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['vue', 'obsidian'],
      output: {
        format: 'cjs',
        globals: {
          vue: 'Vue'
        }
      }
    },
    outDir: './',
    target: 'esnext'
  }
})
