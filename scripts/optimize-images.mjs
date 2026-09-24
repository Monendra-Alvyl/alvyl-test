/*
 * Generates responsive WebP variants for every PNG/JPG under public/assets and writes
 * src/data/images.generated.json, which <Img> uses to build `srcset`, `width` and `height`.
 * Runs before `npm run dev` / `npm run build` (after the Webflow team fetch). Variants are cached:
 * an image is only re-encoded when its source is newer than its variants.
 *   npm run images
 */
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

const manifest = {}
let encoded = 0

for (const file of walk(SRC_DIR)) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join('/') // assets/home/x.png
  const { width, height } = await sharp(file).metadata()
  const top = Math.min(width, MAX)
  const widths = [...new Set([...WIDTHS.filter((w) => w < top), top])]
  const base = rel.replace(/^assets\//, '').replace(/\.(png|jpe?g)$/i, '')
  const mtime = fs.statSync(file).mtimeMs

  const variants = []
  for (const w of widths) {
    const outRel = `_img/${base}-${w}.webp`
    const out = path.join(PUBLIC, outRel)
    if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < mtime) {
      fs.mkdirSync(path.dirname(out), { recursive: true })
      await sharp(file).resize({ width: w }).webp({ quality: 78, effort: 5 }).toFile(out)
      encoded++
    }
    variants.push([w, `/${outRel}`])
  }
  manifest[`/${rel}`] = { width, height, variants }
}

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`[images] ${Object.keys(manifest).length} images, ${encoded} variants encoded.`)
