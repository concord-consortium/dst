import { resolve, dirname } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// hack for esmodules
const __dirname = dirname(import.meta.url.substring('file://'.length))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // empty string so that relative paths are used when viewing branches
  base: '',
  build: {
    rollupOptions: {
      input: {
        map: resolve(__dirname, 'maps.html')
      }
    }
  }
})
