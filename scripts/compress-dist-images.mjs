/*
 * Last build step: shrinks oversized original PNG/JPGs in dist/assets (multi-MB exports and CMS
 * uploads). Pages load the WebP variants from `npm run images`; the originals stay only as <img src>
 * fallbacks and for share images and JSON-LD, so they keep their names but are scaled to at most
 * 1920px wide and re-encoded. Source files in public/ and the content repo are never touched.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DIST = path.resolve(import.meta.dirname, '..', 'dist', 'assets')
const LIMIT = 400 * 1024 // files above this are re-encoded
const MAX = 1920

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(png|jpe?g)$/i.test(entry.name) ? [full] : []
  })
}

let before = 0
let after = 0
let count = 0
for (const file of walk(DIST)) {
  const size = fs.statSync(file).size
  if (size <= LIMIT) continue
  const image = sharp(fs.readFileSync(file)).resize({ width: MAX, withoutEnlargement: true })
  const output = /\.png$/i.test(file)
    ? await image.png({ palette: true, quality: 82, effort: 8 }).toBuffer()
    : await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer()
  if (output.length >= size) continue
  fs.writeFileSync(file, output)
  before += size
  after += output.length
  count++
}
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1)
console.log(`[images] ${count} oversized originals in dist: ${mb(before)} MB → ${mb(after)} MB`)
