import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * GitHub Pages has no SPA fallback: serving index.html as 404.html lets deep links such as
 * /alvyl-test/about load the app, which then routes client-side.
 */
function spaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = path.join(outDir, 'index.html')
      /* Client build only (the SSR prerender build has no index.html). */
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  /* "/" locally; the GitHub Pages build sets BASE_PATH=/alvyl-test/ (see .github/workflows). */
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
})
