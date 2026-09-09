# Muses of Morenita

Amelia Arabe's personal platform: a portfolio, a client-facing project portal, and the early build-out of Muses of Morenita — a directory/platform for multi-hyphenate creatives to hold every career under one roof.

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
                                 services, links, products, and Studio (clients/projects/milestones/updates).
  muses-of-morenita-site.html   The platform's public marketing/directory SPA (hash-routed).
  board.html                    One pinboard editor, two visual templates (?template=bulletin|archive) —
                                 replaces the old bulletin-board.html/archive-stack.html fork. Editing requires
                                 being signed in as the board's owner (real RLS, not a shared password).
  card-designer.html            Shared sub-editor board.html redirects to for adding/editing a single item.

portal.html          Client-facing, read-only project status page — no account, a ?token= link is the
                      access control (resolved via the get_portal_project() database function).
partnerships.html     Amelia's Potential Partnerships Dashboard — evolved from a job-application tracker into a
                      broader pipeline covering tech, modeling, and other creative partnerships/collaborators
                      (Supabase-connected, auth-gated). Backed by the `partnerships` table (formerly
                      job_applications).
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

Supabase project: `kebmscbmfzpvcqrvvpul` ("muses-of-morenita") — its own dedicated project as of Sept 2026. Previously this repo unknowingly shared Library of Morenita's project (`agekvrkqrwepdoeetpbx`); that entanglement is why an unrelated change to Library of Morenita once broke this app. Key tables: `profiles`, `career_toggles`, `projects`, `social_links`, `job_applications`, plus the rest of `supabase/schema.sql`. `job_applications` (67 rows) is fully migrated; `profiles`/`career_toggles`/`projects`/`social_links` are staged pending a fresh sign-up on the new project (Supabase auth doesn't carry over between projects). Always check `information_schema` against the live project before assuming `schema.sql` is current.

**Known overlap, not yet resolved:** `partnerships.html` (Amelia's Potential Partnerships Dashboard, formerly job-tracker.html) and `portal.html` + dashboard.html's "Studio" panel (client CRM for freelance work) live in this repo/database but aren't really part of the Muses of Morenita talent-agency product — they're Morenita Technology's own tools that ended up here historically. Flagged in the internal dashboard's Projects registry; not split out yet.

**Studio as future-product inspiration:** the client CRM + read-only `portal.html` pattern built for Amelia's own Studio work (client_contacts/client_projects/project_updates/project_milestones) is intentionally being kept as a working prototype for a *future* Muses of Morenita product feature — any creator on the platform collaborating with clients and sharing a trackable project dashboard with them. Not built yet; a direction, not a task.
