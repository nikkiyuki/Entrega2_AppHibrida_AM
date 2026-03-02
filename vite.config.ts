import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.8], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox', active: false }],
      },
      gifsicle: { optimizationLevel: 7 },
      webp: { quality: 75 },
    }),
  ],
  build: {
    minify: 'esbuild',
  },
})
