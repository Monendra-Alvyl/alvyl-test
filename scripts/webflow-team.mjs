/*
 * Fetches the published "Teams" CMS collection from Webflow and writes src/data/team.generated.json.
 * Profile photos are downloaded once into public/assets/team/<id>.jpg (832px wide) so they can be
 * served as optimised WebP; a photo is re-downloaded only when its Webflow URL changes.
 * Runs before `npm run dev` / `npm run build`. The token stays on this machine (.env.local) and is
 * never bundled into the site. If the token is missing or the request fails, the last generated
 * file is kept so the build still works.
 *   npm run webflow:team
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve(import.meta.dirname, '../src/data/team.generated.json')
const PHOTO_DIR = path.resolve(import.meta.dirname, '../public/assets/team')
/* "Teams" collection — found with `npm run webflow:inspect`. */
const COLLECTION_ID = process.env.WEBFLOW_TEAM_COLLECTION_ID || '697b9a722e83ab39dc11312b'
const token = process.env.WEBFLOW_API_TOKEN

function keepExisting(reason) {
  console.warn(`[webflow:team] ${reason} — keeping the existing ${path.basename(OUT)}.`)
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, '[]\n')
  process.exit(0)
}

if (!token) keepExisting('WEBFLOW_API_TOKEN is not set (add it to .env.local)')

/** Accepts a full profile URL or just the LinkedIn id ("jane-doe"). */
function linkedinUrl(value) {
  const v = (value ?? '').trim()
  if (!v) return null
  if (/^https?:\/\//i.test(v)) return v
  if (/linkedin\.com/i.test(v)) return `https://${v.replace(/^\/+/, '')}`
  return `https://www.linkedin.com/in/${v.replace(/^@|\/+$/g, '')}`
}

async function fetchAll() {
  const items = []
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items/live?limit=100&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}`, accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
    const page = await res.json()
    items.push(...page.items)
    if (items.length >= page.pagination.total || page.items.length === 0) return items
  }
}

/* Previous run: which Webflow URL each local photo was made from. */
const previous = new Map(
  (fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : []).map((m) => [
    m.id,
    m.sourceImage,
  ]),
)

async function localPhoto(id, url) {
  if (!url) return null
  const file = path.join(PHOTO_DIR, `${id}.jpg`)
  if (!fs.existsSync(file) || previous.get(id) !== url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`photo ${res.status} for ${url}`)
    fs.mkdirSync(PHOTO_DIR, { recursive: true })
    await sharp(Buffer.from(await res.arrayBuffer()))
      .rotate()
      .resize({ width: 832, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(file)
  }
  return `/assets/team/${id}.jpg`
}

let items
try {
  items = await fetchAll()
} catch (error) {
  keepExisting(`Webflow request failed (${error.message})`)
}

const team = items
  .filter((item) => !item.isDraft && !item.isArchived)
  .map((item) => {
    const f = item.fieldData
    return {
      id: item.id,
      name: (f.name ?? '').trim(),
      sourceImage: f.profile?.url ?? null,
      imageAlt: f.profile?.alt || f.name,
      linkedin: linkedinUrl(f.linkedin),
      sortOrder: typeof f['sort-order'] === 'number' ? f['sort-order'] : Number.MAX_SAFE_INTEGER,
    }
  })
  .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  .map(({ sortOrder: _sortOrder, ...member }) => member)

try {
  for (const member of team) member.image = await localPhoto(member.id, member.sourceImage)
} catch (error) {
  keepExisting(`photo download failed (${error.message})`)
}

fs.writeFileSync(OUT, JSON.stringify(team, null, 2) + '\n')
console.log(`[webflow:team] wrote ${team.length} team members to ${path.basename(OUT)}.`)
