/*
 * Writes prerendered HTML for every page into dist (after `vite build` and the SSR build of
 * src/entry-server.tsx): dist/index.html, dist/about(/index).html, dist/offerings(/index).html.
 * Each page gets its own <title>, meta description and Open Graph tags. dist/404.html gets the
 * "Page not found" page (noindex), which GitHub Pages serves with status 404 for unknown URLs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const { render, pageMeta, notFound } = await import(
  pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href
)

/*
 * Inline the (small) stylesheet so first paint doesn't wait for a second request; 404.html keeps the
 * <link>. The CSS already uses absolute, base-prefixed URLs, so it works unchanged inline.
 */
const inlineCss = (html) =>
  html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_, href) => {
    const file = path.join(DIST, href.replace(/^.*?\/assets\//, 'assets/'))
    return '<style>' + fs.readFileSync(file, 'utf8') + '</style>'
  })

/*
 * The page is already painted from prerendered HTML, so the app bundle (needed only for hydration)
 * shouldn't compete with the HTML, fonts and hero image for bandwidth.
 */
const lowPriorityScript = (html) =>
  html.replace(
    '<script type="module" crossorigin',
    '<script type="module" fetchpriority="low" crossorigin',
  )

const template = lowPriorityScript(
  inlineCss(fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')),
)
if (!template.includes('fetchpriority="low"')) throw new Error('prerender: module script not found')
if (!template.includes('<style>')) throw new Error('prerender: stylesheet link not found to inline')
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function withMeta(html, { title, description }) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(
      '</head>',
      `  <meta property="og:title" content="${escape(title)}" />\n` +
        `    <meta property="og:description" content="${escape(description)}" />\n  </head>`,
    )
}

for (const page of Object.values(pageMeta)) {
  const body = await render(page.path)
  const html = withMeta(template, page).replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`,
  )
  const out =
    page.path === '/' ? path.join(DIST, 'index.html') : path.join(DIST, page.path, 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  /* Also /about.html, so hosts serve the page for /about without a trailing-slash redirect. */
  if (page.path !== '/') fs.writeFileSync(path.join(DIST, `${page.path.slice(1)}.html`), html)
  console.log(
    `[prerender] ${page.path} → ${path.relative(ROOT, out)} (${(body.length / 1024).toFixed(0)} KiB)`,
  )
}

/* 404.html: every path missing from pageMeta renders the NotFound page on the client too. */
{
  const body = await render(notFound.path)
  const html = withMeta(template, notFound)
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  fs.writeFileSync(path.join(DIST, '404.html'), html)
  console.log(`[prerender] 404 → dist/404.html (${(body.length / 1024).toFixed(0)} KiB)`)
}
