# Website feedback: new Alvyl site, recheck

**Date:** 25 Sep 2026 (recheck of the 24 Sep 2026 review)
**Checked:** the new site in this repo: `/`, `/about`, `/offerings`, `/contact-us` and the new 404 page, at 1440px and 375px.
**Goal:** one professional site that keeps the new site's design, speed and structure and adds the proof and depth the live site (www.alvyl.com) already has.

---

## 1. Summary

Since the first review, 6 items are fixed:

- the contact form
- the founded year
- the 404 page
- the minimum text size
- the tap areas
- the customer logos and the hero sub-headline

Speed, accessibility and SEO are still 94–100 on every page.

The biggest gap is unchanged: **proof and depth.** There are still:

- no case studies
- no testimonials
- no service pages
- no legal pages

This recheck also found 4 new issues:

- The same paragraph is repeated 3 times.
- Three Home sections share the "What we offer" label.
- The Careers panel has no link.
- Contact fields have small tap areas.

---

## 2. How this recheck was done

| Skill / tool         | How it was used                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **design-critique**  | First impression, usability, hierarchy, consistency and accessibility (sections 4–6)                                                                                           |
| **Lighthouse 13.5**  | Mobile and desktop scores for all 5 pages on the production build (`npm run build`, `vite preview`)                                                                            |
| **Playwright audit** | Every page at 1440px and 375px: text under 12px, tap areas under 44×44px, missing alt text, `#` links, heading order, horizontal scroll, console errors, full-page screenshots |
| **Code review**      | Each item from the first review checked against `src/data/*`, components and build scripts                                                                                     |

---

## 3. Scorecard

### Lighthouse (production build)

| Page      | Performance (mobile / desktop) | Accessibility | Best Practices | SEO   | Page weight (mobile) | LCP (mobile) |
| --------- | ------------------------------ | ------------- | -------------- | ----- | -------------------- | ------------ |
| Home      | 96 / 100                       | 100           | 100            | 100   | 368 KiB              | 2.7 s        |
| About     | 96 / 100                       | 100           | 100            | 100   | 327 KiB              | 2.9 s        |
| Offerings | 97 / 100                       | 100           | 100            | 100   | 287 KiB              | 2.6 s        |
| Contact   | 94 / 100                       | 100           | 100            | 100   | 342 KiB              | 3.0 s        |
| 404       | 91 / 100                       | 100           | 96             | 66 \* | 480 KiB              | 3.4 s        |

CLS is 0–0.001 on every page. The live site measured 28–65 for performance, 82–95 for accessibility and up to 27 MB per page.

\* The 404 page is marked `noindex` on purpose, so Lighthouse lowers its SEO score. That is correct for an error page.

`vite preview` answers unknown URLs with status 200. GitHub Pages serves `dist/404.html` with a real 404 status. Check this again after the next deploy.

### Automated audit (all pages, 375px and 1440px)

| Check                     | Result                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| Text smaller than 12px    | ✅ None                                                                  |
| Links/buttons under 44×44 | ✅ None                                                                  |
| Form fields under 44px    | ❌ Text inputs are 19px tall where a tap registers (see §4)              |
| Images without `alt`      | ✅ None                                                                  |
| Heading order             | ✅ One `h1` per page, no skipped levels                                  |
| Horizontal scroll (375px) | ✅ None                                                                  |
| Console errors            | ✅ None                                                                  |
| Links to `#`              | ❌ Terms & Conditions, Privacy Policy (every page), 2 case-study buttons |

---

## 4. Design critique

### Overall impression

The site still reads as a premium studio site: dark canvas, IvyMode headlines with Alchemy accents, strong photography. The new sub-headline fixes the old "what does Alvyl do?" gap. The page now says it in the first two seconds. The biggest opportunity is still **proof**. Visitors see "100+ projects", "↑ 52% retention" and "Proven results, stunning designs", but no project backs them up.

### Usability

| Finding                                                                                                                                                  | Severity               | Recommendation                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Terms & Conditions and Privacy Policy still go to `#`. The form now collects names, emails, phone numbers and documents.                                 | 🔴 Critical (legal)    | Publish `/terms` and `/privacy` before launch. The privacy page must say the form is processed by FormSubmit and emailed to info@alvyl.com. |
| Contact form needs a one-time activation. FormSubmit delivers nothing until the link in its activation email to info@alvyl.com is clicked.               | 🔴 Critical until done | Send one test submission from the deployed site and confirm the activation email.                                                           |
| No validation messages for Name, Email, Contact No or Message. Only the browser's default bubbles appear.                                                | 🟡 Moderate            | Show a message under each field, with `aria-invalid` and `aria-describedby`. The attachment field already does this.                        |
| "Proven results, stunning designs" (Offerings → Selected work) is a heading and a paragraph with no work in it. The "View Case Study" buttons go to `#`. | 🟡 Moderate            | Add at least 2 case studies (Silk Worm from the live site first), or hide the panel until they exist.                                       |
| ✅ Fixed: each Home service card now opens its own page (`/services/…`). Offerings is still titled "Digital Design Studio" and only covers design.       | 🟢 Minor               | Retitle Offerings to cover all four services, or make it the design page.                                                                   |
| The Careers panel (About) has a headline and a photo but no link or button.                                                                              | 🟡 Moderate            | Add a "See open roles" button (email, a careers page or LinkedIn Jobs).                                                                     |
| "Schedule a Call" still opens the contact form, not a booking tool.                                                                                      | 🟡 Moderate            | Link to Calendly (`calendly.com/hello-chc/coffee-with-alvyl` from the live site, to be confirmed).                                          |
| The "What we offer" panel's button says "Learn more about us" and goes to `/about`.                                                                      | 🟢 Minor               | Change it to "Explore our services" → `/offerings`.                                                                                         |
| Contact text fields: only the 19px-tall input inside each 56px field responds to a tap. Tapping the padding does nothing.                                | 🟢 Minor               | Make the whole field clickable: have the `<input>` fill the field (`h-full`), or make the wrapper a `<label>`.                              |

### Visual hierarchy

- **What draws the eye first:** the headline "We're a team of builders", then the new sub-headline "Product design, SRE, AI and IoT for startups and enterprises." Correct. Purpose is now clear at a glance.
- **Reading flow:** clean top-to-bottom sequence of panels on every page.
- **Emphasis:** the stats (100+, 50+, 100%, ↑52%, ↑24%) are still the most emphasised claims, with nothing next to them that proves them. Link each stat to the project it came from once case studies exist.
- ✅ **Offerings "From ordinary to extraordinary":** fixed. The headline is plain white, and the letters that cross the orange circle turn black, as in the design. The subtitle stays readable above the circle.

### Consistency

| Element            | Issue                                                                                                                                                                                                                           | Recommendation                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Repeated paragraph | "We move with the agility of a startup and the precision of an enterprise partner…" appears in **Startup Speed** and **Tech is our language** on Home, and again in **Selected work** on Offerings. Visitors read it 2–3 times. | Give "Tech is our language" and "Selected work" their own copy (`src/data/home.ts`, `src/data/offerings.ts`). |
| Section labels     | Three Home sections are all labelled "WHAT WE OFFER": What we offer, Startup Speed and Tech is our language.                                                                                                                    | Give each its own eyebrow, e.g. "How we work" and "What drives us".                                           |
| About promise copy | "digital solutions for **contract caterers**" still appears in the "We Promise to…" card and in the About search description. It contradicts the services on every other page.                                                  | Rewrite both (`src/data/about.ts`, `src/data/seo.ts`).                                                        |
| Employee count     | About says "40+ employees"; the team carousel shows 32 people.                                                                                                                                                                  | Confirm the number, or add the missing people to the Webflow Teams collection.                                |
| Team cards         | Only 1 of 32 people has a role, and every card shows the same stand-in quote.                                                                                                                                                   | Fill `job-role` and add a `quote` field in Webflow.                                                           |
| ✅ Founded year    | Fixed: 2018 on the About page and in its search description.                                                                                                                                                                    | —                                                                                                             |
| ✅ Customer logos  | Fixed: cropped tight, one grey, sized by visual weight. Reverie's source file is only 95×28px and looks slightly soft.                                                                                                          | Replace with a larger export, then run `npm run logos`.                                                       |

### Accessibility

- **Colour contrast:** body text `#B5B5B5` on `#101010` ≈ 9.9:1 ✅. The Alchemy red end (`#CE1D1E`) on black is ≈ 3.8:1. That passes for headings (large text) but not for the 16px footer email and phone number, which fade into it. Use the orange end (`#CE521D`, ≈ 4.9:1) or white for small links.
- **Touch targets:** ✅ every link and button is at least 44×44px. ❌ The contact text fields register taps on only 19px (see Usability).
- **Text readability:** ✅ nothing under 12px. Eyebrows are now 12px on phones.
- **Still open from the first review:**
  - no "Skip to content" link
  - form labels are placeholder-only, so the label disappears once text is typed
  - no per-field error messages

---

## 5. Status of the first review's items

| #    | Item                   | Status     | Notes                                                                                                                                                                             |
| ---- | ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1  | Working contact form   | ✅ Done\*  | FormSubmit emails info@alvyl.com with the document attached (10 MB max) and shows sending/sent states. \*Needs the one-time activation, and per-field messages are still missing. |
| 5.2  | Terms & Privacy pages  | ❌ Open    | Links still go to `#`.                                                                                                                                                            |
| 5.3  | Book a call (Calendly) | ❌ Open    | "Schedule a Call" still goes to `/contact-us`.                                                                                                                                    |
| 5.4  | Content contradictions | ⚠️ Partly  | Year fixed (2018). "Contract caterers", 40+ vs. 32, and unsourced stats remain.                                                                                                   |
| 5.5  | One page per service   | ✅ Done    | 4 pages with content from www.alvyl.com. Agentic AI copy and 3 hero intros to confirm; no named testimonials yet except Ratna Garba (design).                                     |
| 5.6  | Case studies           | ❌ Open    |                                                                                                                                                                                   |
| 5.7  | Testimonials           | ❌ Open    |                                                                                                                                                                                   |
| 5.8  | Team roles and quotes  | ❌ Open    | 1 of 32 roles filled; one shared stand-in quote.                                                                                                                                  |
| 5.9  | Social links           | ❌ Open    |                                                                                                                                                                                   |
| 5.10 | Culture story          | ❌ Open    |                                                                                                                                                                                   |
| 5.11 | Accessibility fixes    | ⚠️ Partly  | 12px minimum ✅, 44×44 tap areas ✅. Skip link, visible labels and field errors are open.                                                                                         |
| 5.12 | SEO extras             | ⚠️ Partly  | 404 page with `noindex` ✅. Canonical links, `sitemap.xml`, JSON-LD and a 1200×630 share image are open.                                                                          |
| 5.13 | Blog / insights        | — Optional |                                                                                                                                                                                   |
| 5.14 | Marquee accent         | — Optional |                                                                                                                                                                                   |
| 5.15 | Customer logos         | ✅ Done    | See Consistency.                                                                                                                                                                  |
| —    | Hero sub-headline      | ✅ Done    | "Product design, SRE, AI and IoT for startups and enterprises."                                                                                                                   |

---

## 6. What works well (keep it)

- A consistent design system: Figma tokens, 3 breakpoints, one set of components, the same header and footer on every page.
- Speed: prerendered HTML, responsive WebP, deferred fonts. Every page scores 94–100 and weighs under 0.5 MB.
- The phone layout: no horizontal scroll, readable text, and large tap areas that don't change the visual design.
- A proper "Page not found" page with a way back Home, instead of silently showing Home.
- The team flip cards and hover states still feel crafted.

---

## 7. Priority recommendations

**Before launch**

1. **Legal pages**: publish `/terms` and `/privacy` and link them in the footer. The form now collects personal data and documents.
2. **Activate the form**: send one test from the deployed site and confirm FormSubmit's activation email to info@alvyl.com.
3. **Fix the copy**:
   - replace "contract caterers"
   - rewrite the repeated "agility of a startup" paragraph in two of its three places
   - give each Home section its own label
   - confirm 40+ employees

**Next sprint**

4. **Proof**: at least 2 case studies (Silk Worm first) and named testimonials. Link the ↑52% and ↑24% stats to them, and hide the empty "Selected work" panel until then.
5. **Service pages**: done. Confirm the Agentic AI copy and the new hero intros, and add a named testimonial to each page.
6. **Conversion**:
   - Calendly for "Schedule a Call"
   - a Careers link
   - "Explore our services" on the What we offer button

**Polish**

7. **Remaining accessibility**:
   - a skip link
   - visible labels
   - per-field error messages
   - full-height tap areas on the contact fields
   - orange or white instead of red for small footer links
8. **SEO extras**: canonical links, `sitemap.xml`, Organization JSON-LD, a 1200×630 share image. Also confirm the 404 status after deploy.
9. **Team data**: roles and personal quotes in Webflow, plus a larger Reverie logo.

After each round, re-run `npm run build && npx vite preview` and Lighthouse on all pages. Keep every score at 95 or above.
