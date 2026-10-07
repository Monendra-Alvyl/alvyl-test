/*
 * Draws each page's 1200×630 share card (LinkedIn, Slack, X, WhatsApp previews) into public/og/,
 * in the site's own look: IvyMode headline with an Alchemy italic accent, Forma eyebrow, the logo, and
 * a small flock of orange-red birds around a low orb, as in the Home hero. src/data/seo.ts points
 * each page's og:image at its card. Run after changing a page's headline (needs Playwright's Chromium):
 *   npm run og
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public/og')
const font = (file) => pathToFileURL(path.join(ROOT, 'public/fonts', file)).href
const logo = fs.readFileSync(path.join(ROOT, 'public/assets/brand/logo.svg'), 'utf8')

/* One card per page; the file name is the page path with "/" → "-" ("home" for /). Lines are
   [text, accent?] pairs. */
const cards = [
  {
    file: 'home',
    eyebrow: 'Product design · SRE · Agentic AI · IoT',
    lines: [[['We’re a team']], [['of '], ['builders', true]]],
  },
  {
    file: 'about',
    eyebrow: 'About Alvyl · Since 2018',
    lines: [
      [['A people-first']],
      [
        ['tech ', false],
        ['studio', true],
      ],
    ],
  },
  {
    file: 'offerings',
    eyebrow: 'Offerings',
    lines: [
      [
        ['Digital ', false],
        ['design', true],
      ],
      [['studio']],
    ],
  },
  {
    file: 'contact-us',
    eyebrow: 'Get in touch',
    lines: [[['Let’s build something']], [['together', true]]],
  },
  {
    file: 'blog',
    eyebrow: 'The Alvyl blog',
    lines: [
      [['Notes on design,']],
      [
        ['AI ', false],
        ['& reliability', true],
      ],
    ],
  },
  {
    file: 'services-product-design',
    eyebrow: 'Service 01',
    lines: [
      [['End-to-End']],
      [
        ['Product ', false],
        ['Design', true],
      ],
    ],
  },
  {
    file: 'services-site-reliability-engineering',
    eyebrow: 'Service 02',
    lines: [[['Site Reliability']], [['Engineering', true]]],
  },
  {
    file: 'services-agentic-ai',
    eyebrow: 'Service 03',
    lines: [
      [
        ['Agentic ', false],
        ['AI', true],
      ],
      [['that gets work done']],
    ],
  },
  {
    file: 'services-iot-machine-learning',
    eyebrow: 'Service 04',
    lines: [[['IoT & Machine']], [['Learning', true]]],
  },
]

/* Seeded random, so every run draws the same flock. */
function random(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

/* The flock: one organic body around the orb (two-scale wobble on its outline, denser at the core). */
function flock(seed) {
  const rnd = random(seed)
  let birds = ''
  for (let i = 0; i < 900; i++) {
    const a = rnd() * Math.PI * 2
    const wobble = 1 + 0.28 * Math.sin(a * 3 + seed) + 0.12 * Math.sin(a * 7 + seed * 2)
    const r = Math.pow(rnd(), 0.75) * 300 * wobble
    const x = 870 + Math.cos(a) * r * 1.25
    const y = 300 + Math.sin(a) * r * 0.62
    const size = 4 + rnd() * 6
    const tilt = -20 + rnd() * 40
    const alpha = (0.25 + rnd() * 0.6) * (1 - Math.min(r / 380, 0.85))
    const colour = rnd() < 0.5 ? '206,82,29' : '206,29,30'
    birds +=
      `<path d="M${-size} 0 Q0 ${-size * 0.6} ${size} 0" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt.toFixed(0)})" ` +
      `stroke="rgba(${colour},${alpha.toFixed(2)})" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
  }
  return birds
}

const html = (card, i) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Ivy; src: url(${font('IvyMode-Light.woff2')}); font-weight: 300; }
@font-face { font-family: Ivy; src: url(${font('IvyMode-LightItalic.woff2')}); font-weight: 300; font-style: italic; }
@font-face { font-family: Forma; src: url(${font('FormaDJRMicro-Regular.woff2')}); font-weight: 400; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #000; padding: 20px; }
.card { position: relative; width: 100%; height: 100%; overflow: hidden; border: 1px solid #1e1e1e;
  border-radius: 24px; background: linear-gradient(#101010, #000); }
.glow { position: absolute; inset: 0; background: radial-gradient(45% 55% at 74% 50%, rgb(206 82 29 / 0.18), transparent 70%); }
.orb { position: absolute; left: 830px; top: 260px; width: 80px; height: 80px; border-radius: 50%; filter: blur(1.5px);
  background: radial-gradient(circle at 45% 40%, #ce521d, #ce1d1e 70%); box-shadow: 0 0 60px 20px rgb(206 29 30 / 0.35); }
svg.flock { position: absolute; inset: 0; }
.logo { position: absolute; left: 64px; top: 56px; width: 92px; }
.logo svg { width: 100%; height: auto; display: block; }
.text { position: absolute; left: 64px; bottom: 72px; width: 640px; }
.eyebrow { font: 400 18px/1 Forma, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #b5b5b5;
  display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.eyebrow::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ce521d; }
h1 { font: 300 76px/1.08 Ivy, serif; color: #fff; letter-spacing: -0.01em; }
em { font-style: italic; background: linear-gradient(90deg, #ce1d1e, #ce521d); -webkit-background-clip: text; color: transparent; padding-right: 4px; }
.url { position: absolute; right: 64px; top: 64px; font: 400 18px/1 Forma, sans-serif; color: #b5b5b5; }
</style></head><body><div class="card">
<div class="glow"></div>
<div class="orb"></div>
<svg class="flock" viewBox="0 0 1160 590">${flock(i + 3)}</svg>
<div class="logo">${logo}</div>
<div class="url">alvyl.com</div>
<div class="text">
  <div class="eyebrow">${card.eyebrow}</div>
  <h1>${card.lines.map((line) => line.map(([text, accent]) => (accent ? `<em>${text}</em>` : text)).join('')).join('<br>')}</h1>
</div>
</div></body></html>`

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const [i, card] of cards.entries()) {
  /* A file page, so it may load the local font files. */
  const tmp = path.join(os.tmpdir(), 'alvyl-og.html')
  fs.writeFileSync(tmp, html(card, i))
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(OUT, `${card.file}.jpg`), type: 'jpeg', quality: 86 })
}
await browser.close()
console.log(`[og] ${cards.length} share cards → public/og/`)
