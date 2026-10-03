# SEO strategy: how Alvyl ranks first when people search for a consulting company

Written 3 Oct 2026, based on how the site is built today.

## The honest starting point

No one can guarantee position 1, and no one can rank first for a bare phrase like **"consulting
company"**. That phrase is searched worldwide and is owned by firms like Deloitte, McKinsey and
Accenture, with decades of links and thousands of pages. Chasing it wastes time.

What Alvyl **can** own is the searches its real clients type. Those searches are more specific, and
the people making them are far more likely to buy:

| Instead of | Target |
|---|---|
| consulting company | product design consulting company India |
| AI company | agentic AI development company for startups |
| IT services | site reliability engineering (SRE) consulting services |
| IoT company | IoT and machine learning solutions company India |
| design agency | UX/UI product design studio for SaaS startups |
| *(local)* | software consulting company in **[your city]** |

Rank first for 20–40 searches like these and you will get more qualified leads than a page-5
position for "consulting company" ever could. Rankings for this kind of search typically take
**3–9 months** of steady work.

---

## 1. What's already done on the site

The technical foundation is strong. Don't rebuild it.

- Every page is **prerendered HTML**, so Google reads full content without running JavaScript.
- Every page has its own **title (≤ 60 chars, keyword first)**, **meta description (≤ 160)**,
  **canonical URL**, robots tag, Open Graph and Twitter tags (`src/data/seo.ts` → `scripts/prerender.mjs`).
- **Structured data (JSON-LD):** Organization, BlogPosting with author and dates, and breadcrumbs.
- **sitemap.xml** is generated on every build, and `robots.txt` exists.
- Old `/post/<slug>` URLs redirect to the new blog URLs, so links from the old site keep their value.
- A test enforces the title and description limits, so they can't silently break.

---

## 2. Site changes still worth making (developer tasks)

1. **Put the target keywords in titles and headings.** Today the Home title is
   "Product Design, Agentic AI, IoT & SRE Studio". It names the services but never says
   "consulting" or a location. Proposed:
   - Home: `Alvyl | Product Design & AI Consulting Company, India` (54 chars)
   - Each service page: `<Service> Consulting Services | Alvyl`
   - The Home `<h1>` ("We're a team of builders") is brand copy. Add a visible line near it that
     states what Alvyl is in plain words, for example "Product design, SRE, agentic AI and IoT
     consulting for startups and enterprises." The sub-headline already does this, so keep it.
2. **Add `LocalBusiness` / `ProfessionalService` structured data** to Home, with address,
   phone, opening hours, `areaServed`, `sameAs` (LinkedIn, Clutch, GitHub and so on) and a
   `priceRange`. This helps Google show you in local results and with rich details.
3. **Add `Service` structured data** to each service page, and **`FAQPage`** where a page has a
   visible FAQ.
4. **One page per service and per industry.** Each service already has its own URL. Add pages for
   the industries you serve, such as "AI consulting for fintech" and "IoT for manufacturing".
   Each one ranks for its own searches.
5. **A case-study section** (`/work/<client>`) with real problems, numbers and outcomes. These pages
   rank for "<industry> + <service>" searches and they convert visitors. The Home carousel was
   removed; bring the case studies back as pages instead.
6. **Speed (Core Web Vitals).** Google ranks fast pages higher. Check
   [PageSpeed Insights](https://pagespeed.web.dev) on the live site for both mobile and desktop.
   The Home hero animation runs off the main thread already. Keep LCP under 2.5 s, INP under
   200 ms and CLS under 0.1.
7. **Internal links.** Every blog post should link to the matching service page with descriptive
   text ("our site reliability engineering services"), and each service page should link to its
   two or three best posts.
8. **Image alt text** describing the image, and descriptive file names (`iot-dashboard.webp`,
   not `img1.webp`).

---

## 3. Google Search Console and Business Profile (do this first, this week)

1. **Google Search Console:** verify alvyl.com, submit `https://www.alvyl.com/sitemap.xml`, and
   check *Pages* for anything not indexed. This is free, and it's the only place that shows which
   searches you already appear for.
2. **Bing Webmaster Tools:** import from Search Console in one click. Bing also powers several
   AI search tools.
3. **Google Business Profile** (the map listing). This is the single biggest lever for
   "consulting company near me" or "in <city>" searches.
   - Category: "Software company" or "Business management consultant", plus secondary
     categories for your services.
   - The exact same name, address and phone (**NAP**) as on the website and every directory.
   - Photos of the team and office, the services list, and a weekly post.
   - **Reviews:** ask every happy client. Volume, recency and replies all matter.
4. **Google Analytics 4** to see which pages bring leads. The tag goes in `index.html`.

---

## 4. Content: the engine that compounds

Google ranks pages that answer what buyers search. Publish **2–4 strong articles a month** through
the blog CMS, each aimed at one search:

- **Buyer-question posts:** "How much does an MVP cost in 2026?", "Agentic AI vs RPA: which does
  your business need?", "How to choose an SRE consulting partner", "IoT project checklist for
  manufacturers".
- **Comparison and "best" posts:** "Top product design consulting companies in India". Be fair,
  include yourself, and explain your criteria.
- **Case studies:** problem → approach → measurable result.
- **Expert notes from named engineers.** Google rewards real experience (E-E-A-T: experience,
  expertise, authority, trust). Every post should have a real author, a role and a LinkedIn link.
  The CMS and the BlogPosting schema already support this.

Each article needs one main keyword in the title, the H1 and the first paragraph. It also needs a
clear answer near the top (this wins featured snippets and AI-overview citations), at least
1,000 words of genuine substance, links to a service page, and an update date when you refresh it.

---

## 5. Authority: links and mentions from other sites

Links from trusted sites are still one of the strongest ranking factors.

- **Directories with reviews:** Clutch, GoodFirms, DesignRush, The Manifest and Upwork agency
  profiles. Buyers search these directly, and they rank on page 1 for "top X companies".
- **Listings:** LinkedIn company page, Crunchbase, JustDial / Sulekha (India), local chambers of
  commerce, NASSCOM if eligible.
- **Guest articles and podcasts** in your niche: AI, SRE, IoT and design publications.
- **Client sites:** ask clients for a "Built with Alvyl" credit or a testimonial that links back.
- **Open source and talks:** GitHub projects, meetups and conference talks with a link to alvyl.com.
- **Never buy links.** Paid link networks get sites penalised.

---

## 6. AI search (ChatGPT, Gemini, Perplexity, Google AI Overviews)

More buyers now ask AI tools "which company should I hire for…". These tools quote sources they
trust:

- Clear, factual pages stating who you are, what you do, where, for whom, since when and with what
  results. The About page's "Founded 2018, 40+ people" is exactly this kind of fact.
- Consistent profiles everywhere (Clutch, LinkedIn, Google Business Profile).
- Being mentioned in "top companies" lists and reviews.
- FAQ sections that answer questions directly.

---

## 7. A 90-day plan

| When | Do |
|---|---|
| Week 1 | Search Console + sitemap, Bing, GA4, Google Business Profile, LinkedIn page cleanup |
| Weeks 1–2 | Retitle Home and service pages around target keywords; add LocalBusiness, Service and FAQ schema |
| Weeks 2–4 | Clutch + GoodFirms profiles; ask 5–10 clients for reviews; 2 case-study pages |
| Month 2 | 4 articles aimed at buyer questions; internal links from posts to services; first industry page |
| Month 3 | 4 more articles; 2 guest posts or podcasts; review Search Console and double down on what is rising |
| Every month | Check rankings for your 20–40 target searches, refresh posts older than 6 months, keep reviews coming |

## 8. How to measure progress

- **Search Console → Performance:** impressions, clicks and average position per search and per page.
- **Leads:** contact-form submissions and calls from organic search (GA4 conversions).
- **Map pack:** your position in Google Maps for "<service> company in <city>".
- Track success by **qualified leads from search**, not by one keyword's position.

---

## What to avoid

- Keyword stuffing, hidden text, or many near-identical "city" pages.
- Buying links or reviews.
- Copying text from other sites, or publishing thin AI-written posts with no real experience in them.
- Changing URLs without redirects. The site already redirects old `/post/` URLs; keep doing that.
