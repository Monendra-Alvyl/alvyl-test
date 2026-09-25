# Website feedback: new Alvyl site vs. www.alvyl.com

**Date:** 24 Sep 2026
**Compared:** the new site in this repo (React/Vite: `/`, `/about`, `/offerings`, `/contact-us`) and the current live site **https://www.alvyl.com** (`/`, `/design-service`, `/machine-learning-iot`, `/iot-and-cloud-service`, `/blog-page`, `/post/…`, `/contact-us`).
**Goal:** one professional site that keeps the new site's design, speed and structure and adds the proof and depth the live site already has.

---

## 1. How this review was done

| Skill / tool                         | Where it came from                     | How it was used                                                                                                                                    |
| ------------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **design-critique**                  | Installed skill                        | First impression, usability, hierarchy, consistency, accessibility (sections 3–4)                                                                  |
| **frontend-design**                  | Installed skill (also on skillsmp.com) | Visual direction and distinctiveness                                                                                                               |
| **ui-ux-pro-max** (nextlevelbuilder) | skillsmp.com, checklist applied        | Priority checklist: contrast ≥ 4.5:1, touch targets ≥ 44×44px, text ≥ 12px, CLS < 0.1, visible form labels, errors next to the field, deep linking |
| **vercel-react-best-practices**      | skillsmp.com, rules applied            | Bundle size, waterfalls, rendering performance                                                                                                     |
| **browser-use** style crawl          | Playwright                             | Crawled every page of both sites at 1440px and 375px: text, links, images, screenshots                                                             |
| **Lighthouse 12**                    | CLI                                    | Mobile and desktop scores for both sites                                                                                                           |

---

## 2. Scorecard

### Lighthouse (production builds)

| Page         | Site                     | Performance (mobile / desktop) | Accessibility | Best Practices | SEO     | Page weight |
| ------------ | ------------------------ | ------------------------------ | ------------- | -------------- | ------- | ----------- |
| Home         | **New**                  | **97 / 100**                   | **100**       | **100**        | **100** | ~0.4 MB     |
| Home         | Live                     | 28 / 44                        | 82            | 79             | 92      | **27.4 MB** |
| Service page | **New** (`/offerings`)   | **97 / 100**                   | **100**       | **100**        | **100** | ~0.4 MB     |
| Service page | Live (`/design-service`) | 42 / 65                        | 84            | 79             | 100     | 1.4 MB      |
| Contact      | **New**                  | **96 / 100**                   | **100**       | **100**        | **100** | small       |
| Contact      | Live                     | 38 / 61                        | 95            | 79             | 92      | 1.3 MB      |

Other live-site measurements:

- **Home page, mobile:** largest paint takes **65.6 s**, and the page blocks interaction for 5.6 s.
- **Home page, desktop:** layout shift (CLS) is **0.276**; anything above 0.1 fails.
- **Accessibility failures:** low colour contrast, skipped heading levels, a missing `lang` attribute and links with no name.

### Content and features

| Area                                            | New site                                                   | Live site                                  | Take from                |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------ | ------------------------ |
| Visual design, design system, responsive layout | ✅ Strong, consistent (Figma tokens)                       | ⚠️ Tiny type, low contrast                 | **New**                  |
| Speed, SEO basics, accessibility                | ✅ 96–100                                                  | ❌ 28–95                                   | **New**                  |
| Service detail pages (one per service)          | ❌ All four service cards go to one `/offerings` page      | ✅ 3 dedicated pages with capability lists | **Live**                 |
| Product / case study proof                      | ❌ None (Case Studies nav removed)                         | ✅ **Silk Worm** IoT product               | **Live**                 |
| Client testimonials                             | ❌ None                                                    | ✅ Ratna Garba quote (+2 anonymous)        | **Live** (named only)    |
| Team roles and personal quotes                  | ⚠️ Role only for Founder; one stand-in quote on every card | ✅ Role + own quote for each person        | **Live**                 |
| Blog / insights                                 | ❌ None                                                    | ⚠️ 1 post (2023)                           | **Live** (and grow it)   |
| Social links (LinkedIn, Instagram, X)           | ❌ None                                                    | ✅ In header                               | **Live**                 |
| Book a call (Calendly)                          | ❌ "Schedule a Call" opens a form                          | ✅ Calendly link                           | **Live**                 |
| Working contact form                            | ❌ Submit does nothing                                     | ✅ Webflow form                            | **Live** (behaviour)     |
| Terms & Privacy pages                           | ❌ Links go to `#`                                         | ⚠️ Links exist                             | **Both need real pages** |
| Culture / "Why our builders?" story             | ⚠️ Careers panel only                                      | ✅ "Alvilians" section with office photo   | **Live**                 |

---

## 3. Design critique of the new site

### Overall impression

The new site reads as a premium studio site. The dark canvas, IvyMode headlines with Alchemy accents and the photography are strong and consistent. The biggest gap isn't visual. It's **proof**: there are no case studies, no testimonials, and the service cards don't lead to detail. A visitor sees claims ("100+ projects", "↑ 52% retention") but nothing that backs them up.

### Usability

| Finding                                                                 | Severity            | Recommendation                                                                 |
| ----------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| Contact form submit does nothing (no send, no success or error message) | 🔴 Critical         | Connect a form backend (§5.1) and add sending, success and error states        |
| "Schedule a Call" opens a form rather than booking a call               | 🟡 Moderate         | Link to Calendly (the live site already has one), or embed it on `/contact-us` |
| All four service cards go to the same `/offerings` page                 | 🟡 Moderate         | Give each service its own page (§5.3)                                          |
| Terms & Conditions and Privacy Policy go to `#`                         | 🟡 Moderate (legal) | Create both pages; the form collects personal data                             |
| Unknown URLs show the Home page with status 200 (a "soft 404")          | 🟡 Moderate         | Add a real 404 page (§5.6)                                                     |
| Team carousel: 32 people in one row, no way to jump ahead               | 🟢 Minor            | Keep the arrows; consider a "Meet everyone" grid on `/about`                   |

### Visual hierarchy

- **What draws the eye first:** the hero headline "We're a team of builders" and the light-wave art. Correct, but the headline doesn't say _what Alvyl does_. The live site's "People first tech studio" is clearer. Add a one-line sub-headline such as "Product design, SRE, agentic AI and IoT for startups and enterprises".
- **Reading flow:** clean top-to-bottom sequence of panels. Good.
- **Emphasis:** the stats (100+, 50+, 100%) get more visual weight than any proof. Add case studies and testimonials next to them.

### Consistency

| Element                | Issue                                                                                                           | Recommendation                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| "Launched"             | About says **2018**; the About page's search description says "Founded in **2020**"                             | Confirm the real year and use it everywhere (`src/data/about.ts`, `src/data/seo.ts`) |
| About page description | Says Alvyl builds "digital solutions for contract caterers", which contradicts the services on every other page | Rewrite the About promise copy and its search description                            |
| Eyebrow labels         | 10px on phones (`--fs-caption`)                                                                                 | Raise to at least 12px (§4)                                                          |
| Team quote             | The same stand-in quote on every card                                                                           | Add a quote field in Webflow (the live site has one per person)                      |
| Customer logos         | Cloudnine and Vocera render differently (source files have different padding)                                   | Re-export all logos at one height and one grey, with transparent backgrounds         |

### What works well (keep it)

- A design system applied consistently (Figma tokens, 3 breakpoints, one set of components).
- Real team photos pulled from the Webflow CMS; the flip cards and hover states feel crafted.
- Pages are prerendered to HTML, images are responsive WebP, fonts are deferred: 96–100 on Lighthouse.
- The phone "Get in touch" button leads to a full contact page, a sensible mobile pattern.

---

## 4. Accessibility and UI checks (ui-ux-pro-max checklist)

| Check           | Target            | New site                                                                                                       | Fix                                                                                        |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Colour contrast | ≥ 4.5:1           | ✅ Body `#B5B5B5` on `#101010` ≈ 9.9:1                                                                         | —                                                                                          |
| Smallest text   | ≥ 12px            | ❌ Eyebrow labels are **10px** on phones                                                                       | Change `--fs-caption` in `src/styles/index.css` (mobile) from 10px to 12px                 |
| Touch targets   | ≥ 44×44px         | ❌ LinkedIn icons 28×36, menu button 40×40, phone buttons 39px tall, header links 17px tall, team arrows 38×14 | Add padding or `min-h-11 min-w-11` hit areas (the visual size can stay)                    |
| Form labels     | Visible label     | ⚠️ Placeholder-only (screen-reader labels are hidden)                                                          | Keep a visible label once text is typed (floating label), or add small labels above fields |
| Form errors     | Next to the field | ❌ No validation messages                                                                                      | Show messages under each field; `aria-describedby`, `aria-invalid`                         |
| Skip link       | Present           | ❌ Missing                                                                                                     | "Skip to content" link before the header, pointing to `<main id="main">`                   |
| Reduced motion  | Respected         | ✅ Marquee, flip and hover scaling                                                                             | —                                                                                          |
| Heading order   | No skipped levels | ✅ One `h1` per page, no skips                                                                                 | —                                                                                          |
| Layout shift    | CLS < 0.1         | ✅ 0–0.001                                                                                                     | —                                                                                          |

---

## 5. Implementation plan (priority order)

Each item lists **what**, **where**, and **done when**.

### P0: must fix before launch

**5.1 Make the contact form work**

- **What:** send submissions to a backend. Options: Webflow Forms via their API, Formspree or Getform (no server needed), or your own endpoint. Add a loading state (the `Button`/`FormCta` loading variant from Figma), a success message, an error message, and per-field validation for email, phone and URL.
- **Where:** `src/components/sections/ContactForm.tsx`, `src/data/contactPage.ts`.
- **Done when:** a test submission arrives in the inbox, and invalid input shows a message under its field.

**5.2 Real Terms & Conditions and Privacy Policy pages**

- **What:** `/terms` and `/privacy` pages. The privacy page must cover what the form collects and why.
- **Where:** new pages in `src/pages/legal/`, routes in `src/routes.tsx`, links in `src/data/site.ts`.

**5.3 Book a call directly**

- **What:** point "Schedule a Call" and "Schedule a discovery call" at the Calendly link from the live site (`calendly.com/hello-chc/coffee-with-alvyl`, to be confirmed), or embed Calendly on `/contact-us` above the form. Keep the form for written enquiries.
- **Where:** `src/data/site.ts` (`headerCta`), `src/data/home.ts` (`hero.actions`).

**5.4 Fix content contradictions**

- **What:**
  - Confirm the launch year (2018 or 2020).
  - Replace the "contract caterers" promise copy on About.
  - Make stats consistent: "40+ employees" vs. the team list (32 in the CMS).
  - Every number needs a source you'd defend: 100+ projects, 50+ clients, ↑52%, ↑24%.
- **Where:** `src/data/about.ts`, `src/data/offerings.ts`, `src/data/seo.ts`.

### P1: add the live site's proof and depth

**5.5 One page per service (from the live site)**

- **What:** `/services/product-design`, `/services/site-reliability`, `/services/agentic-ai`, `/services/iot-machine-learning`.
- **Reuse:**
  - The capability lists from the live pages (e.g. SRE: Incident Prevention, Error Budgeting, SLI/SLO Management, Chaos Engineering…; Design: UX, UI, Brand Identity, Motion…).
  - The 6 benefit blocks per page ("Proactive Incident Management", "Human-Centered Design"…).
  - One named testimonial per page.
- **Design:** new site components (`FeaturePanel`, card grid with `hover-alchemy`, `ContactSection` at the end).
- **Update:** each Home service card links to its own page, and each page gets its own title and description in `src/data/seo.ts`. The live site's descriptions are a good start (fix the "Alkyl" typo).

**5.6 Case studies ("Selected work")**

- **What:** turn the Offerings "Selected work" panel into real case studies. Start with **Silk Worm** from the live site ("IoT sensor product for print machines… real-time monitoring and predictive maintenance"). Each case study covers client, problem, what we built, result metrics, images and a quote.
- **Where:**
  - A Webflow CMS collection "Case Studies", fetched at build time like the team (`scripts/webflow-team.mjs` pattern).
  - Pages at `/work/<slug>`.
  - The unused `src/pages/home/sections/CaseStudies.tsx` carousel can come back on Home.
- **Done when:** at least 2 case studies are live and the "↑ 52%" / "↑ 24%" stats link to the project they came from.

**5.7 Testimonials**

- **What:** a testimonial strip under the Customers logos. Use only **named** quotes, such as Ratna Garba's "They treat your project with the commitment and care as if it's their own masterpiece." Drop the live site's "ANONYMOUSL" quotes; anonymous quotes reduce trust.
- **Where:** `src/components/sections/`, data from the CMS.

**5.8 Team roles and personal quotes**

- **What:** fill in `job-role` for everyone in the Webflow Teams collection (the live site already has Head of Engineering, Senior Designer, Creative Director…) and add a `quote` field. The flip cards then show each person's own quote.
- **Where:** Webflow CMS; `scripts/webflow-team.mjs` (read `quote`); `src/data/home.ts` (drop `placeholderQuote`).

**5.9 Social links**

- **What:** LinkedIn, Instagram and X icons in the footer, with the header optional. Fix the live site's Instagram link, which points to instagram.com rather than the Alvyl profile.
- **Where:** `src/data/site.ts`, `src/components/layout/Footer.tsx`.

**5.10 Culture story**

- **What:** bring over "Why our builders?" from the live site ("Friendly and passionate… code, talk football, go cycling…") with the office photo, as an About section before Careers. It makes Careers more convincing.

### P2: polish, SEO and growth

**5.11 Accessibility fixes from §4**

- **What:**
  - 12px minimum text.
  - 44×44px tap targets.
  - A visible label on fields that have content.
  - A skip link.

**5.12 SEO extras**

- **What:**
  - `<link rel="canonical">` on every page.
  - `sitemap.xml` (currently `/sitemap.xml` returns the Home page).
  - Organization and LocalBusiness **JSON-LD** (name, logo, email, phone, `sameAs` social links).
  - A 1200×630 Open Graph share image.
  - A real **404 page** with a `noindex` meta tag.
- **Where:** `scripts/prerender.mjs` (canonical, JSON-LD, sitemap), `public/og-image.jpg`, `src/pages/NotFound.tsx`.

**5.13 Blog / Insights (optional)**

- **What:** only if someone will publish at least one post a month. The live blog has a single 2023 post, and a stale blog hurts more than no blog. If yes: a Webflow "Posts" collection, prerendered like the other pages.

**5.14 Motion accent from the live site (optional)**

- **What:** the live site's kinetic marquee headline ("People first tech studio ∘ Team of builders") is memorable. A single marquee band between Hero and "Why we exist" would add energy. Use the same `animate-marquee` utility, and respect reduced motion.

**5.15 Customer logos**

- **What:** re-export all logos at the same height, cropped tight, with transparent backgrounds and one grey. Cloudnine and Vocera currently look off-size.

---

## 6. Don't carry over from the live site

- The 27 MB page weight: unoptimised images and heavy third-party scripts (16 third-party cookies, 4.3 s of main-thread blocking).
- The tiny, widely spaced uppercase labels and low-contrast grey text.
- Emoji decorations (🌚 ☀️) on team cards; use the design-system icons instead.
- Anonymous testimonials, typos ("Alkyl", "ANONYMOUSL", "RECRUTING") and the "© 2023" date.
- Links that point nowhere (the `rythm-path-five.webflow.io/#` footer link, the generic Instagram link).

---

## 7. Suggested order of work

| Sprint | Items                    | Outcome                                                                                 |
| ------ | ------------------------ | --------------------------------------------------------------------------------------- |
| 1      | 5.1, 5.2, 5.3, 5.4, 5.11 | Launch-ready: working form, legal pages, booking, consistent facts, accessibility fixes |
| 2      | 5.5, 5.8, 5.9, 5.12      | Service pages, full team, social links, stronger SEO                                    |
| 3      | 5.6, 5.7, 5.10           | Proof: case studies, testimonials, culture                                              |
| 4      | 5.13, 5.14, 5.15         | Growth and polish                                                                       |

After each sprint, re-run `npm run build && npx vite preview` and Lighthouse on all pages. Keep every score at 95 or above, and add each new page to the Playwright overflow/broken-image test in `tests/home.spec.ts`.
