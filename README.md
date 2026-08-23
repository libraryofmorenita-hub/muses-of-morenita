# Muses of Morenita

Amelia Arabe's personal platform: a portfolio, a client-facing project portal, and the early build-out of Muses of Morenita — a directory/platform for multi-hyphenate creatives to hold every career under one roof.

This is the working codebase. It is private because it holds client-adjacent files and personal data (see [Structure](#structure)). The public-facing piece — Amelia's portfolio — is deployed separately from [`amelia-arabe`](https://github.com/libraryofmorenita-hub/amelia-arabe), live at **https://libraryofmorenita-hub.github.io/amelia-arabe/**.

## Stack

Static HTML/CSS/JS pages (no build step) backed by [Supabase](https://supabase.com) (Postgres + auth) for data. Fonts via Google Fonts, Supabase JS loaded from CDN. Each page is self-contained — open the file directly or serve the directory with any static file server.

## Structure

```
app/
  amelia-arabe-portfolio.html   Amelia's portfolio — role toggles (engineer/inventor/painter/cellist/visual),
                                 project grid, services, wishlist/inquiry flow. Reads career_toggles + projects
                                 from Supabase.
  templates/                    5 case-study page templates (technical/creative/fine-art/music/performance),
                                 one per career toggle. Each fetches its own project row by ?id= at load time.
  dashboard.html                Auth-gated member dashboard — CRUD for profile, career toggles, projects,
                                 services, links, products.
  muses-of-morenita-site.html   The platform's public marketing/directory SPA (hash-routed).
  archive-stack.html            Standalone archive/muse browsing page.
  bulletin-board.html           Standalone bulletin/board page.
  card-designer.html            Card design tool.

portal.html          Client-facing project portal (magic link or portal_token auth) — milestones,
                      updates, contracts, invoices.
job-tracker.html      Amelia's own job-application pipeline tracker (Supabase-connected, auth-gated).
supabase/
  schema.sql           Forward-designed schema. NOTE: not fully representative of the live database —
                        the live project evolved some tables independently. Check live schema before
                        any migration work.
  seed-pipeline.sql     Seeds job-application pipeline data.
  seed-portfolio.sql    Seeds career_toggles + projects for the portfolio.
legal/                Cookie notice, privacy policy, terms of service (PDFs).
index.html             Older/legacy portfolio version, kept for reference.
morenita-pitch-deck.html   Pitch deck for Muses of Morenita as a product.
```

Not in this repo: a separate Next.js prototype lives alongside this folder locally but is its own git project and is intentionally excluded (see `.gitignore`).

## Deploying the portfolio

The public portfolio site is a trimmed export of `app/amelia-arabe-portfolio.html` + `app/templates/` + the handful of image assets it references, pushed to the `amelia-arabe` repo's `main` branch and served via GitHub Pages from `/`. It is **not** a mirror of this repo — client files, resumes, the job tracker, and the Supabase schema stay out of the public repo entirely.

## Database

Supabase project: `agekvrkqrwepdoeetpbx` ("Library of Morenita"). Key tables: `profiles`, `career_toggles`, `projects`, `job_applications`, plus several tables from earlier prototyping not yet documented in `schema.sql`. Always check `information_schema` against the live project before assuming `schema.sql` is current.
