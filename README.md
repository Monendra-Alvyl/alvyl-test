# Alvyl Website

React + Vite + TypeScript + Tailwind CSS v4, built from the Figma file
`ToZoELMITbcMeaB0kfUhjU` according to `SKILL_with_Figma.md`.

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build
npm run lint
npm run test:e2e   # Playwright: desktop 1440 / tablet 800 / mobile 375
```

## Structure

```
src/
  styles/index.css        Design tokens (Figma variables, 3 responsive modes) + utilities
  styles/fonts.css        @font-face for the licensed brand fonts
  components/ui/          Design-system components (Button, TextField, FormCta, Chip, Eyebrow, …)
  components/layout/      Header, SiteLayout
  components/sections/    Sections shared across pages (FeaturePanel, PartnersStrip)
  pages/<page>/           Page + page-specific sections
  data/                   Page content (typed; ready to move to Sanity later)
public/assets/            Images and icons exported from Figma
public/fonts/             Licensed font files (not committed — see below)
```

### Tokens

Figma variables have Desktop / Tablet / Mobile modes. They are CSS custom properties that switch at
`md` (450px, tablet) and `lg` (1033px, desktop), exposed as Tailwind utilities:
`text-h1…text-caption`, `px-side`, `p-section-inner`, `p-card`, `p-card-nested`, `gap-section-lg`,
colours such as `bg-dark-grey`, `border-stroke-light`, `text-text-ultra-light`, and `bg-alchemy` /
`text-alchemy` for the Alchemy gradient.

## Fonts

The full licensed kits are in `fonts/` (source). Only the cuts the design uses are copied to
`public/fonts/` as `.woff2` + `.woff` and declared in `src/styles/fonts.css`:

| File                         | Figma style                                      |
| ---------------------------- | ------------------------------------------------ |
| `IvyMode-Light.woff2`        | Ivy Mode · Light                                 |
| `IvyMode-Italic.woff2`       | Ivy Mode · Italic                                |
| `IvyMode-ThinItalic.woff2`   | Ivy Mode · Thin Italic                           |
| `IvyMode-LightItalic.woff2`  | Ivy Mode · Light Italic (contact heading accent) |
| `FormaDJRMicro-Light.woff2`  | Forma DJR Micro · Light                          |
| `FormaDJRMicro-Medium.woff2` | Forma DJR Micro · Medium                         |

## Deploy (GitHub Pages)

The site is served from a sub-path (`https://<user>.github.io/alvyl-test/`), so the build needs that base:

- `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo-name>/` and deploys on every push to
  `main`. In the repo, set **Settings → Pages → Source** to **GitHub Actions**. Optionally add the
  `WEBFLOW_API_TOKEN` repository secret so each deploy refreshes the team from Webflow.
- Paths to files in `public/` must go through `asset('/assets/…')` (`src/lib/asset.ts`) so they
  get the base prefix; the router uses the same base, and `404.html` (a copy of `index.html`) makes
  deep links like `/alvyl-test/about` work.
- Local dev and tests use base `/` — nothing changes there.

## Performance & SEO

Lighthouse (production build): 96–98 Performance on mobile, 100 on desktop; 100 Accessibility, Best
Practices and SEO on every page. What keeps it there:

- **Prerendering** — `npm run build` renders every page to static HTML (`src/entry-server.tsx` →
  `scripts/prerender.mjs`), inlines the CSS and loads the app script at low priority; the browser then
  hydrates. Each page gets its own `<title>` and description from `src/data/seo.ts`.
- **Images** — `npm run images` (runs before dev/build) makes WebP variants of every image in
  `public/assets` into `public/_img` (git-ignored). Render content images with `<Img>`
  (`src/components/ui/Img.tsx`) and a `sizes` that matches the rendered width; mark the page's hero
  image `priority`. Webflow team photos are downloaded and resized at build time.
- **Fonts** — only IvyMode Light and Forma Medium load up front (preloaded); the italic accent cuts load
  when an accent word scrolls into view (`src/lib/accentFonts.ts`).
- **JavaScript** — a small built-in router (`src/lib/router.tsx`) instead of react-router.

To test: `npm run build && npx vite preview`, then run Lighthouse on the preview URL (or on the
deployed GitHub Pages site).

## CMS (Webflow)

The Home team carousel is fed by the Webflow **Teams** collection (name, `profile` photo, `linkedin`,
ordered by `sort-order`). Other content is still in `src/data/*.ts`.

1. Put the API token (CMS: Read) and site ID in `.env.local` — see `.env.example`. The file is
   git-ignored and the token is only used by Node scripts, never bundled into the site.
2. `npm run webflow:team` writes `src/data/team.generated.json`. It runs automatically before
   `npm run dev` and `npm run build`; if the token is missing or Webflow is unreachable, the last
   generated file is kept.
3. `npm run webflow:inspect` lists the site's collections and field slugs.

Content changes in Webflow appear after the next build/deploy. Photos load from Webflow's CDN.

## Content source

Page copy, the Customers strip, the Our People carousel and card hover interactions follow the live
Webflow site (alvyl-revamp-site.webflow.io). Everything else — tokens, colours, type, component states
— follows the Figma design system.

## Design reference

The Figma MCP quota ran out, so Home was finished from the full-page PNG exports in `pg/`
(`Home Desktop.png` 1440 wide, `Home Tablet.png` 800, `Home Phone.png` 390; each is padded with
transparency on the right). Measurements were read from these PNGs pixel by pixel, and font sizes were
calibrated against the licensed fonts. Where the tablet/phone PNGs leave out sections or show
placeholders (gradient squares, repeated card titles), every desktop section and the real copy/art are
used at all sizes.

## Assets cropped from the PNGs (stand-ins)

These were cut from the 1× PNG exports, with baked-in text removed by inpainting. They look soft on
retina screens — replace them with real exports **under the same filenames**:

| File (public/assets/home/)                                                                                                  | Used for                  |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `hero-desktop.jpg`, `hero-tablet.jpg`, `hero-mobile.jpg`                                                                    | Hero art (per breakpoint) |
| `service-product-design.png`, `service-sre.png`, `service-agentic-ai.png`, `service-iot-ml.png`                             | Service-card 3D art       |
| `team-hari-krishna.jpg`, `team-navya-ganduri.jpg`                                                                           | Team portraits            |
| `quote-mark.png`                                                                                                            | Quote card                |
| `about/hero-team.jpg`, `about/why-we-started.jpg`, `about/careers.jpg`, `about/promise-peace.png`, `about/promise-palm.png` | About page                |
| `offerings/hero-studio.jpg`, `offerings/mockup-*.jpg`, `offerings/calculator.jpg`                                           | Offerings page            |

`public/assets/icons/linkedin.svg` is the standard LinkedIn glyph.

## Status

| Area                                       | Status                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Tokens, fonts, Button / Field / CTA / Chip | Built from Figma style guide (16:858)                                                        |
| Home page (all sections, header, footer)   | Built from `pg/` PNGs; desktop, tablet (800) and phone (390) compared side by side           |
| Case-study carousel                        | Removed from Home (not in the PNGs); component kept in `pages/home/sections/CaseStudies.tsx` |
| About (`/about`), Offerings (`/offerings`) | Built from `pg/About *.png`, `pg/Offer *.png`; shared sections follow Home                   |
| Project, Careers, Case-study pages         | Not started                                                                                  |
| Contact us (`/contact-us`)                 | Copied from the Webflow contact page; Home form styling                                      |

## Open questions

1. **Other pages vs Home** — where the About/Offer designs differ from Home (contact form, header, Tech/team
   sections), the Home implementation is used. The Offer design's contact form (4 fields with icons,
   attachment, large Send tile) is therefore not built. The footer is the Home footer on every page
   (only "Services"/"Company" headings, no link columns). The duplicated numbers panel on Offer desktop is shown once.
2. **Navigation / link targets** — Case Studies, Resources, Culture, Schedule a Call, proposal/discovery
   buttons, case-study/resource links, Terms and Privacy are `#` (`src/data/*.ts`). About and service links
   go to `/about` and `/offerings`.
3. **Contact form submission** — no endpoint is defined, so submit does nothing yet. No validation or
   success/error states are designed.
4. **Team quotes** — the Webflow Teams collection has no quote field, so the design's single quote stands
   in on the back of every card. Roles (`job-role`) are fetched-ready but hidden for now.
5. **Carousels** — swipe/scroll tracks with a progress indicator. Are autoplay or arrow controls intended?
