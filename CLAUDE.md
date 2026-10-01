# CLAUDE.md — Alvyl website

Standing instructions for working in this repo. Read this first; it replaces re-explaining the project.
Commands, folder structure and tokens are in [README.md](README.md). Build rules are in
[SKILL_with_Figma.md](SKILL_with_Figma.md).

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS v4 (not Next.js). No react-router: `src/lib/router.tsx`.
- Every route is prerendered at build time (`scripts/prerender.mjs`); `index.html` is the `<head>`
  template for all pages, so site-wide tags (analytics, meta, fonts) go there.
- Content lives in typed modules in `src/data/`. `*.generated.json` files are build output.
- **Blog and team CMS: Sveltia CMS** in `public/admin/`: served by the site at
  `/admin` (HR-only `/admin/hr`, never linked) and deployable on its own as a private admin
  ([public/admin/README.md](public/admin/README.md)). It commits to the content-only repo
  `Monendra-Alvyl/alvyl-test-blog`, cloned at `../alvyl-test-blog` (or `CMS_CONTENT_DIR`).
  `scripts/cms-media.mjs` + `cms-content.mjs` build `src/data/cms.generated.json` (git-ignored).
  Full design/workflow: [team-and-blog.md](team-and-blog.md). The Webflow "Teams" snapshot
  (`scripts/webflow-team.mjs`, token only in `.env.local`, never `VITE_`) is the fallback when the
  content repo has no team files. Team quotes: CMS `quote`, else `teamQuotes` in `home.ts`; no quote =
  a card that doesn't flip.
- **SEO, every page:** `sitePages` in `src/data/seo.ts` (titles ≤ 60 chars, keyword first + "| Alvyl";
  descriptions ≤ 160; JSON-LD) → `scripts/prerender.mjs` (canonical, robots, OG/Twitter, sitemap.xml,
  `/post/<slug>` redirects). `<Seo path>` mirrors it on client navigation. A test enforces the limits.
- Fonts: IvyMode and Forma DJR Micro are licensed and self-hosted from `public/fonts`.

## Design sources, in priority order

1. **Written specs** for a section, when one exists (e.g. `hero-section-design.md`).
2. **PNG exports in `pg/`** (Home/About/Offer, Desktop/Tablet/Phone). They are the current design and
   override earlier Figma-derived builds.
3. **Figma file `ToZoELMITbcMeaB0kfUhjU`** for the design system: tokens, colours, type, component
   states. The account has 20 MCP calls a month; fetch whole sections with `get_design_context`.
4. The Webflow site (alvyl-revamp-site.webflow.io) and www.alvyl.com are **content/copy sources only**,
   never design sources. Exception: card hover copies Webflow (dark at rest; on hover a 180° gradient
   #CE1D1E → #CE521D at 40% plus scale 1.03, team cards 1.05). Buttons keep the Figma states.

Rules that follow from these:
- **Home is the design authority.** When another page differs from Home in shared elements (header,
  footer, buttons, panels, cards, type, spacing), follow Home.
- Where tablet/phone PNGs omit sections or show placeholders, show every desktop section at all sizes
  with the desktop art and real copy.
- Typography always follows Figma: IvyMode headings with Alchemy italic accents, Forma DJR Micro body.
- Missing images may be cropped from the PNGs as stand-ins; real exports replace them under the same
  filenames later.

## Site-wide decisions

- **Breakpoints:** phone < 450px, tablet 450–1032px, desktop ≥ 1033px (Tailwind `md` / `lg`, the CSS
  token modes, `<picture>` media and every JS `matchMedia`).
- **Header:** sticky on every page. It starts 12px from the top (`pt-3` in `SiteLayout.tsx`, matching
  its `sticky top-3`) so it never jumps on the first scroll. At ≤ 600px the links collapse into a
  hamburger dropdown card (Offerings, About Us, Schedule a Call).
- **Footer:** the original Home footer on every page: headline + logo, email/phone, and only the
  "Services" and "Company" headings with no link lists under them.
- **Contact:** "Schedule a Call" and every "Contact Us" link go to `/contact-us`, which reuses Home's
  "Get in touch" section (not the Figma Contact designs). On phones that section shows only its heading
  and a "Contact Us" button.
- The Home case-studies carousel was removed (it isn't in the PNGs).
- **Section spacing:** an eyebrow sits 48px above its heading (`gap-12`) at every size; don't centre a
  text column against a taller neighbour (it pushes the heading down).

## Home hero (murmuration)

- Specs: [hero-section-design.md](hero-section-design.md) (layout, type, motion, states) and
  [hero-motion-patterns.md](hero-motion-patterns.md) (flock, sun, scatter). Reference screenshots are in
  `hero-design/`. Build to these values.
- `src/lib/murmuration.ts`, `src/lib/murmuration.worker.ts` and `src/lib/sun.ts` were the user's
  complete, as-built files; the default is still to **adapt the calling code**
  (`src/pages/home/sections/Hero.tsx`, `src/styles/motion.css`) rather than touch them. The user has
  since approved scoped edits inside `murmuration.ts` for specific, named improvements (the falcon
  easing warmth toward it past the flee radius, ~1% of birds as larger/brighter "leads", the finale's
  own gathering flight style, a small overshoot on the post-scatter regroup) — each confirmed with a
  before/after screenshot and a passing build. Treat a request to rework the engine's look or feel as
  needing the same kind of explicit, scoped sign-off again; don't take this history as a standing
  license to rewrite the file freely.
- API: `createMurmuration({ container, colors, glow, green, layout, onReady, onError })` returns
  `setProgress(0…5)`, `setActive`, `setPaused`, `burst(clientX, clientY)`, `destroy`, or null without
  WebGL. The flock tracks the pointer (falcon) itself. `animateSun(el)` draws into the `.sun` element
  and returns `play / pause / destroy`.
- Story mode is flagged by `data-story` on `<html>`, set in `index.html` before first paint when motion
  is allowed and WebGL exists; Tailwind variant `story:`. Without it the hero is the static card.

## Workflow

1. Read the relevant spec/PNG before changing a section; ask only when the design really is ambiguous.
2. Change the minimum: don't touch unrelated files, sections or the user's provided files.
3. Verify in the real build, not just types: `npm run build`, then `npx vite preview --port 4173` and
   check with Playwright at 1440 × 900, 800 or 768 wide, and 390 × 844. Measure positions against the
   spec, screenshot, and check the console for errors. Stop the preview server afterwards.
4. Run `npx tsc -b`, `npx eslint src tests` and `npm run test:e2e` (all must pass) before reporting.
5. Report what changed and anything that affects other pages. Don't commit unless asked.

## Gotchas

- `cn()` (`src/lib/cn.ts`) only joins classes; it does **not** merge conflicting Tailwind classes. To
  position a component that sets its own `relative`, wrap it in a positioned `div`.
- Unlayered rules in `motion.css` beat Tailwind utilities: don't set `display` there on elements that
  use `hidden` / `lg:flex`.
- Playwright `getByRole` still matches `inert` elements. The hero's hidden screens repeat the service
  names, so tests must target the numbered service cards (`/^\d+ Title$/`).
- The shell is Windows; Python isn't installed. Use Node scripts or the edit tools, not `python`.
- For headless WebGL screenshots, launch Chromium with `--use-angle=swiftshader
  --enable-unsafe-swiftshader`.
