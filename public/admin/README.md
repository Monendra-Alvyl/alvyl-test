# Alvyl admin (Sveltia CMS)

This folder is the whole content admin, usable two ways at once:

- **On the website** at `<site>/admin/` and `<site>/admin/hr/` (it is in `public/`, so every build
  includes it). Never linked from the site, and `noindex`.
- **On its own, privately**: the same folder deployed to a separate, access-protected host (below).

Both edit the same content, so either can be used; the private one can replace the site copy later.

```
public/admin/
  index.html          full admin: blog posts, categories, team
  config.yml
  hr/index.html       HR admin: team only
  hr/config.yml       trimmed copy of ../config.yml (keep the team fields in sync)
  notify-website.yml  workflow to copy into the content repo (see below)
```

They are static files (the CMS itself loads from unpkg), so there is no build step.

## How it connects to the website

```
 admin (/admin or private URL) ──save = Git commit──▶ content repo Monendra-Alvyl/alvyl-test-blog
                                                           │ push → notify-website.yml (optional)
                                                           ▼
                         website repo Monendra-Alvyl/alvyl-test  (.github/workflows/deploy.yml)
                           checks out the content repo, builds, deploys to GitHub Pages
```

- `backend.repo` in both configs is the content repo the admin writes to.
- `site_url` / `display_url` is the website, for the admin's "view site" link. Change both configs
  when the site moves to www.alvyl.com.
- The website picks up saves on its daily build, on a manual run of its deploy workflow, or right
  away with `notify-website.yml` copied into the content repo (instructions at the top of that file).
- Locally, `npm run dev` in the website pulls the content repo clone (`../alvyl-test-blog`) every 15 s,
  so saves show up in seconds.

## Publishing it privately

Any static host works. Point it at this folder (no build command, output directory `public/admin`).

- **Cloudflare Pages + Cloudflare Access** (recommended, free): create a Pages project from the
  website repo with root directory `public/admin` and no build command, then add an Access application for
  its URL that allows only your team's emails (one-time code or Google login).
- **Netlify**: deploy this folder and turn on site password protection.
- **Only on your computer**: `npm run admin` (http://localhost:5180/ and http://localhost:5180/hr/).

Hosting it privately only hides the page. Editing still needs a GitHub sign-in with write access to the
content repo:

- **Access token**: a fine-grained GitHub token for `alvyl-test-blog` only, with **Contents: Read
  and write**, then **Sign In Using Access Token**.
- **One-click GitHub sign-in** (optional): deploy `sveltia-cms-auth` to Cloudflare Workers, add the
  admin's URL to its allowed domains, and set `base_url` in both configs.
- **Offline**: **Work with Local Repository** (Chrome or Edge), pick the `alvyl-test-blog` folder,
  then commit and push yourself.
