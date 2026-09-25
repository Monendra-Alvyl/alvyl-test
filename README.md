# Alvyl Website

React + Vite + TypeScript + Tailwind CSS v4, built from the Figma file
`ToZoELMITbcMeaB0kfUhjU` according to `SKILL_with_Figma.md`.

Pages: Home (`/`), About (`/about`), Offerings (`/offerings`), Contact us (`/contact-us`), four service
pages (`/services/product-design`, `/services/site-reliability-engineering`, `/services/agentic-ai`,
`/services/iot-machine-learning`) and a "Page not found" page for any other URL.

```bash
npm install
npm run dev        # local dev server (refreshes the Webflow team and image variants first)
npm run build      # type-check + production build + prerender
npm run preview    # serve the production build
npm run lint
npm run test:e2e   # Playwright: desktop 1440 / tablet 800 / mobile 375
npm run images     # WebP variants of public/assets (runs before dev/build)
npm run logos      # crop + tone-match customer logos (after replacing a logo file)
npm run webflow:team     # fetch the team from Webflow (runs before dev/build)
npm run webflow:inspect  # list Webflow collections and field slugs
```

## Structure

```
src/
  styles/index.css        Design tokens (Figma variables, 3 responsive modes) + utilities
  styles/fonts.css        @font-face for the licensed brand fonts
  components/ui/          Design-system components (Button, TextField, FormCta, Chip, Eyebrow, Img, …)
  components/layout/      Header, Footer, SiteLayout, Seo
  components/sections/    Sections shared across pages (ContactSection + ContactForm, CustomersStrip,
                          FeaturePanel, Team, TechIntent)
  pages/<page>/           Page + page-specific sections (home, about, offerings, contact, not-found)
  data/                   Page content and SEO text (typed modules; *.generated.json are build output)
  lib/router.tsx          Small client router (base-path aware); routes in src/routes.tsx
  entry-server.tsx        Prerender entry used by scripts/prerender.mjs
scripts/                  Build scripts: prerender, image variants, Webflow team, logo normalizing
public/assets/            Images and icons
public/fonts/             The font cuts the site uses (.woff2 + .woff)
fonts/                    Full licensed font kits (source)
pg/                       Full-page PNG design exports (design reference)
tests/                    Playwright tests
```

### Tokens

Figma variables have Desktop / Tablet / Mobile modes. They are CSS custom properties that switch at
`md` (450px, tablet) and `lg` (1033px, desktop), exposed as Tailwind utilities:
`text-h1…text-caption`, `px-side`, `p-section-inner`, `p-card`, `p-card-nested`, `gap-section-lg`,
colours such as `bg-dark-grey`, `border-stroke-light`, `text-text-ultra-light`, and `bg-alchemy` /
`text-alchemy` for the Alchemy gradient.

Utilities of our own in `src/styles/index.css`:

- `hover-alchemy`: card hover from the Webflow site. An Alchemy gradient fades in and the card grows 3%.
- `hover-grow`: team cards grow 5% on hover.
- `tap-target`: gives links and buttons a hit area of at least 44×44px without changing how they look.
  Use it on any small interactive element.
- `mask-icon`: single-colour icons tinted with the text colour.

`text-caption` is 12px on phones, not the design's 10px. 12px is the minimum readable size.

## Fonts

The full licensed kits are in `fonts/` (source). Only the cuts the site uses are copied to
`public/fonts/` as `.woff2` + `.woff` and declared in `src/styles/fonts.css`:

| File                         | Figma style                                      |
| ---------------------------- | ------------------------------------------------ |
| `IvyMode-Light.woff2`        | Ivy Mode · Light (headings)                      |
| `IvyMode-Italic.woff2`       | Ivy Mode · Italic (accent words)                 |
| `IvyMode-LightItalic.woff2`  | Ivy Mode · Light Italic (contact heading accent) |
| `FormaDJRMicro-Light.woff2`  | Forma DJR Micro · Light                          |
| `FormaDJRMicro-Medium.woff2` | Forma DJR Micro · Medium                         |

## Contact form

`src/components/sections/ContactForm.tsx` is used by the "Get in touch" section and the Contact us page.
Fields: Name, Email, Contact No, Message and an optional document attachment (PDF, Word, PowerPoint,
Excel, TXT, RTF, ODT; 10 MB max).

- Submissions go to [FormSubmit](https://formsubmit.co). It emails them, with the document attached,
  to **info@alvyl.com**. The recipient, subject and messages are set in `src/data/contactPage.ts`.
- FormSubmit only accepts files from a regular form post, not a background request. The browser posts
  the form, and FormSubmit redirects back to the same page with `?sent=1`. The page then shows the
  "message sent" line.
- **One-time setup:** the first submission from the deployed site sends an activation email to
  info@alvyl.com. Nothing is delivered until someone clicks its link.
- Spam protection is a hidden honeypot field. FormSubmit's captcha page is turned off.
- On phones the "Get in touch" section shows only its heading and a "Contact Us" button to `/contact-us`.

## Service pages

One page per Home service card, all rendered by `src/pages/services/ServicePage.tsx` from
`src/data/services.ts`. Each card on Home links to its page, and each page gets its own search title
and description.

- **Sections:** Alchemy hero card with the service art, "What we build" capability tags (Chip style),
  "How we help" benefit cards (Alchemy hover), a named testimonial when there is one, the other three
  services, and the contact section.
- **Content** comes from www.alvyl.com (`/design-service`, `/iot-and-cloud-service`,
  `/machine-learning-iot`). The design (tokens, fonts, components) follows Figma, not the live site.
- **To confirm:**
  - The live site has no Agentic AI page, so that page uses the AI half of `/machine-learning-iot`,
    and IoT & Machine Learning uses the IoT/cloud half.
  - Three hero intros are new copy (marked `/* new */` in `src/data/services.ts`).
  - The live site's anonymous testimonials are left out.

To add a service, add an entry to `services`: the route, the Home card and the search text follow.

## Page not found (404)

Unknown paths render `src/pages/not-found/NotFoundPage.tsx`, which has a "Back to Home" button. The
build prerenders it into `dist/404.html` with a `noindex` tag. GitHub Pages serves that file with
status 404 for any unknown URL. `vite preview` answers with status 200, but still shows the page.

## Customer logos

The Customers strip (`src/components/sections/CustomersStrip.tsx`) gives every logo the same visual
area rather than the same height, so wide wordmarks and compact marks look equally big.

To add or replace a logo:

1. Put the PNG in `public/assets/partners/`.
2. Run `npm run logos` (`scripts/normalize-logos.mjs`). It crops each file tight and sets its lightest
   tone to one shared grey.
3. Copy the printed width × height into `customers.logos` in `src/data/home.ts`.

## Deploy (GitHub Pages)

The site is served from a sub-path (`https://<user>.github.io/alvyl-test/`), so the build needs that base:

- `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo-name>/` and deploys on every push to
  `main`. In the repo, set **Settings → Pages → Source** to **GitHub Actions**. Optionally add the
  `WEBFLOW_API_TOKEN` repository secret so each deploy refreshes the team from Webflow.
- Paths to files in `public/` must go through `asset('/assets/…')` (`src/lib/asset.ts`) so they
  get the base prefix. The router uses the same base.
- Each page is written as `dist/<page>/index.html` and `dist/<page>.html`, so `/alvyl-test/about` works
  without a redirect. Anything else gets `404.html`.
- Local dev and tests use base `/`, so nothing changes there.

## Performance & SEO

Lighthouse on the production build (25 Sep 2026):

- **Performance:** 94–97 on mobile and 100 on desktop.
- **Other scores:** 100 for Accessibility, Best Practices and SEO on every page.
- **Page weight:** under 0.5 MB per page.
- **Layout shift (CLS):** 0–0.001.

The 404 page scores lower on SEO because it is `noindex` on purpose.

What keeps the scores there:

- **Prerendering:** `npm run build` renders every page to static HTML (`src/entry-server.tsx` →
  `scripts/prerender.mjs`), inlines the CSS and loads the app script at low priority. The browser then
  hydrates. Each page gets its own `<title>` and description from `src/data/seo.ts`.
- **Images:** `npm run images` (runs before dev/build) makes WebP variants of every image in
  `public/assets` into `public/_img` (git-ignored). Render content images with `<Img>`
  (`src/components/ui/Img.tsx`) and a `sizes` that matches the rendered width. Mark the page's hero
  image `priority`. Webflow team photos are downloaded and resized at build time.
- **Fonts:** only IvyMode Light and Forma Medium load up front (preloaded). The italic accent cuts load
  when an accent word scrolls into view (`src/lib/accentFonts.ts`).
- **JavaScript:** a small built-in router (`src/lib/router.tsx`) instead of react-router.

To test: `npm run build && npx vite preview`, then run Lighthouse on the preview URL (or on the
deployed GitHub Pages site). `feedback.md` has the latest review and the list of open items.

## CMS (Webflow)

The Our People carousel (Home, About, Offerings) is fed by the Webflow **Teams** collection: name,
`profile` photo and `linkedin`, ordered by `sort-order`. Other content is still in `src/data/*.ts`.

1. Put the API token (CMS: Read) and site ID in `.env.local` (see `.env.example`). The file is
   git-ignored, and the token is only used by Node scripts, never bundled into the site.
2. `npm run webflow:team` writes `src/data/team.generated.json`. It runs automatically before
   `npm run dev` and `npm run build`. If the token is missing or Webflow is unreachable, the last
   generated file is kept.
3. `npm run webflow:inspect` lists the site's collections and field slugs.

Content changes in Webflow appear after the next build/deploy. Photos load from Webflow's CDN.

## Content source

Page copy, the Customers strip, the Our People carousel and card hover interactions follow the live
Webflow site (alvyl-revamp-site.webflow.io). Everything else (tokens, colours, type, component states)
follows the Figma design system. Home is the reference for elements shared across pages: header, footer,
buttons, panels, cards and the contact section.

## Design reference

The Figma MCP quota ran out, so the pages were finished from the full-page PNG exports in `pg/`
(`Home`, `About` and `Offer` at Desktop 1440, Tablet 800 and Phone ~390; padded with transparency on the
right). Measurements were read from these PNGs, and font sizes were calibrated against the licensed
fonts. Where the tablet/phone PNGs leave out sections or show placeholders, every desktop section and
the real copy/art are used at all sizes.

## Assets to replace with real exports

These were cropped from the 1× PNG exports as stand-ins and look soft on retina screens. Replace them
**under the same filenames**:

| File (public/assets/)                                                                                               | Used for                                             |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `home/hero-desktop.jpg`, `home/hero-tablet.jpg`, `home/hero-mobile.jpg`                                             | Home hero art                                        |
| `home/service-product-design.png`, `home/service-sre.png`, `home/service-agentic-ai.png`, `home/service-iot-ml.png` | Service-card 3D art                                  |
| `home/team-1.png`, `home/team-2.png`, `home/quote-mark.png`, `home/cubes.png`                                       | Home sections                                        |
| `about/hero-team.jpg`, `about/why-we-started.jpg`, `about/careers.jpg`                                              | About page                                           |
| `offerings/hero-studio.jpg`, `offerings/ordinary-*.jpg`, `offerings/selected-work.png`                              | Offerings page                                       |
| `partners/*.png`                                                                                                    | Customer logos (run `npm run logos` after replacing) |

Edited images (keep these edits if the art is re-exported):

- `offerings/goal-rings.png` is `home/offer-sphere-small.png` at full opacity. The original is exported at
  50% opacity for its faded use on Home, which made it too faint on the Offerings cards.
- `about/promise-peace.png` has its red disc recoloured to the same dark grey (#1C1C1C) as
  `about/promise-palm.png`.
- `partners/*.png` are cropped tight and tone-matched by `npm run logos`. `reverie.png` is only 95×28px
  and needs a larger export.

`public/assets/icons/linkedin.svg` is the standard LinkedIn glyph.

## Status

| Area                                               | Status                                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tokens, fonts, Button / Field / CTA / Chip         | Built from the Figma style guide (16:858)                                                                                         |
| Home                                               | Built from `pg/Home *.png`, compared at desktop, tablet (800) and phone (390). The hero has a sub-headline saying what Alvyl does |
| About (`/about`), Offerings (`/offerings`)         | Built from `pg/About *.png` and `pg/Offer *.png`; shared sections follow Home                                                     |
| Contact us (`/contact-us`)                         | Webflow contact page with the Home form; sends email via FormSubmit                                                               |
| Page not found                                     | Done; prerendered to `404.html` with `noindex`                                                                                    |
| Case-study carousel                                | Removed from Home (not in the PNGs); component kept in `pages/home/sections/CaseStudies.tsx`                                      |
| Service pages (`/services/*`)                      | Done; content from www.alvyl.com, design from Figma (see "Service pages")                                                         |
| Terms, Privacy, case-study, careers pages          | Not started (see `feedback.md`)                                                                                                   |

## Open questions

1. **Other pages vs Home.** Where the About/Offer designs differ from Home (contact form, header,
   Tech/team sections, footer), the Home version is used. The footer is the Home footer on every page
   ("Services"/"Company" headings with no link columns). The duplicated numbers panel on Offer desktop is
   shown once.
2. **Link targets.** Terms & Conditions, Privacy Policy and the "View Case Study" buttons are still `#`
   (`src/data/*.ts`). "Schedule a Call" and "Contact Us" go to `/contact-us`. Each service card goes to its
   own `/services/<slug>` page.
3. **Team data.** The Webflow Teams collection has no quote field, so one stand-in quote is on the back
   of every card. Only one person has a `job-role`.
4. **Copy to confirm.**
   - The About promise card and search description still say "contract caterers".
   - About says 40+ employees; the team shows 32.
   - The "agility of a startup" paragraph appears three times (see `feedback.md`).
5. **Carousels.** Swipe/scroll tracks with a progress indicator and arrows. Is autoplay intended?
