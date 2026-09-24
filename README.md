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
`md` (768px, tablet) and `lg` (1024px, desktop), exposed as Tailwind utilities:
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
| Contact page (reuses `ContactSection`)     | Not started                                                                                  |

## Open questions

1. **Other pages vs Home** — where the About/Offer designs differ from Home (contact form, header, Tech/team
   sections), the Home implementation is used. The Offer design's contact form (4 fields with icons,
   attachment, large Send tile) is therefore not built. The footer is the Home footer on every page
   (only "Services"/"Company" headings, no link columns). The duplicated numbers panel on Offer desktop is shown once.
2. **Copy** — the About "Careers" button reads "View Case Studies" in the design; "extraordinary" is
   accented on every size (only tablet/phone designs accent it).
3. **Navigation / link targets** — Case Studies, Resources, Culture, Schedule a Call, proposal/discovery
   buttons, case-study/resource links, Terms and Privacy are `#` (`src/data/*.ts`). About and service links
   go to `/about` and `/offerings`.
4. **Contact form submission** — no endpoint is defined, so submit does nothing yet. No validation or
   success/error states are designed.
5. **Team quotes** — the Webflow Teams collection has no quote field, so the design's single quote stands
   in on the back of every card. Roles (`job-role`) are fetched-ready but hidden for now.
6. **Copy** — "WHY WE EXSIST" (spelling). On phone, the Startup Speed body and button differ from
   desktop; the desktop copy is used.
7. **Placeholder colour** — contact-form placeholders are #828282, which is not a design-system token.
8. **Carousels** — swipe/scroll tracks with a progress indicator. Are autoplay or arrow controls intended?
