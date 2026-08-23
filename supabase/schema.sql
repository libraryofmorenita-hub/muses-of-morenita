-- ═══════════════════════════════════════════════════════
--  Muses of Morenita — Database Schema
--  Run this in the Supabase SQL editor (project: agekvrkqrwepdoeetpbx)
--  Order matters — referenced tables must exist before dependents.
--
--  NOTE: this file was never actually deployed as a whole.
--  The live project already has its own `profiles` table
--  (columns: id, email, display_name, handle, bio, avatar_url,
--  location, role, scroll_count_this_week, scroll_reset_date,
--  created_at — no `username`) plus a differently-shaped
--  `job_applications` table and other unrelated live tables
--  (articles, client_portals, maxine_hardware, curriculum_tracks,
--  collections, contact_submissions, etc.) from other work.
--  Only `career_toggles` and `projects` (below) have actually
--  been created live, adapted to reference the real `profiles`
--  table by id and looked up by `email`, not `username`. Treat
--  the rest of this file as an unimplemented design doc until
--  reconciled with what's actually live.
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
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,          -- URL slug: libraryofmorenita.org/muses/username
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

-- username must be lowercase, alphanumeric + hyphens only
alter table profiles
  add constraint username_format
  check (username ~ '^[a-z0-9][a-z0-9\-]{1,38}[a-z0-9]$');

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
create table if not exists client_contacts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  name       text not null,
  email      text,
  company    text,
  phone      text,
  notes      text,
  created_at timestamptz default now()
);

create index client_contacts_user_id on client_contacts(user_id);


-- ═══════════════════════════════════════════════════════
--  STUDIO — CLIENT PROJECTS
--  One row per project engagement with a client.
--  portal_token is the UUID used in the shareable portal URL:
--    portal.html?token=<portal_token>
--  This lets a client access their portal without a Supabase account.
-- ═══════════════════════════════════════════════════════
create table if not exists client_projects (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references profiles(id) on delete cascade,
  client_id             uuid references client_contacts(id) on delete set null,
  name                  text not null,
  status                text default 'Active',
  tagline               text,
  cover_url             text,
  accent_color          text default '#888888',
  -- contracts & invoices (HTML strings, rendered in portal.html)
  contract_html         text,
  contract_signed_at    timestamptz,
  contract_signed_name  text,
  show_contract         boolean default false,
  invoice_deposit_html  text,
  show_invoice_deposit  boolean default false,
  invoice_final_html    text,
  show_invoice_final    boolean default false,
  -- portal access token — generated once, never rotated without explicit action
  portal_token          text unique default gen_random_uuid()::text,
  created_at            timestamptz default now()
);

create index client_projects_user_id   on client_projects(user_id);
create index client_projects_client_id on client_projects(client_id);
create index client_projects_token     on client_projects(portal_token);


-- ═══════════════════════════════════════════════════════
--  STUDIO — PROJECT UPDATES
--  Creator writes update entries; client reads them in portal.html.
-- ═══════════════════════════════════════════════════════
create table if not exists project_updates (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references client_projects(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  message    text not null,
  date       text,              -- display date string, e.g. 'July 8, 2026'
  created_at timestamptz default now()
);

create index project_updates_project_id on project_updates(project_id);


-- ═══════════════════════════════════════════════════════
--  STUDIO — PROJECT MILESTONES
--  Ordered checklist of deliverables per project.
-- ═══════════════════════════════════════════════════════
create table if not exists project_milestones (
  id         uuid primary key default uuid_generate_v4(),
  project_id uuid not null references client_projects(id) on delete cascade,
  label      text not null,
  done       boolean default false,
  sort_order integer default 0
);

create index project_milestones_project_id on project_milestones(project_id);


-- ═══════════════════════════════════════════════════════
--  RLS — NEW TABLES
-- ═══════════════════════════════════════════════════════

alter table archive_products  enable row level security;
alter table client_contacts   enable row level security;
alter table client_projects   enable row level security;
alter table project_updates   enable row level security;
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

-- ── client_contacts ──────────────────────────────────────
create policy "client_contacts: owner only"
  on client_contacts for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── client_projects ──────────────────────────────────────
-- owner full access; portal token access handled in app code (anon select by token)
create policy "client_projects: owner write"
  on client_projects for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- portal.html reads project by token without auth — allow anon select
create policy "client_projects: token read"
  on client_projects for select
  using (true);

-- ── project_updates ──────────────────────────────────────
create policy "project_updates: owner write"
  on project_updates for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "project_updates: public read"
  on project_updates for select using (true);

-- ── project_milestones ───────────────────────────────────
-- milestones are writable by the project owner; readable by anyone (portal)
create policy "project_milestones: owner write"
  on project_milestones for all
  using  (
    auth.uid() = (
      select user_id from client_projects where id = project_id
    )
  )
  with check (
    auth.uid() = (
      select user_id from client_projects where id = project_id
    )
  );

create policy "project_milestones: public read"
  on project_milestones for select using (true);


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
--  BULLETIN BOARD + ARCHIVE STACK
--  Muse profile templates (bulletin-board.html, archive-stack.html,
--  card-designer.html). NOTE: these are keyed by a plain-text
--  muse_id, not a profiles(id) foreign key — they were built to
--  work against the live project's actual profiles table (see
--  supabase-live-state memory) without depending on its shape.
--  RLS is intentionally wide open (demo build) — tighten before
--  the platform launches to other users.
-- ═══════════════════════════════════════════════════════
create table if not exists public.bulletin_board_cards (
  id uuid primary key default gen_random_uuid(),
  muse_id text not null,
  type text not null,
  title text,
  body text,
  image_url text,
  link_url text,
  project_id text,
  color text,
  x float not null default 100,
  y float not null default 100,
  width float not null default 200,
  height float not null default 160,
  rotation float default 0,
  z_index integer default 1,
  bg_color text default '#ffffff',
  text_color text default '#0A0A0A',
  font_size text default 'md',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists bulletin_board_cards_muse_id on public.bulletin_board_cards(muse_id);

create table if not exists public.archive_stack_objects (
  id uuid primary key default gen_random_uuid(),
  muse_id text not null,
  type text not null,
  title text,
  body text,
  image_url text,
  link_url text,
  project_id text,
  x float not null default 200,
  y float not null default 200,
  rotation float default 0,
  z_index integer default 1,
  bg_color text default '#ffffff',
  orientation text default 'landscape',   -- 'landscape' | 'portrait' — flips the type's natural width/height
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists archive_stack_objects_muse_id on public.archive_stack_objects(muse_id);

alter table public.bulletin_board_cards enable row level security;
alter table public.archive_stack_objects enable row level security;

create policy "bulletin_board_cards: allow all demo"
  on public.bulletin_board_cards for all
  using (true) with check (true);

create policy "archive_stack_objects: allow all demo"
  on public.archive_stack_objects for all
  using (true) with check (true);

-- storage bucket for card/object images, uploaded via card-designer.html
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do nothing;

create policy "card-images: public read"
  on storage.objects for select
  using (bucket_id = 'card-images');

create policy "card-images: allow all demo write"
  on storage.objects for all
  using (bucket_id = 'card-images')
  with check (bucket_id = 'card-images');


-- ═══════════════════════════════════════════════════════
--  SEED — Amelia's profile
--  Run this separately after auth.users has her account.
--  Replace 'YOUR_AUTH_UUID' with her actual auth.users id.
-- ═══════════════════════════════════════════════════════

/*
insert into profiles (id, username, display_name, bio, quote, location, email_contact, website)
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
