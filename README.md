# Muses of Morenita

Amelia Arabe's personal platform: a portfolio and the early build-out of Muses of Morenita — a directory/platform for multi-hyphenate creatives to hold every career under one roof.

This repo is public and deployed via GitHub Pages at **https://libraryofmorenita-hub.github.io/muses-of-morenita/**, which redirects to the platform site (`app/muses-of-morenita-site.html`). Amelia's own portfolio lives at `app/amelia-arabe-portfolio.html` and is linked from there. `index.html` at the repo root is a legacy build kept for reference — not part of the live site.

## Stack

Static HTML/CSS/JS pages (no build step) backed by [Supabase](https://supabase.com) (Postgres + auth) for data. Fonts via Google Fonts, Supabase JS loaded from CDN. Each page is self-contained — open the file directly or serve the directory with any static file server.

## Structure

```
app/
  amelia-arabe-portfolio.html   The live portfolio template — role toggles (engineer/inventor/painter/cellist/visual),
                                 project grid, services, wishlist/inquiry flow. Resolves whose portfolio via
                                 ?u=<handle> (default 'amelia-arabe'), not a hardcoded email — any Muse's
                                 portfolio renders from this one file.
  templates/                    case-study.html / artwork.html / collection.html — one shared case-study
                                 template (parameterized by ?from=<role>) plus the Fine Art artwork/collection
                                 pair. Each fetches its own row by ?id= and joins the owning profile.
  dashboard.html                Auth-gated member dashboard — CRUD for profile, career toggles, projects,
                                 services, links, and products.
  muses-of-morenita-site.html   The platform's public marketing/directory SPA (hash-routed).
  board.html                    One pinboard editor, two visual templates (?template=bulletin|archive) —
                                 replaces the old bulletin-board.html/archive-stack.html fork. Editing requires
                                 being signed in as the board's owner (real RLS, not a shared password).
  card-designer.html            Shared sub-editor board.html redirects to for adding/editing a single item.

shared/
  app-shell.js         The one Supabase client + esc()/requireAuth()/getProfileByHandle() helper, loaded by
                        every page above instead of each hand-typing its own createClient().
supabase/
  schema.sql           Forward-designed schema. NOTE: not fully representative of the live database —
                        the live project evolved some tables independently. Check live schema before
                        any migration work.
  seed-pipeline.sql     Seeds job-application pipeline data.
  seed-portfolio.sql    Seeds career_toggles + projects for the portfolio.
legal/                Cookie notice, privacy policy, terms of service (PDFs).
index.html             Redirects to app/muses-of-morenita-site.html — the actual legacy build this used
                        to be lives in git history, not the current file (see the 2026-09-08 commit).
morenita-pitch-deck.html   Pitch deck for Muses of Morenita as a product.
```

Not in this repo: a separate Next.js prototype lives alongside this folder locally but is its own git project and is intentionally excluded (see `.gitignore`).

## Deploying the portfolio

The public portfolio site is a trimmed export of `app/amelia-arabe-portfolio.html` + `app/templates/` + the handful of image assets it references, pushed to the `amelia-arabe` repo's `main` branch and served via GitHub Pages from `/`. It is **not** a mirror of this repo — client files, resumes, the job tracker, and the Supabase schema stay out of the public repo entirely.

## Database

Supabase project: `kebmscbmfzpvcqrvvpul` ("muses-of-morenita") — its own dedicated project as of Sept 2026. Previously this repo unknowingly shared Library of Morenita's project (`agekvrkqrwepdoeetpbx`); that entanglement is why an unrelated change to Library of Morenita once broke this app. Key tables: `profiles`, `career_toggles`, `projects`, `social_links`, `board_items`, `archive_products`, plus the rest of `supabase/schema.sql`. `profiles`/`career_toggles`/`projects`/`social_links` are fully migrated onto Amelia's real auth id on this project. Always check `information_schema` against the live project before assuming `schema.sql` is current.

**Platform boundary (Sept 2026):** Muses of Morenita is portfolio- and marketplace-first — browsing, discovery, and (eventually) the creator course marketplace. Anything that's really internal *workspace* tooling belongs to Morenita Technology instead, not here. Two tools that had drifted into this repo historically have been moved out:

- **Partnerships tracker** — formerly `partnerships.html` (before that, job-tracker.html) — now lives inside Morenita Technology's own internal dashboard (`morenita-dashboard`), backed by `internal.partnerships` in the Morenita Technology Supabase project. The 67 rows of real pipeline data moved with it. Nothing partnership-related remains in this repo or database.
- **Studio (client CRM)** — the `portal.html` client-status page and dashboard.html's "Studio" panel (clients/projects/milestones/updates) were removed. They were unfinished prototypes with zero real client data — the underlying tables (`client_contacts`, `client_projects`, `project_updates`, `project_milestones`) held no rows, and the panel had been silently non-functional since at least Aug 2026 (per its own code comment). The *idea* survives as a future Muses of Morenita product feature (a Figma/Canva-style workspace where creators collaborate with clients and share a trackable project dashboard), but it will be prototyped inside Morenita Technology first, not rebuilt here until it's real.
