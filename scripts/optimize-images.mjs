/*
 * Generates responsive WebP variants for every PNG/JPG under public/assets and writes
 * src/data/images.generated.json, which <Img> uses to build `srcset`, `width` and `height`.
 * Runs before `npm run dev` / `npm run build` (after the Webflow team fetch). Variant filenames include
 * a hash of the source image, so replacing an image always gives new URLs (no stale browser/CDN
 * cache) and unchanged images are never re-encoded. Variants no longer referenced are deleted.
 *   npm run images
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const SRC_DIR = path.join(PUBLIC, 'assets')
const OUT_DIR = path.join(PUBLIC, '_img')
const MANIFEST = path.join(ROOT, 'src/data/images.generated.json')

/* Candidate output widths; each image gets those below its own width plus its own (capped). */
const WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920]
const MAX = 1920

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(png|jpe?g)$/i.test(entry.name) ? [full] : []
  })
}

function walkAll(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walkAll(full) : [full]
  })
}

const manifest = {}
let encoded = 0

for (const file of walk(SRC_DIR)) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join('/') // assets/home/x.png
  const { width, height } = await sharp(file).metadata()
  const top = Math.min(width, MAX)
  const widths = [...new Set([...WIDTHS.filter((w) => w < top), top])]
  const base = rel.replace(/^assets\//, '').replace(/\.(png|jpe?g)$/i, '')
  const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8)

  const variants = []
  for (const w of widths) {
    const outRel = `_img/${base}-${hash}-${w}.webp`
    const out = path.join(PUBLIC, outRel)
    if (!fs.existsSync(out)) {
      fs.mkdirSync(path.dirname(out), { recursive: true })
      await sharp(file).resize({ width: w }).webp({ quality: 78, effort: 5 }).toFile(out)
      encoded++
    }
    variants.push([w, `/${outRel}`])
  }
  manifest[`/${rel}`] = { width, height, variants }
}

fs.mkdirSync(OUT_DIR, { recursive: true })

/* Remove variants of replaced or deleted images. */
const keep = new Set(
  Object.values(manifest).flatMap((m) => m.variants.map(([, url]) => url.slice(1))),
)
for (const file of walkAll(OUT_DIR)) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join('/')
  if (!keep.has(rel)) fs.unlinkSync(file)
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`[images] ${Object.keys(manifest).length} images, ${encoded} variants encoded.`)
