# Alvyl Website — Code Overview

## Project Summary

A React 19 + Vite + TypeScript + Tailwind CSS v4 static site for Alvyl, a team of builders. Built from a Figma file (`ToZoELMITbcMeaB0kfUhjU`) and full-page PNG exports in `pg/`. Deployed to GitHub Pages with base-path support (`/alvyl-test`).

---

## Stack & Architecture

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS utilities |
| Routing | Custom client router (`src/lib/router.tsx`) — no react-router |
| CMS | Sveltia CMS (`public/admin/`) for blog + team; Webflow "Teams" collection as fallback |
| Build | Static prerendering (`scripts/prerender.mjs`) |
| Fonts | IvyMode (headings) + Forma DJR Micro (body), self-hosted |

---

## File Structure

```
src/
  styles/
    index.css          Design tokens (Figma variables, 3 responsive modes) + utilities
    fonts.css          @font-face for licensed brand fonts
    motion.css         Hero orb halo and breathing animations
  components/
    ui/                Button, TextField, FormCta, Chip, Eyebrow, Img, …
    layout/            Header, Footer, SiteLayout, Seo
    sections/          ContactSection, CustomersStrip, FeaturePanel, Team, TechIntent
  pages/
    home/              HomePage.tsx + sections (Hero, WhyWeExist, StartupSpeed, …)
    about/
    offerings/
    contact/
    not-found/
  data/              Page content and SEO text (typed modules)
  lib/
    router.tsx         Minimal client router (base-path aware)
    murmuration.ts     WebGL starling flock renderer
    murmuration.worker.ts  Worker for OffscreenCanvas flock
    sun.ts             Orb cursor drawing
    accentFonts.ts     Lazy-load italic accent cuts
    cn.ts              Tailwind class joiner
    asset.ts           Base-path-aware asset URLs
  entry-server.tsx   Prerender entry used by scripts/prerender.mjs
scripts/
  prerender.mjs      Build-time static HTML generation
  images             WebP variants of public/assets
  webflow-team.mjs   Fetches Webflow team data
  normalize-logos.mjs Crop + tone-match customer logos
public/
  assets/            Images and icons
  fonts/             .woff2 + .woff cuts used by the site
  admin/             Sveltia CMS
pg/                 Full-page PNG design exports (design reference)
```

---

## Key Files Explained

### `src/pages/home/HomePage.tsx`

The home page composition. Imports and renders sections in order:

1. `<Seo />` — page title/description
2. `<Hero />` — the pinned, scroll-driven murmuration hero
3. `<WhyWeExist />` — "What drives us" / Tech is our language
4. `<StartupSpeed />` — speed section
5. `<CustomersStrip />` — partner logos
6. `<HowWeWork />` — "How we work"
7. `<TechIntent />` — technology intent
8. `<Team />` — Our People carousel
9. `<ContactSection />` — "Get in touch"

The page is a thin shell; all content lives in typed data modules under `src/data/`.

---

### `src/styles/index.css`

The design system. Key parts:

- **Responsive tokens** — CSS custom properties switch at `md` (450px) and `lg` (1033px), matching Figma variables.
- **Tailwind theme** — `--font-display: 'IvyMode'` and `--font-sans: 'Forma DJR Micro'`.
- **Alchemy gradient** — conic gradient (`#CE521D` → `#CE1D1E` → `#CE521D`) exposed as `@utility bg-alchemy` / `text-alchemy`.
- **Utilities**:
  - `hover-alchemy` — card hover: Alchemy gradient fades in + 3% scale
  - `hover-grow` — team cards 5% scale on hover
  - `tap-target` — 44×44px hit area without visual change
  - `mask-icon` — single-colour SVG icons tinted by `currentColor`
- **Base styles** — black background, hidden scrollbar, focus-visible outline.
- **Blog post body** — `.post-body` with drop caps, blockquotes, reading column max 720px.

---

### `src/styles/fonts.css`

Self-hosted licensed font declarations:

| File | Style | Usage |
|---|---|---|
| `IvyMode-Light.woff2` | Light (300) | Headings |
| `IvyMode-Italic.woff2` | Italic (400) | Accent words |
| `IvyMode-LightItalic.woff2` | Light Italic (300) | Contact heading accent |
| `FormaDJRMicro-Light.woff2` | Light (300) | Form fields |
| `FormaDJRMicro-Medium.woff2` | Medium (500) | UI / body |

Italic cuts are lazy-loaded via `src/lib/accentFonts.ts` so they don't block first paint.

---

### `src/lib/router.tsx`

A minimal client router (replaces react-router ~30 KB gzipped).

- **`toAppPath(browserPath)`** — strips base path, `.html`, trailing slashes.
- **`<Router path>`** — context provider; `path` fixes location for prerendering (no `window` on server).
- **`<Link to>`** — in-app link with `history.pushState`, base-prefixed, respects `meta/ctrl/shift/alt`.
- **`useLocation()` / `useNavigate()`** — hooks for current location and navigation.

---

### `src/lib/murmuration.ts`

The starling flock renderer for the Home hero. Fully procedural in a WebGL vertex shader (one draw call, no library).

**Four parts** (the design philosophy):

1. **The flock** — thousands of birds, each with a fixed home along the leader's course. Outline bulges/pinches via two-scale noise.
2. **The orb** — the visitor's cursor, drawn by `lib/sun`. It only lights the flock, never moves it.
3. **Influence** — near the orb, birds deepen toward red and stray less.
4. **The pulse** — a tap sends a soft wave; birds lean toward the source, then ease back.

**Key API**:

```ts
createMurmuration({
  container, colors, layout, stage, ink, glow, calm,
  onReady, onError
}): Murmuration
```

Returns:
- `setProgress(0…5)` — scroll-driven mood (loose → gathered)
- `setPointer(x, y)` / `clearPointer()` — orb position
- `setActive(active)` — pause when off-screen
- `setPaused(paused)` — WCAG 2.2.2 pause control
- `burst(clientX, clientY)` — tap/click pulse
- `destroy()`

**Frame-rate guard** — if average frame time exceeds ~18.5 ms past the first 3 s, a tenth of the flock fades out over ~1 s (never below 55%, never back up).

---

### `src/pages/home/sections/Hero.tsx`

The Home hero section. Renders 6 screens (headline + 4 services + invitation) in a 400% viewport-tall pinned container.

**Motion modes** (set by `index.html` before first paint):

| Mode | Trigger | Behavior |
|---|---|---|
| `story` | `data-story` on `<html>` | Pinned 400vh, scroll-driven, orb follows cursor, pulse on tap |
| `calm` | `data-calm` on `<html>` | 30% speed, no orb/pulse/story, Pause shown |
| `none` | neither | Static card only |

**Scroll → screen mapping**:

- `q` (0 … 1 through pinned range) → `s = q × 5`
- Each screen's text opacity/scale is scrubbed by distance from `s`
- Headline and invitation get slower, bolder zoom; service names resolve sooner

**Orb behavior**:
- Mouse over card: follows exactly, fades in at pointer (0.3 s)
- Over text/links/buttons: shrinks into pointer, normal cursor takes over
- Touch/pen: no orb

**Pulse**:
- Click/tap on sky (not links/buttons)
- 3 simultaneous waves
- ~1,060 px/s, peak 0.55 s, gone by ~2 s
- No on-screen hint

---

### `src/lib/sun.ts`

Draws the orb's core into the `.sun` element. Returns `play / pause / destroy`.

---

## Design Tokens

Figma variables (file `ToZoELMITbcMeaB0kfUhjU`) are mirrored 1:1 as CSS custom properties.

| Token | Mobile | Tablet (≥450px) | Desktop (≥1033px) |
|---|---|---|---|
| `text-h1` | 32px | 44px | 56px |
| `text-h2` | 28px | 40px | 48px |
| `text-h3` | 20px | 24px | 32px |
| `text-body` | 14px | 16px | 16px |
| `text-caption` | 12px | 12px | 12px |
| `space-side` | 16px | 24px | 32px |
| `space-section-inner` | 24px | 32px | 48px |
| `space-card` | 24px | 32px | 48px |
| `space-section-lg` | — | 48px | 120px |

**Alchemy gradient** — conic, centre at 54.5% / 52.1%:
```css
conic-gradient(
  from 180deg at 54.5% 52.1%,
  #ce521d 0%, #ce381e 25%, #ce1d1e 50%, #ce381e 62.5%, #ce521d 75%, #ce521d 100%
)
```

---

## Content Flow

- **Build-time**: `npm run build` → `scripts/prerender.mjs` renders every page to static HTML, inlines CSS, generates `sitemap.xml`, JSON-LD, canonical/robots/OG/Twitter tags.
- **Client navigation**: `src/lib/router.tsx` handles History API; `index.html` template provides `<head>` for all pages.
- **Fonts**: only IvyMode Light + Forma Medium load up front (preloaded). Italic accent cuts load on scroll via `accentFonts.ts`.
- **Images**: `npm run images` creates WebP variants in `public/_img` (git-ignored). Content images use `<Img>` with `sizes` matching rendered width.

---

## Performance & SEO

| Metric | Target |
|---|---|
| Lighthouse Performance | 94–97 mobile, 100 desktop |
| Accessibility / Best Practices / SEO | 100 every page |
| Page weight | Under 0.5 MB |
| CLS | 0–0.001 |

**What keeps scores there**:
- Prerendering with inlined CSS + low-priority app script
- WebP images with `<Img>` and `priority` for hero
- WebGL flock drawn off the main thread (worker + OffscreenCanvas)
- Frame-rate guard fades birds, never drops below 55%
- No white in dense overlaps (light capped per-bird)

---

## Contact Form

`src/components/sections/ContactForm.tsx`

- Fields: Name, Email, Contact No, Message, optional document attachment (PDF/Word/PPT/Excel/TXT/RTF/ODT; 10 MB max)
- Submissions → FormSubmit → emailed to `info@alvyl.com`
- Browser posts form; FormSubmit redirects with `?sent=1`; page shows "message sent"
- **One-time setup**: first submission sends activation email to `info@alvyl.com`
- Spam protection: hidden honeypot field; FormSubmit captcha page off
- On phones: "Get in touch" section shows only heading + "Contact Us" button

---

## Service Pages

`src/pages/services/ServicePage.tsx` rendered from `src/data/services.ts`.

Each service page has:
- Alchemy hero card with service art
- "What we build" capability tags (Chip style)
- "How we help" benefit cards (Alchemy hover)
- Testimonial when available
- Other three services
- Contact section

Content comes from www.alvyl.com; design follows Figma.

---

## 404 Page

`src/pages/not-found/NotFoundPage.tsx` — prerendered to `dist/404.html` with `noindex`. GitHub Pages serves it with status 404 for unknown URLs.

---

## Workflow

1. Read spec/PNG before changing a section.
2. Change the minimum — don't touch unrelated files.
3. Verify in real build: `npm run build && npx vite preview --port 4173`
4. Check with Playwright at 1440×900, 800, 768, 390×844
5. Run `npx tsc -b`, `npx eslint src tests`, `npm run test:e2e`
6. Don't commit unless asked.
