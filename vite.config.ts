import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'bundle-report.html', // report file name
      open: true,                     // opens report automatically after build
      gzipSize: true,                 // include gzip size
      brotliSize: true,               // include brotli size
    }),
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
