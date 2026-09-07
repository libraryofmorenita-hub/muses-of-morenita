-- ═══════════════════════════════════════════════════════
--  Muses of Morenita — Database Schema
--  Run this in the Supabase SQL editor (project: agekvrkqrwepdoeetpbx)
--  Order matters — referenced tables must exist before dependents.
--
--  STATUS as of 2026-09-07 (after the "structural rebuild" plan, all 3
--  phases): this file now matches the live database for everything it
--  defines — verified section by section against list_tables, not assumed.
--  `career_toggles`, `projects`, `service_accordions`, `service_items`,
--  `social_links`, `custom_domains`, `archive_products`, `board_items`,
--  `client_contacts`, `client_projects`, `project_milestones`,
--  `project_updates` are all live and match this file. `profiles` is live
--  with a few extra columns this file doesn't declare (added directly via
--  migration as they were needed: `handle`, `quote`, `email_contact`,
--  `phone`, `website`, `logo_url`) — looked up by `handle`, not `email` or
--  `username`.
--  Two old tables were dropped along the way, both with 0 rows at the time
--  (nothing lost): `client_portals` (Phase 2 — a JSON-blob-per-client design
--  only ever written to by index.html's legacy admin-token/Edge-Function
--  pipeline) and `bulletin_board_cards`/`archive_stack_objects` (Phase 3 —
--  merged into `board_items`).
--  `art_collections`/`artworks`/`tags`/`track_lessons` are live but not
--  declared here; they belong to other parts of the platform.
--  Tables named only in comments below as "other unrelated live tables"
--  (articles, maxine_hardware, curriculum_tracks, collections,
--  contact_submissions, etc.) belong to other tools outside this repo's
--  scope and are intentionally not reconciled here.
-- ═══════════════════════════════════════════════════════

-- ─── EXTENSIONS ─────────────────────────────────────────
-- monoUUID generation and text search
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";


-- ═══════════════════════════════════════════════════════
--  PROFILES
--  One row per user. Extends auth.users via the id foreign key.
--  This is the root of every muse's public identity.
-- ═══════════════════════════════════════════════════════
-- `if not exists` here is a no-op against the live `profiles` table, which
-- already existed with its own columns before this file was written. This
-- block is historical/documentation-only — see the file header for the
-- real live column list. The URL-slug column is `handle` (already unique),
-- not `username`; `quote`/`email_contact`/`phone`/`website`/`logo_url` were
-- added directly via migration in Phase 1 of the "structural rebuild" plan.
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        text unique,                   -- URL slug: amelia-arabe-portfolio.html?u=handle
  display_name  text,
  bio           text,
  quote         text,                          -- the sidebar quote on the portfolio page
  location      text,
  avatar_url    text,
  logo_url      text,
  email_contact text,
  phone         text,
  website       text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- auto-update updated_at on any row change
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();


-- ═══════════════════════════════════════════════════════
--  CAREER TOGGLES
--  Each row is one role on a muse's sidebar.
--  role_key can be a known value ('engineer', 'painter', etc.) or custom.
-- ═══════════════════════════════════════════════════════
create table if not exists career_toggles (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  role_key         text not null,    -- 'engineer' | 'painter' | 'cellist' | 'actress' | 'inventor' | custom
  role_name        text not null,    -- display name shown on the toggle
  overview         text,             -- the overview strip text when this toggle is active
  hire_label       text,             -- button text: 'Hire me to build', 'Book me', etc.
  service_section  text not null default 'work'
                   check (service_section in ('work', 'presence', 'knowledge')),
  accordion_id     text,             -- which accordion to open: 'acc-software', 'acc-cellist', etc.
  show_commission  boolean default false,
  sort_order       integer default 0,
  created_at       timestamptz default now()
);

create index career_toggles_user_id on career_toggles(user_id);


-- ═══════════════════════════════════════════════════════
--  PROJECTS
--  Each row is one card in a career toggle's project grid.
-- ═══════════════════════════════════════════════════════
create table if not exists projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  toggle_id   uuid not null references career_toggles(id) on delete cascade,
  title       text not null,
  category    text,             -- 'Full-Stack · SaaS', 'Oil on Canvas', etc.
  description text,
  url         text,             -- null if not publicly linked
  badge       text,             -- 'In Development', 'Client', 'Available', etc.
  image_url   text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

create index projects_toggle_id on projects(toggle_id);
create index projects_user_id   on projects(user_id);

-- case-study content, for the standalone project overview pages
alter table projects add column if not exists tags          text[] default '{}';
alter table projects add column if not exists case_problem  text;
alter table projects add column if not exists case_process  text;
alter table projects add column if not exists case_outcome  text;
alter table projects add column if not exists credits       text;
alter table projects add column if not exists gallery_urls  text[] default '{}';


-- ═══════════════════════════════════════════════════════
--  SERVICE ACCORDIONS
--  Each row is one accordion group on the services page.
--  section: which tab it lives under (work | presence | knowledge)
-- ═══════════════════════════════════════════════════════
create table if not exists service_accordions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  section      text not null check (section in ('work', 'presence', 'knowledge')),
  name         text not null,    -- accordion header: 'Software Systems', 'Cellist', etc.
  accordion_id text not null,    -- DOM-safe slug used to link from career_toggles.accordion_id
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

create index service_accordions_user_id on service_accordions(user_id);


-- ═══════════════════════════════════════════════════════
--  SERVICE ITEMS
--  Each row is one line item inside an accordion.
--  These become the wishlist-able offerings on the services page.
-- ═══════════════════════════════════════════════════════
create table if not exists service_items (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  accordion_id uuid not null references service_accordions(id) on delete cascade,
  name         text not null,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

create index service_items_accordion_id on service_items(accordion_id);
create index service_items_user_id      on service_items(user_id);


-- ═══════════════════════════════════════════════════════
--  SOCIAL LINKS
--  External links shown in the contact sidebar panel.
-- ═══════════════════════════════════════════════════════
create table if not exists social_links (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  platform   text not null,    -- 'instagram' | 'linkedin' | 'github' | 'website' | custom label
  url        text not null,
  sort_order integer default 0
);

create index social_links_user_id on social_links(user_id);


-- ═══════════════════════════════════════════════════════
--  CUSTOM DOMAINS
--  A muse can point their own domain to their profile.
--  The platform issues a CNAME target; they configure DNS.
-- ═══════════════════════════════════════════════════════
create table if not exists custom_domains (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  domain       text unique not null,      -- 'ameliaarabe.com'
  verified     boolean default false,
  cname_target text,                      -- platform hostname they point their CNAME to
  verified_at  timestamptz,
  created_at   timestamptz default now()
);

create index custom_domains_user_id on custom_domains(user_id);
create index custom_domains_domain  on custom_domains(domain);


-- ═══════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  Public profiles are readable by anyone.
--  Only the owner can insert, update, or delete their own rows.
-- ═══════════════════════════════════════════════════════

alter table profiles           enable row level security;
alter table career_toggles     enable row level security;
alter table projects           enable row level security;
alter table service_accordions enable row level security;
alter table service_items      enable row level security;
alter table social_links       enable row level security;
alter table custom_domains     enable row level security;

-- ── profiles ────────────────────────────────────────────
create policy "profiles: public read"
  on profiles for select using (true);

create policy "profiles: owner write"
  on profiles for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- ── career_toggles ──────────────────────────────────────
create policy "career_toggles: public read"
  on career_toggles for select using (true);

create policy "career_toggles: owner write"
  on career_toggles for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── projects ────────────────────────────────────────────
create policy "projects: public read"
  on projects for select using (true);

create policy "projects: owner write"
  on projects for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── service_accordions ──────────────────────────────────
create policy "service_accordions: public read"
  on service_accordions for select using (true);

create policy "service_accordions: owner write"
  on service_accordions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── service_items ───────────────────────────────────────
create policy "service_items: public read"
  on service_items for select using (true);

create policy "service_items: owner write"
  on service_items for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── social_links ────────────────────────────────────────
create policy "social_links: public read"
  on social_links for select using (true);

create policy "social_links: owner write"
  on social_links for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── custom_domains ──────────────────────────────────────
-- not public — only the owner sees their domain config
create policy "custom_domains: owner only"
  on custom_domains for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════
--  ARCHIVE PRODUCTS
--  Public product listings in The Archive.
--  Any Muse can list their own digital products, curriculum, or residencies.
--  Only published rows are visible to the public.
-- ═══════════════════════════════════════════════════════
create table if not exists archive_products (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  title        text not null,
  description  text,
  type         text not null default 'Digital Products'
               check (type in ('Digital Products', 'Curriculum', 'Residencies')),
  price_display text,               -- '$47', 'Free', 'From $99'
  is_free      boolean default false,
  purchase_url text,                -- external checkout link (Gumroad, Stripe, etc.)
  image_url    text,
  is_featured  boolean default false,
  sort_order   integer default 0,
  published    boolean default false,
  created_at   timestamptz default now()
);

create index archive_products_user_id  on archive_products(user_id);
create index archive_products_published on archive_products(published);


-- ═══════════════════════════════════════════════════════
--  STUDIO — CLIENT CONTACTS
--  Muses manage their client relationships here.
--  Each Muse has their own isolated client list.
-- ═══════════════════════════════════════════════════════
-- 2026-09-07 (Phase 2 of the "structural rebuild" plan): this whole block is
-- now deployed and LIVE, matching the code exactly — verified against the
-- live schema via list_tables. It replaces an earlier version of this same
-- design that included contract/invoice/cover/accent-color columns and a
-- `text`-typed portal_token; those columns never shipped in the deployed
-- version (client-portal v1 is core tracking only — status/tagline/
-- milestones/updates + a read-only client link; contracts/invoices/
-- e-signature/intake are a separate later pass) and portal_token is now a
-- real `uuid`. It also replaces the previously-undocumented, now-DROPPED
-- `client_portals` table (a JSON-blob-per-client design that only
-- index.html's legacy Edge-Function pipeline ever wrote to, and had 0 rows
-- at the time it was retired).
create table if not exists client_contacts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  email      text,
  company    text,
  phone      text,
  notes      text,
  created_at timestamptz default now()
);

create index if not exists client_contacts_user_id_idx on client_contacts(user_id);


-- ═══════════════════════════════════════════════════════
--  STUDIO — CLIENT PROJECTS
--  One row per project engagement with a client.
--  portal_token is the uuid used in the shareable status link:
--    portal.html?token=<portal_token>
--  A client never gets an account — the link is read entirely through
--  get_portal_project() below, which is the only thing anon can call.
-- ═══════════════════════════════════════════════════════
create table if not exists client_projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  client_id     uuid references client_contacts(id) on delete set null,
  name          text not null,
  status        text default 'Active',
  tagline       text,
  portal_token  uuid unique not null default gen_random_uuid(),
  created_at    timestamptz default now()
);

create index if not exists client_projects_user_id_idx   on client_projects(user_id);
create index if not exists client_projects_client_id_idx on client_projects(client_id);
create index if not exists client_projects_portal_token_idx on client_projects(portal_token);


-- ═══════════════════════════════════════════════════════
--  STUDIO — PROJECT UPDATES
--  Creator writes update entries; a client reads them via
--  get_portal_project(), never this table directly.
-- ═══════════════════════════════════════════════════════
create table if not exists project_updates (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  message    text not null,
  created_at timestamptz default now()
);

create index if not exists project_updates_project_id_idx on project_updates(project_id);


-- ═══════════════════════════════════════════════════════
--  STUDIO — PROJECT MILESTONES
--  Ordered checklist of deliverables per project.
-- ═══════════════════════════════════════════════════════
create table if not exists project_milestones (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references client_projects(id) on delete cascade,
  label      text not null,
  done       boolean default false,
  sort_order integer default 0
);

create index if not exists project_milestones_project_id_idx on project_milestones(project_id);


-- ═══════════════════════════════════════════════════════
--  RLS — NEW TABLES
-- ═══════════════════════════════════════════════════════

alter table archive_products   enable row level security;
alter table client_contacts    enable row level security;
alter table client_projects    enable row level security;
alter table project_updates    enable row level security;
alter table project_milestones enable row level security;

-- ── archive_products ─────────────────────────────────────
-- anyone can see published products; owner can see all their own
create policy "archive_products: public read published"
  on archive_products for select
  using (published = true or auth.uid() = user_id);

create policy "archive_products: owner write"
  on archive_products for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── client_contacts / client_projects / project_updates / project_milestones ──
-- Owner-scoped only, same pattern as career_toggles/projects — no blanket
-- using(true) anywhere, unlike the earlier version of this design. A client
-- with a portal link never queries these tables directly; they only ever
-- call get_portal_project(token) below, which is SECURITY DEFINER and
-- returns just the one project the token names.
create policy "client_contacts: owner only"
  on client_contacts for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "client_projects: owner only"
  on client_projects for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_updates: owner only"
  on project_updates for all
  using  (auth.uid() = (select user_id from client_projects where id = project_id))
  with check (auth.uid() = (select user_id from client_projects where id = project_id));

create policy "project_milestones: owner only"
  on project_milestones for all
  using  (auth.uid() = (select user_id from client_projects where id = project_id))
  with check (auth.uid() = (select user_id from client_projects where id = project_id));

-- The one, deliberately narrow, way a client (no account) reads their
-- project — see portal.html.
create or replace function public.get_portal_project(p_token uuid)
returns table (
  project_name text,
  status text,
  tagline text,
  milestones jsonb,
  updates jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    cp.name,
    cp.status,
    cp.tagline,
    (select coalesce(jsonb_agg(jsonb_build_object('label', m.label, 'done', m.done) order by m.sort_order), '[]'::jsonb)
       from project_milestones m where m.project_id = cp.id),
    (select coalesce(jsonb_agg(jsonb_build_object('message', u.message, 'created_at', u.created_at) order by u.created_at desc), '[]'::jsonb)
       from project_updates u where u.project_id = cp.id)
  from client_projects cp
  where cp.portal_token = p_token;
$$;

revoke all on function public.get_portal_project(uuid) from public;
grant execute on function public.get_portal_project(uuid) to anon, authenticated;


-- ═══════════════════════════════════════════════════════
--  PIPELINE — JOB APPLICATIONS
--  Private to each user. The live data source for job-tracker.html.
-- ═══════════════════════════════════════════════════════
create table if not exists job_applications (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  company      text not null,
  role         text not null,
  tier         text check (tier in ('T1','T2','T3')) default 'T2',
  status       text check (status in ('Research','Applied','Interview','Offer','Rejected')) default 'Research',
  priority     int  default 3,
  commute_min  int,
  contact      text,
  notes        text,
  track        text,
  applied_at   date,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index job_applications_user_id on job_applications(user_id);
create trigger job_applications_updated_at
  before update on job_applications
  for each row execute function set_updated_at();

create table if not exists job_queue_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  text       text not null,
  tag        text,
  done       boolean default false,
  done_at    timestamptz,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index job_queue_items_user_id on job_queue_items(user_id);

create table if not exists job_movement (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  text        text not null,
  date_label  text,
  created_at  timestamptz default now()
);
create index job_movement_user_id on job_movement(user_id);

-- all three are private — owner only
alter table job_applications  enable row level security;
alter table job_queue_items   enable row level security;
alter table job_movement      enable row level security;

create policy "job_applications: owner only"
  on job_applications for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "job_queue_items: owner only"
  on job_queue_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "job_movement: owner only"
  on job_movement for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════
--  BOARD ITEMS
--  board.html (one file, two visual templates: ?template=bulletin|archive)
--  and its sub-editor card-designer.html.
--
--  2026-09-07 (Phase 3 of the "structural rebuild" plan): replaces the old
--  bulletin_board_cards/archive_stack_objects pair — two tables, keyed by a
--  plain-text muse_id, with RLS wide open ("using(true)/with check(true)",
--  confirmed live 2026-08-25 as a real vulnerability: the STUDIO_PASSWORD
--  prompt() gating the old UI never appeared in the RLS policy at all, so
--  the anon key could read/write/delete any card directly via the REST API).
--  Both old tables had 0 rows — dropped, nothing lost. `board_items` is one
--  table for both templates (a `template` discriminator column instead of
--  two schemas), a real `user_id` FK instead of a text slug, and owner-write
--  RLS like every other per-Muse table — editing now requires actually
--  being signed in as the board's owner, not knowing a shared password.
-- ═══════════════════════════════════════════════════════
create table if not exists public.board_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template text not null check (template in ('bulletin', 'archive')),
  type text not null,
  title text,
  body text,
  image_url text,
  link_url text,
  project_id text,
  color text,                             -- bulletin 'color' cards only
  x float not null default 200,
  y float not null default 200,
  width float,                            -- bulletin cards only
  height float,                           -- bulletin cards only
  rotation float default 0,
  z_index integer default 1,
  bg_color text default '#ffffff',
  text_color text default '#0A0A0A',      -- bulletin cards only
  font_size text default 'md',            -- bulletin cards only
  orientation text default 'landscape',   -- archive objects only — 'landscape' | 'portrait'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists board_items_user_id_idx  on public.board_items(user_id);
create index if not exists board_items_template_idx on public.board_items(template);

alter table public.board_items enable row level security;

create policy "board_items: owner write"
  on public.board_items for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "board_items: public read"
  on public.board_items for select
  using (true);

-- storage bucket for board item images, uploaded via card-designer.html.
-- Path convention is <uploader's auth.uid()>/<item id>/image.<ext> — the
-- storage.foldername() check below is the standard Supabase per-user-folder
-- RLS idiom, replacing the old bucket's "allow all demo write" policy.
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do nothing;

create policy "card-images: public read"
  on storage.objects for select
  using (bucket_id = 'card-images');

create policy "card-images: owner write"
  on storage.objects for all
  using      (bucket_id = 'card-images' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'card-images' and auth.uid()::text = (storage.foldername(name))[1]);


-- ═══════════════════════════════════════════════════════
--  SEED — Amelia's profile
--  Run this separately after auth.users has her account.
--  Replace 'YOUR_AUTH_UUID' with her actual auth.users id.
-- ═══════════════════════════════════════════════════════

/*
insert into profiles (id, handle, display_name, bio, quote, location, email_contact, website)
values (
  'YOUR_AUTH_UUID',
  'amelia-arabe',
  'Amelia Arabe',
  'Engineer · Founder · Painter · Cellist. Building platforms and things that matter.',
  'The best work happens at the intersection of disciplines.',
  'Los Angeles, CA',
  'missameliava@gmail.com',
  'https://libraryofmorenita.org'
);
*/
