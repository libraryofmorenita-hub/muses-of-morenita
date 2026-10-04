# Muses of Morenita

Amelia Arabe's personal platform: a portfolio and the early build-out of Muses of Morenita — a directory/platform for multi-hyphenate creatives to hold every career under one roof.

This repo is public and deployed via GitHub Pages at **https://libraryofmorenita-hub.github.io/muses-of-morenita/**. The root `index.html` is the platform's public site. Amelia's own portfolio lives at `/portfolio/` and is linked from there.

**Pretty paths (Oct 2026):** every page is a folder with an `index.html`, so URLs have no `.html` and no `/app/`. The old addresses (`app/*.html`, `app/templates/*.html`) remain as tiny redirect stubs that keep `?query` and `#hash`, so shared links and old sign-in emails still work.

## Stack

Static HTML/CSS/JS pages (no build step) backed by [Supabase](https://supabase.com) (Postgres + auth) for data. Fonts via Google Fonts, Supabase JS loaded from CDN. Each page is self-contained — open the file directly or serve the directory with any static file server.

## Structure

```
index.html            The platform's public marketing/directory SPA (hash-routed). Served at /.
portfolio/            The live portfolio template — role toggles (engineer/inventor/painter/cellist/visual),
                       project grid, services, wishlist/inquiry flow. Resolves whose portfolio via
                       ?u=<handle> (default 'amelia-arabe'), not a hardcoded email.
case-study/           One shared case-study template (parameterized by ?from=<role>), plus
artwork/ collection/   the Fine Art artwork/collection pair, and
model-gallery/         the swipeable photo-gallery variant. Each fetches its own row by ?id=.
portal/               Auth-gated member portal (formerly dashboard.html) — CRUD for profile, career
                       toggles, projects, services, links, and products.
board/                One pinboard editor, four visual templates (?template=bulletin|archive|vinyl|gallery).
                       Editing requires being signed in as the board's owner (real RLS).
designer/             Shared sub-editor board/ sends you to for adding/editing a single item.
app/                  Redirect stubs only (old .html addresses). Safe to delete once nobody links to them.

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
morenita-pitch-deck.html   Pitch deck for Muses of Morenita as a product.
```

Not in this repo: a separate Next.js prototype lives alongside this folder locally but is its own git project and is intentionally excluded (see `.gitignore`).

## Deploying the portfolio

The public portfolio site is a trimmed export of `portfolio/` + `case-study/` + `artwork/` + `collection/` + `model-gallery/` + the handful of image assets it references, pushed to the `amelia-arabe` repo's `main` branch and served via GitHub Pages from `/`. It is **not** a mirror of this repo — client files, resumes, the job tracker, and the Supabase schema stay out of the public repo entirely.

## Database

Supabase project: `kebmscbmfzpvcqrvvpul` ("muses-of-morenita") — its own dedicated project as of Sept 2026. Previously this repo unknowingly shared Library of Morenita's project (`agekvrkqrwepdoeetpbx`); that entanglement is why an unrelated change to Library of Morenita once broke this app. Key tables: `profiles`, `career_toggles`, `projects`, `social_links`, `board_items`, `archive_products`, plus the rest of `supabase/schema.sql`. `profiles`/`career_toggles`/`projects`/`social_links` are fully migrated onto Amelia's real auth id on this project. Always check `information_schema` against the live project before assuming `schema.sql` is current.

**Platform boundary (Sept 2026):** Muses of Morenita is portfolio- and marketplace-first — browsing, discovery, and (eventually) the creator course marketplace. Anything that's really internal *workspace* tooling belongs to Morenita Technology instead, not here. Two tools that had drifted into this repo historically have been moved out:

- **Partnerships tracker** — formerly `partnerships.html` (before that, job-tracker.html) — now lives inside Morenita Technology's own internal dashboard (`morenita-dashboard`), backed by `internal.partnerships` in the Morenita Technology Supabase project. The 67 rows of real pipeline data moved with it. Nothing partnership-related remains in this repo or database.
- **Studio (client CRM)** — the `portal.html` client-status page and muses-portal.html's "Studio" panel (clients/projects/milestones/updates) were removed. They were unfinished prototypes with zero real client data — the underlying tables (`client_contacts`, `client_projects`, `project_updates`, `project_milestones`) held no rows, and the panel had been silently non-functional since at least Aug 2026 (per its own code comment). The *idea* survives as a future Muses of Morenita product feature (a Figma/Canva-style workspace where creators collaborate with clients and share a trackable project dashboard), but it will be prototyped inside Morenita Technology first, not rebuilt here until it's real.
