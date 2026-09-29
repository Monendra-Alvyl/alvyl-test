/*
 * Mirrors the content repo's images/ (see scripts/cms-dir.mjs) into public/assets/cms/, where the
 * CMS's image paths (/assets/cms/…) point, before `npm run images` makes their WebP variants.
 * Files no longer in the content repo are removed; unchanged files are left alone.
 *   npm run cms:media
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, contentDir } from './cms-dir.mjs'

const dir = contentDir()
if (dir) {
  const from = path.join(dir, 'images')
  const to = path.join(ROOT, 'public/assets/cms')
  const list = (base) =>
    fs.existsSync(base)
      ? fs.readdirSync(base, { recursive: true }).filter((rel) => {
          return fs.statSync(path.join(base, rel)).isFile()
        })
      : []

  const wanted = new Set(list(from))
  let copied = 0
  for (const rel of wanted) {
    const src = path.join(from, rel)
    const out = path.join(to, rel)
    const same = fs.existsSync(out) && fs.readFileSync(out).equals(fs.readFileSync(src))
    if (same) continue
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.copyFileSync(src, out)
    copied++
  }
  let removed = 0
  for (const rel of list(to)) {
    if (!wanted.has(rel)) {
      fs.unlinkSync(path.join(to, rel))
      removed++
    }
  }
  console.log(`[cms] ${wanted.size} images (${copied} copied, ${removed} removed).`)
}
