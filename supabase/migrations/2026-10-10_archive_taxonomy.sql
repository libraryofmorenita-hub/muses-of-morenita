-- Archive: dynamic taxonomy for the Morenita Technology site (applied to project kebmscbmfzpvcqrvvpul on 2026-10-10)
-- Applied in pieces via the SQL runner; recorded here as the single source of truth.

-- 1. Extend archive_products (additive; legacy "type" column kept for the hidden Muses portal)
alter table public.archive_products
  add column if not exists slug text,
  add column if not exists kind text not null default 'product'
    check (kind in ('story','invention','product','issue','collection')),
  add column if not exists format text check (format in ('digital','physical','open-source')),
  add column if not exists summary text,
  add column if not exists constellations text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists series text,
  add column if not exists series_order integer,
  add column if not exists image_alt text,
  add column if not exists published_at timestamptz,
  add column if not exists internal_url text;
create unique index if not exists archive_products_slug_key on public.archive_products (slug) where slug is not null;
create index if not exists archive_products_constellations_gin on public.archive_products using gin (constellations);
create index if not exists archive_products_tags_gin on public.archive_products using gin (tags);
create index if not exists archive_products_kind_idx on public.archive_products (kind);

-- 2. Taxonomy (public read, no public write)
create table if not exists public.archive_constellations (
  slug text primary key, label text not null, blurb text, color text, sort_order integer not null default 0);
create table if not exists public.archive_tags (
  slug text primary key, label text not null,
  constellation_slug text not null references public.archive_constellations(slug) on delete restrict,
  sort_order integer not null default 0);
create index if not exists archive_tags_constellation_idx on public.archive_tags (constellation_slug);
alter table public.archive_constellations enable row level security;
alter table public.archive_tags enable row level security;
create policy "archive_constellations: public read" on public.archive_constellations for select using (true);
create policy "archive_tags: public read" on public.archive_tags for select using (true);
-- Seed: 7 constellations (energy, materials, body, craft, mind, story, commons) and 44 tags.
-- Rule: an item's constellations must include the constellation of every tag it carries.

-- 3. Publisher guard: only listed publishers' published items are public
create table if not exists public.archive_publishers (
  user_id uuid primary key references public.profiles(id) on delete cascade);
alter table public.archive_publishers enable row level security;
create policy "archive_publishers: public read" on public.archive_publishers for select using (true);
-- no write policies: managed by migration or service role only
insert into public.archive_publishers (user_id) values ('69f90861-8dc6-4d2e-add8-850efcd4f752') on conflict do nothing;
alter policy "archive_products: public read published" on public.archive_products
  using ((published = true and exists (select 1 from public.archive_publishers p where p.user_id = archive_products.user_id))
         or auth.uid() = user_id);
