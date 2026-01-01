# Personal Website Starter (Next.js + TypeScript + Tailwind)

Minimal, responsive personal website starter built with Next.js (App Router), TypeScript and Tailwind CSS. Designed to deploy on Vercel free tier.

Quick start (Windows PowerShell):

```powershell
# 1) install deps
npm install

# 2) run dev server
npm run dev

# 3) open http://localhost:3000
```

Deploy: connect the repo to Vercel (free) and push to main. Add any environment variables (SENDGRID_API_KEY) in Vercel dashboard if you want email sending.

Notes:
- Contact API is a simple serverless route that supports SendGrid if configured; otherwise it logs request to server console for local testing.
- For blog posts, consider adding MDX or a headless CMS later (TinaCMS/Sanity/Contentful).

Admin & local dev
-----------------

To make it easy to test the admin UI locally without configuring OAuth, this project supports a dev-only credentials provider.

- Set a local `ADMIN_PASSWORD` and `NEXTAUTH_SECRET` in your `.env` (only for development):

```powershell
notepad .env
# add:
# ADMIN_PASSWORD=yourlocalpassword
# NEXTAUTH_SECRET=some_long_secret
# NODE_ENV=development
```

- Start the dev server and open the Sign-in page:

```powershell
npm run dev
# open http://localhost:3000/signin
```

- Use the dev password to sign in and you'll be redirected to `/admin`.

Blog & RSS
----------

This project now supports local Markdown posts placed under `src/posts/`.

- Add `.md` or `.mdx` files to `src/posts/` with frontmatter (title, date, excerpt). An example is `src/posts/my-first-post.md`.
- The blog index is at `/blog` and individual posts are available at `/blog/:slug`.
- An RSS feed is exposed at `/rss`. Set `NEXT_PUBLIC_SITE_URL` in your env to ensure links are correct in the feed (e.g. `https://yourname.com`).

MDX note
--------

The current implementation converts Markdown/MDX to HTML (suitable for most posts). If you want full MDX support (React components inside posts), I can add `@mdx-js` integration next.

Privacy & analytics consent
---------------------------

This site asks for consent before enabling analytics and error reporting. A small banner appears the first time a visitor arrives; if they accept, Google Analytics pageviews and Sentry error reporting will be enabled for that browser. You can configure:

- `NEXT_PUBLIC_GA_ID` — Google Analytics measurement id
- `NEXT_PUBLIC_SENTRY_DSN` — Sentry client DSN
- For server-side Sentry, set `SENTRY_DSN` and `SENTRY_TRACES_RATE` (see `.env.example`).

To test consent locally, set env vars, start the dev server, then accept the banner on first load.

Accessibility & Lighthouse
--------------------------

I added a basic Lighthouse CI configuration to help keep performance and accessibility high. The project includes:

- `.lighthouserc.json` — a default LHCI configuration with minimal thresholds.
- `.github/workflows/lighthouse.yml` — a GitHub Action that runs Lighthouse on push/PR to `main` and uploads a temporary report.

Run Lighthouse locally:

```powershell
# start the dev server
npm run dev

# in another shell (requires @lhci/cli installed globally or run via npx):
npx lhci autorun --config=.lighthouserc.json
```

If a check fails in CI, the workflow will surface the report — use it to prioritize accessibility and performance fixes.

Next steps I can implement for you on request:
- MDX blog setup and example post
- SendGrid integration for production email delivery
- Giscus comments and Algolia search
- GitHub Actions CI workflow + Lighthouse CI
