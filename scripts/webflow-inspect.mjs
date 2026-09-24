/*
 * Lists the Webflow sites, CMS collections and field slugs the token can see — no item data and
 * never the token itself. Used once to map the Team collection's fields.
 *   npm run webflow:inspect
 */
const token = process.env.WEBFLOW_API_TOKEN
if (!token) {
  console.error('WEBFLOW_API_TOKEN is not set. Add it to .env.local (see .env.example).')
  process.exit(1)
}

async function api(path) {
  const res = await fetch(`https://api.webflow.com/v2${path}`, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}: ${await res.text()}`)
  return res.json()
}

/* A site-scoped token without sites:read can still list collections when WEBFLOW_SITE_ID is given. */
const siteId = process.env.WEBFLOW_SITE_ID
const { sites } = siteId
  ? { sites: [{ id: siteId, displayName: 'WEBFLOW_SITE_ID' }] }
  : await api('/sites')
for (const site of sites) {
  console.log(`\nSite: ${site.displayName} (${site.id})`)
  const { collections } = await api(`/sites/${site.id}/collections`)
  for (const c of collections) {
    const detail = await api(`/collections/${c.id}`)
    console.log(`  Collection: ${c.displayName} — id ${c.id}`)
    for (const f of detail.fields)
      console.log(`    - ${f.slug} (${f.type})${f.isRequired ? ' required' : ''}`)
  }
}
