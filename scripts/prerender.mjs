/*
 * Writes prerendered HTML for every page into dist (after `vite build` and the SSR build of
 * src/entry-server.tsx): dist/index.html, dist/about(/index).html, dist/blog/<slug>(/index).html…
 * Each page (sitePages in src/data/seo.ts) gets its own <title>, meta description, robots, canonical
 * link, Open Graph and Twitter tags (article:* on blog posts) and JSON-LD. dist/404.html gets the
 * "Page not found" page (noindex), which GitHub Pages serves with status 404 for unknown URLs.
 * Also writes the old /post/<slug> addresses as redirects, and dist/sitemap.xml.
 * GOOGLE_SITE_VERIFICATION (build env) adds Search Console's verification tag to every page.
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
/* The deploy base, as in vite.config.ts ("/" locally, "/alvyl-test/" on GitHub Pages). */
const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')
const { render, notFound, sitePages, legacyRedirects, absoluteUrl, DEFAULT_SHARE_IMAGE } =
  await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href)

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

/* "<" is escaped so the JSON can't close the <script> element. */
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
const tag = (attr, key, content) => `    <meta ${attr}="${key}" content="${escape(content)}" />\n`
const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim()

/* Title, description and the Open Graph basics, for every page including the 404. */
function withMeta(html, { title, description }) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(
      '</head>',
      tag('property', 'og:title', title) +
        tag('property', 'og:description', description) +
        tag('property', 'og:locale', 'en_IN') +
        (verification ? tag('name', 'google-site-verification', verification) : '') +
        '  </head>',
    )
}

/* An indexable page: the above plus robots, canonical, og:url, share image, article tags, JSON-LD. */
function withSeo(html, { path: pagePath, image, imageAlt, article, jsonLd: data, ...page }) {
  const url = absoluteUrl(pagePath)
  const shareImage = image ?? absoluteUrl(DEFAULT_SHARE_IMAGE)
  const alt = imageAlt ?? page.title
  const head =
    /* Large image previews and full snippets in search results and Discover. */
    tag(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ) +
    `    <link rel="canonical" href="${escape(url)}" />\n` +
    tag('property', 'og:url', url) +
    tag('property', 'og:image', shareImage) +
    /* The share cards (public/og/, scripts/og-images.mjs) are all 1200×630. */
    (shareImage.includes('/og/')
      ? tag('property', 'og:image:width', '1200') + tag('property', 'og:image:height', '630')
      : '') +
    tag('property', 'og:image:alt', alt) +
    (article
      ? tag('property', 'article:published_time', article.publishedTime) +
        tag('property', 'article:modified_time', article.modifiedTime) +
        (article.author ? tag('property', 'article:author', article.author) : '') +
        (article.section ? tag('property', 'article:section', article.section) : '') +
        article.tags.map((topic) => tag('property', 'article:tag', topic)).join('')
      : '') +
    tag('name', 'twitter:title', page.title) +
    tag('name', 'twitter:description', page.description) +
    tag('name', 'twitter:image', shareImage) +
    tag('name', 'twitter:image:alt', alt) +
    `    ${jsonLd(data)}\n`
  return withMeta(html, page)
    .replace(
      '<meta property="og:type" content="website" />',
      `<meta property="og:type" content="${article ? 'article' : 'website'}" />`,
    )
    .replace('</head>', `${head}  </head>`)
}

/** Writes dist/<path>/index.html, and dist/<path>.html so hosts serve /about without a redirect. */
function write(pagePath, html) {
  const out =
    pagePath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, pagePath, 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
  if (pagePath !== '/') fs.writeFileSync(path.join(DIST, `${pagePath.slice(1)}.html`), html)
  return out
}

for (const page of sitePages) {
  const body = await render(page.path)
  const out = write(
    page.path,
    withSeo(template, page).replace('<div id="root"></div>', `<div id="root">${body}</div>`),
  )
  console.log(
    `[prerender] ${page.path} → ${path.relative(ROOT, out)} (${(body.length / 1024).toFixed(0)} KiB)`,
  )
}

/*
 * Old post addresses (www.alvyl.com/post/<slug>) → /blog/<slug>. GitHub Pages can't send a 301, so
 * each is a tiny page with an instant meta refresh and a canonical to the new address, which search
 * engines treat as a permanent redirect.
 */
for (const { from, to } of legacyRedirects) {
  /* Canonical: the absolute address. Redirect: the same site's path (base-prefixed), so it works on
     any host the build is served from. */
  const url = absoluteUrl(to)
  const target = BASE + to.slice(1)
  write(
    from,
    '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n' +
      '    <title>Moved</title>\n' +
      `    <link rel="canonical" href="${escape(url)}" />\n` +
      `    <meta http-equiv="refresh" content="0; url=${escape(target)}" />\n` +
      '    <meta name="robots" content="noindex, follow" />\n' +
      `    <script>location.replace(${JSON.stringify(target)} + location.hash)</script>\n` +
      `  </head>\n  <body><a href="${escape(target)}">This post has moved.</a></body>\n</html>\n`,
  )
}
if (legacyRedirects.length) console.log(`[prerender] ${legacyRedirects.length} /post/* redirects`)

/* 404.html: every path missing from sitePages renders the NotFound page on the client too. */
{
  const body = await render(notFound.path)
  const html = withMeta(template, notFound)
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>')
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  fs.writeFileSync(path.join(DIST, '404.html'), html)
  console.log(`[prerender] 404 → dist/404.html (${(body.length / 1024).toFixed(0)} KiB)`)
}

/*
 * sitemap.xml: every prerendered page, so search engines find new blog posts without waiting for a
 * link to them (posts carry their last edit as <lastmod>). Submit <site>/sitemap.xml in Google
 * Search Console.
 */
{
  const pages = sitePages.map((page) => ({
    path: page.path,
    lastmod: page.article?.modifiedTime,
  }))
  const urls = pages
    .map(({ path: pagePath, lastmod }) => {
      const date = lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''
      return `  <url><loc>${escape(absoluteUrl(pagePath))}</loc>${date}</url>\n`
    })
    .join('')
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`,
  )
  console.log(`[prerender] sitemap.xml (${pages.length} URLs)`)

  /* robots.txt (copied from public/) points crawlers at the sitemap too. */
  const robots = path.join(DIST, 'robots.txt')
  const rules = fs.existsSync(robots)
    ? fs.readFileSync(robots, 'utf8').trimEnd()
    : 'User-agent: *\nAllow: /'
  if (!/^sitemap:/im.test(rules))
    fs.writeFileSync(robots, `${rules}\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`)
}
