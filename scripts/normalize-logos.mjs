/*
 * Normalizes the customer logos in public/assets/partners (npm run logos) so they look like one set:
 *   - crops each file tight to the logo (no transparent padding, which made some logos look smaller);
 *   - rescales its grey tones so the lightest tone of every logo is the same grey (TONE), keeping the
 *     logo's own shading (e.g. the TAGBOX badge, the Vocera "V");
 *   - prints each logo's cropped width/height for src/data/home.ts (customers.logos).
 * Run it again after replacing a logo with a new export. The on-page size is worked out from the
 * aspect ratio in CustomersStrip.tsx.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.resolve(import.meta.dirname, '../public/assets/partners')
/* Lightest grey of each logo on the black strip (text-ultra-light is #B5B5B5; logos sit dimmer). */
const TONE = 0x8c

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.png'))) {
  const src = path.join(DIR, file)
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .trim({ threshold: 10 })
    .raw()
    .toBuffer({ resolveWithObject: true })

  /* Lightest tone = 98th percentile luminance of the mostly opaque pixels (ignores stray bright specks). */
  const lum = []
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) lum.push(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])
  }
  lum.sort((a, b) => a - b)
  const lightest = lum[Math.floor(lum.length * 0.98)] || 255
  const gain = TONE / lightest

  for (let i = 0; i < data.length; i += 4) {
    const grey = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.round(grey * gain))
  }

  const out = await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toBuffer()
  fs.writeFileSync(src, out)
  console.log(`${file}: ${info.width}×${info.height} (tone ×${gain.toFixed(2)})`)
}
