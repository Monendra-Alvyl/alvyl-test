import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execFile } from 'node:child_process'
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

/**
 * Dev only: keeps the site in step with the CMS content repo.
 * - Saves made in the admin are commits on GitHub: every 15s, and on each page load, the local clone
 *   is fetched and fast-forwarded (only when it can be, so local edits are never overwritten).
 * - When a file in the clone changes (pulled in, or written by the admin's "Work with Local
 *   Repository" mode), its images are copied and optimised and cms.generated.json is rebuilt; Vite
 *   reloads the page when the JSON changes.
 */
function cmsDevRefresh(): Plugin {
  return {
    name: 'cms-dev-refresh',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root
      const content = path.resolve(root, process.env.CMS_CONTENT_DIR || '../alvyl-test-blog')
      const images = path.join(content, 'images')
      const inside = (dir: string, file: string) => {
        const rel = path.relative(dir, path.resolve(file))
        return !rel.startsWith('..') && !path.isAbsolute(rel)
      }
      const run = (script: string) =>
        new Promise((resolve) => execFile(process.execPath, [script], { cwd: root }, resolve))
      let timer: ReturnType<typeof setTimeout> | undefined
      let queue = Promise.resolve()
      let imagesChanged = false
      server.watcher.add(content)
      server.watcher.on('all', (_event, file) => {
        if (!inside(content, file) || inside(path.join(content, '.git'), file)) return
        imagesChanged ||= inside(images, file)
        clearTimeout(timer)
        timer = setTimeout(() => {
          const withImages = imagesChanged
          imagesChanged = false
          queue = queue
            .then(async () => {
              if (!withImages) return
              await run('scripts/cms-media.mjs')
              await run('scripts/optimize-images.mjs')
            })
            .then(() => run('scripts/cms-content.mjs'))
            .then(() => undefined)
        }, 300)
      })

      const git = (...args: string[]) =>
        new Promise<string | null>((resolve) =>
          execFile('git', args, { cwd: content }, (error, stdout) =>
            resolve(error ? null : stdout),
          ),
        )
      let pulling = false
      let lastPull = 0
      const pull = async () => {
        if (pulling || Date.now() - lastPull < 3000) return
        if (!fs.existsSync(path.join(content, '.git'))) return
        pulling = true
        lastPull = Date.now()
        try {
          if ((await git('fetch', '--quiet', 'origin')) === null) return
          const behind = Number((await git('rev-list', '--count', 'HEAD..@{u}'))?.trim() || 0)
          if (!behind) return
          const merged = await git('merge', '--ff-only', '--quiet', '@{u}')
          server.config.logger.info(
            merged === null
              ? `[cms] ${behind} new CMS change(s), but the content clone has local edits: pull it by hand.`
              : `[cms] pulled ${behind} CMS change(s) from the content repo.`,
            { timestamp: true },
          )
        } finally {
          pulling = false
        }
      }
      void pull()
      const poll = setInterval(pull, 15_000)
      server.httpServer?.on('close', () => clearInterval(poll))
      server.middlewares.use((req, _res, next) => {
        if (req.headers.accept?.includes('text/html')) void pull()
        next()
      })
    },
  }
}

export default defineConfig({
  /* "/" locally; the GitHub Pages build sets BASE_PATH=/alvyl-test/ (see .github/workflows). */
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), spaFallback(), cmsDevRefresh()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
})
