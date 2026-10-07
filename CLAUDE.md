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
  Exception: Forma's **Regular (400)** replaces Figma's Medium everywhere (the user's choice); use
  `font-normal`, never `font-medium` (no Medium face is loaded).
- Missing images may be cropped from the PNGs as stand-ins; real exports replace them under the same
  filenames later.

## Site-wide decisions

- **Breakpoints:** phone < 450px, tablet 450–1032px, desktop ≥ 1033px (Tailwind `md` / `lg`, the CSS
  token modes, `<picture>` media and every JS `matchMedia`).
- **Header:** sticky on every page. It starts 12px from the top (`pt-3` in `SiteLayout.tsx`, matching
  its `sticky top-3`) so it never jumps on the first scroll. At ≤ 600px the links collapse into a
  hamburger dropdown card (Offerings, About Us, Schedule a Call).
- **Footer:** the original Home footer on every page: headline + logo, email/phone, and only the
  "Services" and "Company" headings with no link lists under them. The headings themselves are links:
  Services → `/offerings`, Company → `/about`.
- **Home hero vs header:** they never overlap and the gap is **always exactly 32px** (the user's rule;
  no centring on tall screens). The story card pins at `--hero-top` (118px on phones, 118.56px from
  450px up: header bottom + 32px, motion.css); no negative margin. Its height fills the screen below
  the header up to a **fixed 772px** (the design height); on taller screens it stays 772px.
  The pinned scroll story runs at every screen size (a no-pin variant for tall screens was tried and
  reverted by the user). **While the story is pinned, "Why we exist" waits right under the hero card**
  (the usual section gap below it) instead of after the hero's long scroll area, so tall screens show it
  rather than an empty band. Pure CSS (a JS version jittered): HomePage wraps it in `.why-follow`, pulled
  up by `--hero-range` (the story length) with a same-height spacer after it, and the section is sticky
  at `--hero-top + --hero-card-h + --space-section-lg`. Skip intro accounts for this. The hero card has the same 1px `stroke-light` border as every Panel.
- **The orb sits behind the flock** (rendered before the canvas in Hero.tsx): birds fly across it like
  a low sun. Its core has a 1.5px blur. A mouse tap adds one `.sun-ring` (inserted just after the flock
  host, removes itself on `animationend`). Position the orb and ring with the CSS `translate`
  property, never `transform`: the separate `scale` (hover shrink, ring expansion) applies after
  `transform`, which would scale the position too.
- **Team cards:** a mouse flips a card on hover and back on leave; touch and keyboard toggle it with
  the full-card button (a mouse click doesn't toggle, so it can't fight the hover).
- **Contact:** "Schedule a Call" and every "Contact Us" link go to `/contact-us`, which reuses Home's
  "Get in touch" section (not the Figma Contact designs). On phones that section shows only its heading
  and a "Contact Us" button.
- The Home case-studies carousel was removed (it isn't in the PNGs).
- **"Our approach" (StartupSpeed) art** is a code-drawn SVG orbit (`OrbitArt`), not the cubes PNG (the
  user disliked the cube render): the live alvyl.com icon language (thin orbits, hollow nodes), a slow
  outer orbit (enterprise) and a fast orange node on a tight inner orbit (startup). Motion in
  motion.css, still under reduced motion. `cubes.png` is kept in public/ but unused.
- **Section spacing:** an eyebrow sits 48px above its heading (`gap-12`) at every size; don't centre a
  text column against a taller neighbour (it pushes the heading down).

## Home hero (murmuration)

- Specs: [hero-section-design.md](hero-section-design.md) (layout, type, motion, states — **not yet
  updated for the orb/pulse rework below**) and [hero-motion-patterns.md](hero-motion-patterns.md)
  (flock and orb, current as of 1 Oct 2026). Reference screenshots in `hero-design/` show the old
  falcon/scatter look and are stale.
- **The philosophy (the user's own framing, load-bearing for any future hero work):** Alvyl = Alchemy
  Village — individuals (the flock, the village) plus energy (the orb, the alchemy) make something
  greater (synergy). **Four parts only: flock, orb, influence, pulse** — every motion must say why it
  exists in those terms (the spec does, per part). Removed for minimalism and not to come back without
  asking: three flocks, the 1% "lead" birds, stragglers, drawn-on density waves, twist/folding sheets,
  split, ball, the six named formations, the green corner.
  - **Flock:** one body that **covers the card**, following one wandering course; organic outline from
    two-scale noise (knots and necks, never an ellipse); each bird strays on its own slow course.
    Scroll only eases the mood, loose (headline) → gathered (finale); both moods still span the card.
  - **Orb:** **the mouse cursor only** — follows it exactly, fades in where the pointer is and out where
    it leaves, **never moves on its own** (an always-present idle-wandering orb was built and the user
    rejected it); no orb on touch. Restrained, "minimalism and mystery": orange/red only, faint far halo.
  - **Influence:** near the orb birds deepen toward red and stray less (fly in step). **No positional
    effect on the flock at all** — a drag, a local lean and a pull-and-orbit were all tried and turned
    down; only light + unison survived.
  - **Pulse:** a tap sends a soft wave; birds lean toward its source together and ease back (~2 s);
    three waves can run at once. Never an outward scatter. No on-screen hint.
  - **Colour:** orange and red only; per-bird brightness capped so dense overlaps stay a rich red, never
    white; light near the orb deepens, never lightens.
- **Mastery = written quality targets, met and checked** (Part 6 of the spec): 60 fps target with a
  frame-rate guard that fades birds out gradually (never below 55%, never back up); no white (pixel
  scan); far birds fade to 15%; nothing pops (orb fades at the pointer, three pulse slots, resize eases,
  flock clock never jumps); Pause is the one deliberate instant stop. Real-phone frame rate is still
  unverified — headless Chromium renders on the CPU, so the guard always trips there; judge the full
  flock from the first ~3 s of a headless run.
- **Calm mode (reduced motion):** the user wants animation, not a still frame, for these visitors.
  `index.html` sets `data-calm` (instead of `data-story`) when reduced motion is asked for and WebGL
  exists: the plain card keeps the flock at 30% speed, one held mood, no orb, no pulse, no story, with
  Pause shown. `.hero-motion-only` shows in story or calm mode; `.hero-story-only` only in story mode.
- A full boids-style rearchitecture (real per-bird separation/alignment/cohesion, needing neighbour
  awareness the current vertex-shader-only pipeline doesn't have) was proposed and explicitly declined
  in favour of keeping the existing shared-leader-path architecture with noise-driven organic
  approximation — lower risk, same performance profile. Treat a future ask for "real" flocking physics
  as needing the same scoped sign-off, since it implies a genuine rendering-pipeline rewrite (CPU
  neighbour search or a GPU position-texture pass), not a shader tweak.
- `src/lib/murmuration.ts`, `src/lib/murmuration.worker.ts` and `src/lib/sun.ts` were the user's
  complete, as-built files; the default is still to **adapt the calling code**
  (`src/pages/home/sections/Hero.tsx`, `src/styles/motion.css`) rather than touch them. The user has
  since approved scoped edits inside `murmuration.ts`/`sun.ts` for named improvements, confirmed with
  before/after screenshots and a passing build each time. Treat a request to rework the engine's look
  or feel as needing the same kind of explicit, scoped sign-off again — don't take this history as a
  standing license to rewrite the file freely, and don't reintroduce a positional pointer-to-flock
  force without re-confirming; it's been tried and explicitly turned down three times already.
- API: `createMurmuration({ container, colors: [alchemy1, alchemy2], glow, layout, calm, stage,
  onReady, onError })` returns `setProgress(0…5)`, `setPointer(x, y)` / `clearPointer()` (−1…1; Hero's
  mouse handler is the only source — the engine has no pointer listeners of its own), `setActive`,
  `setPaused`, `burst(clientX, clientY)`, `destroy`, or null without WebGL. `animateSun(el)` draws into
  the `.sun` element and returns `play / pause / destroy`.
- Story mode is flagged by `data-story` on `<html>`, set in `index.html` before first paint when motion
  is allowed and WebGL exists; Tailwind variant `story:`. Calm mode is `data-calm` (above). Without
  either the hero is the static card.

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
