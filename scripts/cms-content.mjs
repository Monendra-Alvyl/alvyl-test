/*
 * Reads the content that Sveltia CMS (/admin) commits to the content repo (scripts/cms-dir.mjs) and
 * writes src/data/cms.generated.json, which the blog pages and the "Our People" cards are built from:
 *   team/<slug>.json        team members (the file name is the id / blog author reference)
 *   categories/<slug>.json  blog categories
 *   blog/<slug>.md          blog posts (YAML front matter + Markdown; the file name is the URL)
 * Post bodies are rendered to HTML here, so no Markdown parser ships to the browser. Images in a body
 * get the WebP srcset from `npm run images`, so this runs after it. Posts marked draft, or with a
 * publish date still in the future, are left out until a later build.
 *   npm run cms:content
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { Marked } from 'marked'
import { parse as parseYaml } from 'yaml'
import { ROOT, contentDir } from './cms-dir.mjs'

/* null when the content repo is missing: nothing is read and the last generated file is kept. */
const CONTENT = contentDir()
const OUT = path.join(ROOT, 'src/data/cms.generated.json')
const MANIFEST = path.join(ROOT, 'src/data/images.generated.json')
/* Same base as vite.config.ts, for links and images inside post bodies. */
const BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')

const warn = (message) => console.warn(`[cms] ${message}`)
const files = (dir, ext) => {
  if (!CONTENT) return []
  const full = path.join(CONTENT, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((name) => name.endsWith(ext))
    .sort()
    .map((name) => ({ id: name.slice(0, -ext.length), file: path.join(full, name) }))
}
const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    warn(`skipped ${path.relative(CONTENT, file)}: ${error.message}`)
    return null
  }
}
const text = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null)
const withBase = (url) => (url.startsWith('/') && !url.startsWith('//') ? BASE + url.slice(1) : url)
const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Last commit date of a file, so JSON-LD dateModified follows real edits (falls back to null). */
function lastModified(file) {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: CONTENT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return iso || null
  } catch {
    return null
  }
}

/* ── Team ──────────────────────────────────────────────────────────────────────────────────── */
const team = files('team', '.json')
  .map(({ id, file }) => {
    const member = readJson(file)
    if (!member || !text(member.name)) return null
    return {
      id,
      name: text(member.name),
      role: text(member.role),
      photo: text(member.photo),
      photoAlt: text(member.photoAlt),
      quote: text(member.quote),
      linkedin: text(member.linkedin),
      order: Number.isFinite(member.order) ? member.order : 999999,
      showOnWebsite: member.showOnWebsite !== false,
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
const teamById = new Map(team.map((member) => [member.id, member]))

const categories = new Map(
  files('categories', '.json')
    .map(({ id, file }) => [id, text(readJson(file)?.title)])
    .filter(([, title]) => title),
)

/* ── Markdown → HTML (styled by .post-body in src/styles/index.css) ────────────────────────── */
const images = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {}

function figure({ href, title, text: alt }) {
  const entry = images[href]
  const attrs = [
    `src="${escapeAttr(withBase(href))}"`,
    `alt="${escapeAttr(alt ?? '')}"`,
    entry &&
      `srcset="${entry.variants.map(([w, url]) => `${encodeURI(withBase(url))} ${w}w`).join(', ')}"`,
    entry && `sizes="(min-width: 1033px) 720px, calc(100vw - 96px)"`,
    entry && `width="${entry.width}" height="${entry.height}"`,
    'loading="lazy" decoding="async"',
  ]
  const caption = title ? `<figcaption>${escapeAttr(title)}</figcaption>` : ''
  return `<figure><img ${attrs.filter(Boolean).join(' ')}>${caption}</figure>`
}

/* Heading ids and the table of contents of the post being rendered (reset per post in readPost). */
let headingIds = new Set()
let toc = []
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')

const markdown = new Marked({
  renderer: {
    /* An image on its own line is a figure (its Markdown title is the caption), not a <p>. */
    paragraph({ tokens }) {
      if (tokens.length === 1 && tokens[0].type === 'image') return figure(tokens[0]) + '\n'
      return `<p>${this.parser.parseInline(tokens)}</p>\n`
    },
    image: (token) => figure(token),
    /* The page title is the only h1; body headings start at h2. */
    /* Each heading gets an id, so the post's "On this page" list (toc) can link to it. */
    heading({ tokens, depth }) {
      const level = Math.min(Math.max(depth, 2), 3)
      const inner = this.parser.parseInline(tokens)
      const label = plainText(inner)
      const base = slugify(label) || 'section'
      let id = base
      for (let n = 2; headingIds.has(id); n++) id = `${base}-${n}`
      headingIds.add(id)
      toc.push({ id, label, level })
      return `<h${level} id="${id}">${inner}</h${level}>\n`
    },
    link({ href, title, tokens }) {
      const external = /^https?:\/\//.test(href)
      const attrs = [
        `href="${escapeAttr(withBase(href))}"`,
        title && `title="${escapeAttr(title)}"`,
        external && 'target="_blank" rel="noreferrer noopener"',
      ]
      return `<a ${attrs.filter(Boolean).join(' ')}>${this.parser.parseInline(tokens)}</a>`
    },
  },
})

/** Visible text of rendered HTML, whitespace collapsed. */
const plainText = (html) =>
  html
    .replace(/<figure[\s\S]*?<\/figure>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

/** Shortens text to at most `max` characters at a word boundary, with an ellipsis. */
function clip(value, max) {
  if (value.length <= max) return value
  const cut = value.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–—-]+$/, '') + '…'
}

/*
 * The drop cap (.post-body .drop-cap) spans three lines, so it is only given to an opening paragraph
 * long enough to wrap around it; a one-line opener would leave a gap under the letter.
 */
function dropCap(html) {
  const first = /^<p>([\s\S]*?)<\/p>/.exec(html)
  if (!first || plainText(first[1]).length < 180) return html
  return html.replace(/^<p>/, '<p class="drop-cap">')
}

const wordCount = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

/* ── Blog posts ────────────────────────────────────────────────────────────────────────────── */
/*
 * The CMS saves local time without an offset ("2026-09-29T14:48:00"); it is India time, like the dates
 * the site shows (src/data/blog.ts), whatever time zone the build machine is in.
 */
function parseDate(value) {
  if (value instanceof Date) return value
  const iso = String(value).trim()
  const hasZone = /(?:[zZ]|[+-]\d\d:?\d\d)$/.test(iso)
  return new Date(iso.includes('T') && !hasZone ? `${iso}+05:30` : iso)
}

function readPost({ id, file }) {
  const source = fs.readFileSync(file, 'utf8').replace(/^﻿/, '')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) return warn(`skipped blog/${id}.md: no front matter`)
  let data
  try {
    data = parseYaml(match[1]) ?? {}
  } catch (error) {
    return warn(`skipped blog/${id}.md: ${error.message}`)
  }
  const title = text(data.title)
  const publishedAt = data.publishedAt ? parseDate(data.publishedAt) : null
  if (!title || !publishedAt || Number.isNaN(publishedAt.getTime()))
    return warn(`skipped blog/${id}.md: needs a title and a publish date`)
  if (data.draft === true || publishedAt > new Date()) return null

  const author = data.author ? teamById.get(data.author) : null
  if (data.author && !author) warn(`blog/${id}.md: unknown author "${data.author}"`)
  headingIds = new Set()
  toc = []
  const html = dropCap(markdown.parse(match[2]).trim())
  const sections = toc
  const excerpt = text(data.excerpt) ?? clip(plainText(html), 200)
  return {
    id,
    title,
    excerpt,
    publishedAt: publishedAt.toISOString(),
    updatedAt: lastModified(file) ?? publishedAt.toISOString(),
    cover: text(data.cover) ? { src: text(data.cover), alt: text(data.coverAlt) ?? title } : null,
    author: author
      ? { name: author.name, role: author.role, photo: author.photo, linkedin: author.linkedin }
      : null,
    categories: (Array.isArray(data.categories) ? data.categories : [])
      .filter((slug) => categories.has(slug))
      .map((slug) => ({ id: slug, title: categories.get(slug) })),
    html,
    words: wordCount(html),
    toc: sections,
    seo: {
      title: text(data.seo?.title) ?? title,
      description: text(data.seo?.description) ?? clip(excerpt || plainText(html), 160),
    },
  }
}

const posts = files('blog', '.md')
  .map(readPost)
  .filter(Boolean)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

/*
 * Every post gets a unique <title> and meta description without anyone having to write them: the
 * SEO fields in the admin are optional overrides, the defaults are the title and the excerpt (or the
 * start of the post), and a clash with an earlier post is resolved by adding the date or the opening
 * words of the post.
 */
const shortDate = (iso) =>
  new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
const seenTitles = new Set()
const seenDescriptions = new Set()
for (const post of [...posts].reverse()) {
  if (seenTitles.has(post.seo.title.toLowerCase())) {
    post.seo.title = `${post.seo.title} (${shortDate(post.publishedAt)})`
    warn(`blog/${post.id}.md: SEO title already used by another post, now "${post.seo.title}"`)
  }
  seenTitles.add(post.seo.title.toLowerCase())
  if (seenDescriptions.has(post.seo.description.toLowerCase())) {
    post.seo.description = clip(`${post.title}: ${plainText(post.html)}`, 160)
    warn(
      `blog/${post.id}.md: SEO description already used by another post, now generated from its text`,
    )
  }
  seenDescriptions.add(post.seo.description.toLowerCase())
}

/* Unchanged content leaves the file alone, so the dev server doesn't reload for nothing. */
const json = JSON.stringify({ team, posts }, null, 2) + '\n'
if (CONTENT) {
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== json) fs.writeFileSync(OUT, json)
  console.log(`[cms] ${team.length} team members, ${posts.length} published posts.`)
} else if (!fs.existsSync(OUT)) {
  fs.writeFileSync(OUT, json)
}
