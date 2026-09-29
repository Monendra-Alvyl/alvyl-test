# Team section and Blog: design structure and workflow

How the **"Our People" team section** and the **blog** (`/blog` and `/blog/<slug>`) are designed, built
and edited on the Alvyl website. Use it to review them, or to rebuild them on another site.

Written for: developers (and designers) who will check these two features or re-create them elsewhere.

---

## 1. The big picture

Two repositories, one editor:

```
 Editors (HR, marketing)
        │  edit in the browser
        ▼
 Sveltia CMS  ── /admin      (blog posts, categories, team)   public/admin: on the site, and
              ── /admin/hr   (team only)                      deployable privately on its own
        │  every save = a Git commit
        ▼
 Content repo  github.com/Monendra-Alvyl/alvyl-test-blog   ← content only, no site code
   blog/<slug>.md · categories/<slug>.json · team/<slug>.json · images/{blog,team}/
        │  read at build time
        ▼
 Site repo  (this project, F:\Alvyl\Test)
   scripts/cms-media.mjs     copy images → public/assets/cms/
   npm run images            make WebP variants (srcset)
   scripts/cms-content.mjs   read posts + team → src/data/cms.generated.json
   vite build + prerender    static HTML for every page and post
        │
        ▼
 GitHub Pages (github.io preview, noindex)  →  later www.alvyl.com (indexed)
```

- **No database, no API keys.** Content is plain files; the site reads them when it builds.
- **Dev server** pulls the content repo every 15 s and on each page load, and rebuilds the data, so a
  save in the admin shows up locally in seconds.
- **Live site** rebuilds on a push to the site repo, daily, or on a manual run (see §7).

---

## 2. Design system pieces both features use

All values are CSS custom properties in `src/styles/index.css`, switching at **450px** (tablet) and
**1033px** (desktop). Always use the tokens, never raw values.

### Colours

| Token                                                          | Value                                      | Used for                                                           |
| -------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `pitch-black`                                                  | `#000000`                                  | Panels, cards                                                      |
| `dark-grey`                                                    | `#101010`                                  | Image placeholders, author card                                    |
| `light-grey`                                                   | `#171717`                                  | Avatar fallback, inline code                                       |
| `stroke-light`                                                 | `#1E1E1E`                                  | Panel and card borders, dividers                                   |
| `stroke-dark`                                                  | `#4E4E4E`                                  | Icon-button borders, topic tags                                    |
| `text-white` / `text-dark` / `text-light` / `text-ultra-light` | `#FFF` / `#E8E8E8` / `#D6D6D6` / `#B5B5B5` | Titles → body → secondary text                                     |
| `alchemy-1` / `alchemy-2`                                      | `#CE521D` / `#CE1D1E`                      | The single accent (gradient `bg-alchemy`, drop cap, progress bars) |

### Type (mobile → tablet → desktop)

| Style          | Size / line height             | Font                            |
| -------------- | ------------------------------ | ------------------------------- |
| `text-h1`      | 32/36 → 44/52 → 56/68          | Ivy Mode Light (`font-display`) |
| `text-h2`      | 28/32 → 40/48 → 48/54          | Ivy Mode Light                  |
| `text-h3`      | 20/24 → 24/30 → 32/38          | Ivy Mode or Forma               |
| `text-h4`      | 18/24 → 22/28 → 24/30          | Forma                           |
| `text-body-lg` | 16 → 18 → 20                   | Forma Medium (`font-sans`)      |
| `text-body`    | 14 → 16 → 16                   | Forma Medium                    |
| `text-body-sm` | 12 → 14 → 14                   | Forma Medium                    |
| `text-caption` | 12, uppercase, tracking 0.08em | Forma Medium (labels)           |

### Spacing

| Token                             | Mobile                  | Tablet | Desktop |
| --------------------------------- | ----------------------- | ------ | ------- |
| `p-section-inner` (panel padding) | 24                      | 32     | 48      |
| `p-card`                          | 24                      | 32     | 48      |
| `p-card-nested` (card padding)    | 16                      | 24     | 32      |
| Gap between cards                 | 16 (`gap-4`) everywhere |        |         |

### Shapes and components

- **Panel** (`components/ui/Panel.tsx`): black, 1px `stroke-light` border, **24px** radius.
- **Images and inner cards**: **16px** radius. Blog cards: **24px** radius.
- **Eyebrow**: Alchemy dot plus an uppercase caption ("OUR PEOPLE").
- **Chip**: uppercase, 14px, tracking 0.16em, white border, 8px radius. Selected = white fill.
- **Button**: primary = white fill with an arrow; the label rolls on hover.
- **Hover styles**: `hover-alchemy` fades an Alchemy gradient into a card and scales it 3%. `hover-grow`
  scales it 5%. Both apply only on devices with a real pointer, and never with reduced motion.
- **Focus**: every focusable element gets a 2px white outline with a 2px offset (global
  `:focus-visible`).

---

## 3. Team section ("Our People")

Used on **Home, About and Offerings** (`<Team />`, `src/components/sections/Team.tsx`).

### 3.1 Structure

```
┌ Panel (p-section-inner, gap 32 → 48) ──────────────────────────────────────────────┐
│ ● OUR PEOPLE                                                   (Eyebrow)           │
│                                                                                    │
│ ┌ card ───────┐ ┌ card ───────┐ ┌ card ───────┐ ┌ card…   ← horizontal scroll,   │
│ │   photo     │ │             │ │             │ │            snap to each card    │
│ │             │ │             │ │             │ │                                 │
│ │ Founder     │ │             │ │             │ │                                 │
│ │ Hari Krishna│in│            │ │             │ │                                 │
│ └─────────────┘ └─────────────┘ └─────────────┘ └                                  │
│                                                                                    │
│ ▬▬▬━━━━━━━━  (progress, 116×4px, Alchemy thumb 57px)          ⟵      ⟶   (arrows)  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 The flip card

|        | Phone / tablet                                                 | Desktop (≥1033px) |
| ------ | -------------------------------------------------------------- | ----------------- |
| Size   | `min(334px, 100vw − 80px)` × 480px (so the next card peeks in) | 416 × 600px       |
| Radius | 16px                                                           | 16px              |
| Gap    | 16px                                                           | 16px              |

**Front**: the photo fills the card (`object-cover`). The caption sits at the bottom on a light-grey
gradient (50% → 0% upwards), with `p-card-nested` padding:

- Role, if set: `text-body-sm`, ultra-light.
- Name: `text-h3`, Forma Medium, `text-dark`.
- LinkedIn icon (28px) on the right, with a 44×44 hit area. It sits above the flip button, so it
  stays clickable.
- No photo: `dark-grey` background.

**Back** (black): the quote mark image (87×68), the person's quote (`text-h3`, white, max 330px wide),
and the same caption at the bottom. Without a quote, the design's placeholder quote is shown.

### 3.3 Interactions

| Action                        | Result                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Click / tap / Enter on a card | Flips it in 3D (`rotate-y-180`, 700ms ease-in-out, perspective 1600px); click again to flip back. Reduced motion: no animation.    |
| Hover (pointer devices)       | Card grows 5% (`hover-grow`). The track has 16px padding, so the grown card isn't clipped.                                         |
| Swipe / trackpad / scrollbar  | Scrolls the row, snapping to the start of a card. The scrollbar is hidden.                                                         |
| ⟵ / ⟶ arrows                  | Scroll by one card (card width + 16px gap), smoothly. Disabled at the start and end. 44px hit area; hover nudges the arrow by 3px. |
| Progress bar                  | The Alchemy thumb moves with the scroll position (0–1).                                                                            |

### 3.4 Accessibility

- Each card is an `<article aria-label="Name">`. The full-card flip button says "Show X's quote" or
  "Show X's photo", with `aria-pressed`.
- The hidden face is `inert` and `aria-hidden`, so keyboard and screen-reader users only reach the
  visible side.
- The LinkedIn link says "X on LinkedIn". The arrows say "Previous/Next team members".

### 3.5 Data: one JSON file per person (content repo `team/<slug>.json`)

```json
{
  "name": "Hari Krishna",
  "role": "Founder",
  "photo": "/assets/cms/team/hari-krishna.jpg",
  "photoAlt": "optional, defaults to the name",
  "quote": "optional, up to 160 characters",
  "linkedin": "https://www.linkedin.com/in/…",
  "order": 10,
  "showOnWebsite": true
}
```

- **File name = id** (`hari-krishna`). Blog posts use it to name their author.
- **Order**: sorted by `order`, then by name. Numbering 10, 20, 30… leaves room to insert people.
- **Hidden people** (`showOnWebsite: false`) are left out of the carousel but can still be blog authors.
- **Fallback**: if there are no team files, the section uses the Webflow snapshot
  (`src/data/team.generated.json`).
- **Photos**: portrait, 416 × 600 or larger at the same shape. The build makes WebP variants and a
  `srcset`, and `sizes` is `(min-width: 1033px) 416px, 334px`.

### 3.6 HR workflow

1. Open `<site>/admin/hr/` (or the private admin's `hr/` page) and sign in (§7.2).
2. **Team (Our People)** → **New** or pick a person → fill in the fields → **Save**.
3. The save is a commit to the content repo. It shows on the dev site within about 15 s, and on the
   live site after its next build.
4. To reorder, change **Sort order**. To hide someone, turn off **Show in the carousel**.
5. The list shows names only. To see who is hidden, use the list's filter menu and choose **Hidden from
   the carousel** (blog posts have **Drafts** / **Published** filters the same way).

---

## 4. Blog list page (`/blog`)

Built from the Figma frame `pg/blog Desktop.png`. Files: `src/pages/blog/BlogPage.tsx` and `PostCard.tsx`.

### 4.1 Structure

```
(sr-only h1 "Alvyl Blog: notes from the team")

┌ Hero panel (24px radius, p-section-inner) ─────────────────────────────────────────┐
│ ┌ cover 620×684, radius 16 ┐   AI • 25 March 2025 • Written by Hari Krishna • 3 min │
│ │                          │   The newest post's title   (Ivy Mode, text-h2)       │
│ │                          │   Excerpt, max 4 lines      (text-body-lg, ultra-light)│
│ │                          │   [ Read Blog → ]           (primary Button)          │
│ └──────────────────────────┘                                                       │
└────────────────────────────────────────────────────────────────────────────────────┘

              [ ALL ]  [ AI ]  [ DESIGN ]  [ ENGINEERING ]  [ STRATEGY ]   (Chips, centred)

┌ card ──────────┐ ┌ card ──────────┐ ┌ Alchemy proposal card ┐
│ AI • 25 Mar    │ │ AI • 25 Mar    │ │      (molecule)        │
│ ┌ image ─────┐ │ │ ┌ image ─────┐ │ │ Need help with a       │
│ │ 379×400    │ │ │ │            │ │ │ question, idea, or     │
│ └────────────┘ │ │ └────────────┘ │ │ project?               │
│ Title (Forma)  │ │ Title          │ │ [ Send us a proposal → ]│
│ ◯ Written by … │ │ ◯ Written by … │ │                        │
└────────────────┘ └────────────────┘ └────────────────────────┘
┌ card ┐ ┌ card ┐ ┌ card ┐  … the rest, 3 per row

Get in touch (ContactSection) → Footer
```

### 4.2 Specs

| Part          | Spec                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero grid     | 1 column; desktop `620px + 1fr`, gap 32 → 40, items centred vertically                                                                     |
| Hero image    | Aspect 620:684, radius 16, `object-cover`, loaded eagerly (it's the main image)                                                            |
| Meta line     | `text-body`. Labels ultra-light; the date and author name white. Separators are 4px dots.                                                  |
| Chips         | Large Chip, gap 16, centred; 48px above on phones, 80px on desktop                                                                         |
| Grid          | 1 column → 2 (≥450px) → 3 (≥1033px), gap 16                                                                                                |
| Post card     | Black, 1px `stroke-light` border, radius 24, `p-card-nested`, inner gap 24                                                                 |
| Card image    | Aspect 379:400, radius 16. On hover it zooms to 104% over 700ms.                                                                           |
| Card title    | `text-h4`, Forma Light, white                                                                                                              |
| Byline        | 32px round avatar (photo, or an initial on light-grey) + "Written by **Name**"                                                             |
| Proposal card | `bg-alchemy`, radius 24. Molecule image (`offer-sphere-large.png`), `text-h3` Ivy Mode, white Button → `/contact-us`. Always the 3rd item. |
| Card hover    | `hover-alchemy` (gradient fades in, card grows 3%)                                                                                         |

### 4.3 Behaviour

- **Topic chips** filter the grid in place (no page load). **All** resets. Clicking the active topic
  also resets. A hidden live region announces "N posts about AI". With nothing to show: "No other
  posts on this topic yet."
- **The hero** always shows the newest post. The grid shows the others.
- **Each card is one link**: the title's link is stretched over the whole card (`::after`), so it's one
  tab stop and the whole card is clickable.
- **The prerendered HTML lists every post**, so search engines and no-JS visitors see them all.

---

## 5. Blog post page (`/blog/<slug>`)

Files: `src/pages/blog/BlogPostPage.tsx`, `PostBody.tsx`, `ShareLinks.tsx`, `ReadingProgress.tsx`,
`.post-body` in `src/styles/index.css`.

### 5.1 Structure

```
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  reading progress (3px Alchemy bar, fixed at the top)
BLOG / POST TITLE                                        (breadcrumb, caption style)

┌ Hero panel: the same component as on /blog, title is the page h1, no button ───────┐
└────────────────────────────────────────────────────────────────────────────────────┘

┌ Panel ─────────────────────────────────────────────────────────────────────────────┐
│ Body (max 720px, left-aligned)                     │  Side column (320px, sticky)  │
│ R eact trumps Angular…   ← drop cap                │  ON THIS PAGE (≥2 sections)   │
│ Paragraphs, ## headings, lists, quotes, images     │   │ Section one               │
│                                                    │   │ Section two               │
│ ─────────────                                      │  ┌ WRITTEN BY ────────────┐   │
│ [Tech] [AI]   (topic tags)                         │  │ ◯ Hari Krishna   [in]  │   │
│                                                    │  │   Founder              │   │
│                                                    │  └────────────────────────┘   │
│                                                    │  SHARE THIS POST              │
│                                                    │  [in] [X] [WA] [🔗]            │
└────────────────────────────────────────────────────────────────────────────────────┘

Keep reading                                                          All posts →
┌ card ┐ ┌ card ┐ ┌ card ┐   (same topic first, then newest; up to 3)

Get in touch → Footer
```

On phones the side column moves below the body, and "On this page" becomes a collapsible panel above
the body.

### 5.2 Body typography (`.post-body`)

| Element              | Style                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Paragraph, list item | `text-body-lg`, `text-light`, **line height 1.65** (looser than UI text, for reading)      |
| First letter         | Drop cap: Ivy Mode Light, 3.6em, Alchemy colour, floated                                   |
| `##` heading         | Ivy Mode `text-h3`, white, 24px above                                                      |
| `###` heading        | Forma `text-h4`, white                                                                     |
| Quote                | Ivy Mode italic `text-h4`, 2px Alchemy left border                                         |
| Lists                | Alchemy bullets and numbers                                                                |
| Links                | White, Alchemy underline. Links to other sites open in a new tab.                          |
| Image                | Full width, radius 16, lazy-loaded, WebP `srcset`. Its Markdown title becomes the caption. |
| Headings             | Get ids; anchor jumps land 8rem down, clear of the sticky header                           |

### 5.3 Parts and behaviour

- **Reading progress**: the width follows how much of the body has scrolled past. It's
  transform-only (no layout work), updated once per animation frame, and hidden from screen readers.
- **On this page**: built from the body's `##` headings. Shown only with two or more.
- **Author card**: 64px avatar, name (Ivy Mode `text-h4`), role, and a LinkedIn button.
- **Share**: LinkedIn, X and WhatsApp are plain links, so they work before JavaScript loads. **Copy link**
  shows "Link copied" for 2 s. All are 44×44 with labels.
- **Keep reading**: `relatedPosts()` in `src/data/blog.ts`.

---

## 6. Blog content and the admin

### 6.1 A post file (content repo `blog/<slug>.md`)

```markdown
---
title: "The future of work isn't just about automation"
excerpt: 'Optional. One or two sentences; defaults to the start of the post.'
publishedAt: 2025-03-25T10:00:00
draft: false
cover: /assets/cms/blog/future-of-work.jpg
coverAlt: 'Optional. Defaults to the title.'
author: hari-krishna # a team file name
categories: [ai] # category file names
seo: # optional overrides
  title: 'Up to 55 characters'
  description: 'Up to 160 characters'
---

Body in Markdown. ## for sections, ### for sub-sections.
```

- **The file name is the URL.** A new post's file name is made from its title
  (`/blog/the-future-of-work…`).
- **Times without a timezone** are read as India time.
- **Posts that aren't published**: a post marked draft, or with a future date, is skipped until a
  build after that date.

### 6.2 Admin fields (`public/admin/config.yml`)

Required: **Title**, **Publish date**, **Body**. Everything else is optional and filled automatically:

| Left empty      | Becomes                                       |
| --------------- | --------------------------------------------- |
| Excerpt         | The first ~200 characters of the post         |
| SEO title       | The post title, plus " \| Alvyl"              |
| SEO description | The excerpt (clipped to 160 characters)       |
| Cover alt       | The post title                                |
| Author          | "Alvyl" (the Organization in structured data) |
| Cover           | The site's default share image                |

If two posts would get the same SEO title or description, the build makes them unique (adds the
month, or rewrites the description from the text) and reports it.

`public/admin/hr/config.yml` is a trimmed copy with only the team. When you change the team fields,
**change both files**.

### 6.3 SEO produced for every post (nothing to fill in)

- Prerendered HTML at a clean URL, with a canonical link.
- A unique `<title>` and meta description.
- JSON-LD:
  - posts: `BlogPosting` (headline, author with job title and LinkedIn, dates, image, publisher,
    section, word count) plus a `BreadcrumbList`;
  - `/blog`: `Blog`;
  - Home: `Organization` + `WebSite`.
- Open Graph and Twitter tags: `og:type` article, `article:published_time` / `modified_time` /
  `author` / `section` / `tag`, the cover as the preview image, image alt.
- `sitemap.xml` with `<lastmod>`, and `robots.txt`.
- A github.io build is `noindex`. Setting `SITE_URL` (§7.3) makes it indexable on the real domain.

---

## 7. Workflows

### 7.1 Writing a post (editor)

1. Open `<site>/admin/` (or the private admin) → sign in → **Blog posts** → **New**.
2. Enter the title and body, pick an author, a topic and a cover. Leave SEO empty unless you want to
   override it.
3. **Save.** It's committed to the content repo.
4. Local dev: it appears within about 15 s. Live site: after the next build (daily, or run the deploy
   workflow by hand).

### 7.2 Signing in

- **Access token**: a fine-grained GitHub token for `alvyl-test-blog` only, with **Contents: Read and
  write**. Then use **Sign In Using Access Token**.
- **One-click GitHub sign-in** (optional): deploy `sveltia-cms-auth` to Cloudflare Workers and set
  `base_url` in both configs.
- **Offline**: **Work with Local Repository** (Chrome or Edge). Pick the `alvyl-test-blog` folder, then
  commit and push yourself.

### 7.3 Developer

```bash
git clone https://github.com/Monendra-Alvyl/alvyl-test-blog.git ../alvyl-test-blog   # once
npm run dev        # copies images, makes WebP, builds content, then watches and auto-pulls
npm run build      # the same, then prerenders every page and post into dist/
npm run test:e2e   # Playwright (desktop / tablet / mobile)
```

- **Content folder elsewhere**: set `CMS_CONTENT_DIR`.
- **Another content repo**: set the `CMS_REPO` Actions variable and change `repo:` in both admin configs.
- **Go live on alvyl.com**: in the site repo's Settings → Pages add `www.alvyl.com` and point its DNS at
  GitHub Pages. Then set the Actions variable `SITE_URL=https://www.alvyl.com`.

---

## 8. Rebuilding these on another site

The pattern is portable. Here is what to copy and what to adapt.

1. **Tokens first.** Define the colours, type scale and spacing from §2 as CSS variables with the
   same three breakpoints. Build Panel, Eyebrow, Chip, Button and the two hover styles from them.
2. **Content repo.** Create a content-only GitHub repo with `blog/`, `categories/`, `team/` and
   `images/`.
3. **Admin.** Copy `public/admin/` (`index.html`, `config.yml`, `hr/`) and set `backend.repo` and
   `site_url`; it can also be hosted privately on its own (`public/admin/README.md`).
4. **Build scripts.** Copy `scripts/cms-dir.mjs`, `cms-media.mjs`, `cms-content.mjs` and
   `optimize-images.mjs`, and run them before `dev`/`build` in this order: media → images → content.
   Dependencies: `marked`, `yaml`, `sharp`.
5. **Data layer.** Copy `src/data/blog.ts` and the team part of `src/data/home.ts`. They turn the
   generated JSON into typed data, add the base path to images, and compute reading time and related
   posts.
6. **Components.**
   - Team: `components/sections/Team.tsx` (with `ProgressIndicator` and `useScrollProgress`).
   - Blog: `pages/blog/*` and `.post-body` in `index.css`.
   - Images: `components/ui/Img.tsx`.
7. **SEO.** Copy `src/data/seo.ts` (JSON-LD, page meta) and the `<head>` and sitemap parts of
   `scripts/prerender.mjs` (or your framework's equivalent). Set the site URL.
8. **Dev auto-refresh (optional).** Copy the `cmsDevRefresh` plugin from `vite.config.ts`.
9. **Check it** with the list in §9.

---

## 9. Review checklist

- [ ] Team cards: 416×600 on desktop; on phones the next card peeks in. Flip works by click and by
      keyboard, and only the visible face is focusable.
- [ ] Team arrows are disabled at the ends, and the progress bar tracks the scroll.
- [ ] `/blog` hero: image left, meta, title, excerpt, **Read Blog**. It stacks on phones.
- [ ] Chips filter the grid. The proposal card is always the 3rd item.
- [ ] Cards: the whole card is one link. Hover shows the gradient and the image zoom; there's no hover
      scaling with reduced motion.
- [ ] Post: breadcrumb, hero with the h1, body max 720px left-aligned, drop cap, sticky side column on
      desktop.
- [ ] "On this page" appears only with 2+ sections, and its links land below the header.
- [ ] Share links open the right app; **Copy link** confirms.
- [ ] A new post saved with only a title and body gets an excerpt, SEO title and description, and
      JSON-LD (view the page source of the built `dist/blog/<slug>/index.html`).
- [ ] Lighthouse, mobile: Performance ≥ 90 (currently 95–96), Accessibility, Best Practices and SEO 100.
      CLS 0.
- [ ] Heading order has no skipped levels. Every icon-only button has a label. Tap targets are ≥ 44px.

---

## 10. File map

| What             | Where                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Team section     | `src/components/sections/Team.tsx`, `src/components/ui/ProgressIndicator.tsx`, `src/hooks/useScrollProgress.ts`            |
| Team data        | `src/data/home.ts` (team part), content repo `team/*.json`                                                                 |
| Blog pages       | `src/pages/blog/BlogPage.tsx`, `BlogPostPage.tsx`, `PostCard.tsx`, `PostBody.tsx`, `ShareLinks.tsx`, `ReadingProgress.tsx` |
| Blog data        | `src/data/blog.ts`, content repo `blog/*.md`, `categories/*.json`                                                          |
| Body styles      | `.post-body` in `src/styles/index.css`                                                                                     |
| SEO              | `src/data/seo.ts`, `src/lib/siteUrl.ts`, `src/components/layout/Seo.tsx`, `scripts/prerender.mjs`                          |
| Build pipeline   | `scripts/cms-dir.mjs`, `cms-media.mjs`, `cms-content.mjs`, `optimize-images.mjs`                                             |
| Admin            | `public/admin/index.html`, `config.yml`, `hr/index.html`, `hr/config.yml`, `README.md`, `notify-website.yml`                  |
| Dev auto-pull    | `cmsDevRefresh()` in `vite.config.ts`                                                                                      |
| Deploy           | `.github/workflows/deploy.yml`                                                                                             |
| Design reference | `pg/blog Desktop.png` (Figma blog frame)                                                                                   |
