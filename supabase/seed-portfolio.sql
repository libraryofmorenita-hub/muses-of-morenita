-- ═══════════════════════════════════════════════════════
--  Portfolio seed — Amelia Arabe's career toggles + projects
--  Run in Supabase SQL editor AFTER:
--    1. career_toggles and projects tables exist (see the
--       "add_career_toggles_and_projects" migration — the
--       live project's profiles table predates schema.sql
--       and has no `username` column, so lookups here use
--       email instead)
--    2. Amelia's profile row exists (email = 'missameliava@gmail.com')
--  Migrates the previously-hardcoded TOGGLE_DATA/PROJECTS
--  objects from app/amelia-arabe-portfolio.html into real rows.
-- ═══════════════════════════════════════════════════════

do $$
declare
  uid        uuid;
  v_engineer uuid;
  v_inventor uuid;
  v_painter  uuid;
  v_cellist  uuid;
  v_actress  uuid;
begin
  select id into uid from profiles where email = 'missameliava@gmail.com';
  if uid is null then
    raise exception 'Profile for missameliava@gmail.com not found — create the profile row first.';
  end if;

  -- ── Career toggles ─────────────────────────────────────
  insert into career_toggles (user_id, role_key, role_name, overview, hire_label, service_section, accordion_id, show_commission, sort_order)
  values (uid, 'engineer', 'Software Engineer',
    'Building platforms, tools, and systems at the intersection of engineering and culture. Full-stack, embedded, and everything between.',
    'Hire me to build', 'work', 'acc-software', false, 0)
  returning id into v_engineer;

  insert into career_toggles (user_id, role_key, role_name, overview, hire_label, service_section, accordion_id, show_commission, sort_order)
  values (uid, 'inventor', 'Inventor',
    'Hardware that solves real problems. Autonomous systems, biomedical devices, and open-source tools built from the ground up.',
    'Work with me', 'work', 'acc-hardware', false, 1)
  returning id into v_inventor;

  insert into career_toggles (user_id, role_key, role_name, overview, hire_label, service_section, accordion_id, show_commission, sort_order)
  values (uid, 'painter', 'Oil Painter',
    'Original works in oil. Commissions open. Each piece made to order.',
    'Commission a piece', 'work', 'acc-painting', true, 2)
  returning id into v_painter;

  insert into career_toggles (user_id, role_key, role_name, overview, hire_label, service_section, accordion_id, show_commission, sort_order)
  values (uid, 'cellist', 'Cellist',
    'Available for live performance. Intimate gatherings, cultural events, and brand experiences.',
    'Book a performance', 'presence', 'acc-cellist', false, 3)
  returning id into v_cellist;

  insert into career_toggles (user_id, role_key, role_name, overview, hire_label, service_section, accordion_id, show_commission, sort_order)
  values (uid, 'actress', 'Actress & Model',
    'Available for editorial, brand campaigns, film, and television.',
    'Book me', 'presence', 'acc-actress', false, 4)
  returning id into v_actress;

  -- ── Engineer projects ───────────────────────────────────
  insert into projects (user_id, toggle_id, title, category, description, url, badge, image_url, tags, sort_order)
  values
    (uid, v_engineer, 'Muses of Morenita Platform', 'Full-Stack · SaaS',
     'A platform for multi-hyphenate creatives to organize every version of their career. Built full-stack with React and Supabase. Includes portfolio profiles, publishing tools, a digital product archive, and business infrastructure for creative professionals.',
     'https://libraryofmorenita.org', null, null, array['React','Supabase','JavaScript'], 0),
    (uid, v_engineer, 'Kairos', 'Full-Stack · iOS',
     'A time-awareness app built in Flutter. Kairos helps users develop a more intentional relationship with how they spend their time. Revenue and subscription logic handled via RevenueCat. Currently in active development.',
     null, 'In Development', null, array['Flutter','Supabase','RevenueCat'], 1),
    (uid, v_engineer, 'Morenita Signals', 'ML · Data Pipeline',
     'An internal data pipeline and content intelligence system. Surfaces patterns across creative output, audience signals, and platform data using TF-IDF and FastAPI. Feeds strategy decisions across Morenita properties.',
     null, 'In Development', null, array['Python','FastAPI','TF-IDF'], 2),
    (uid, v_engineer, 'Ballmecca', 'iOS · Android',
     'A youth sports coaching platform connecting athletes with verified coaches through asynchronous video feedback. Addresses the gap created by 68% of youth coaches being unpaid volunteers. Built in React Native.',
     'https://ballmecca.vercel.app', null, null, array['React Native','Coaching'], 3),
    (uid, v_engineer, 'Oceánica Treatment Center', 'Web Design · Brand',
     'Full web build and brand system for a behavioral health treatment center. Designed and developed a TypeScript and React site with Supabase backend for intake forms and internal operations. Private client work.',
     null, 'Client', null, array['React','TypeScript','Supabase'], 4),
    (uid, v_engineer, 'YK Entertainment', 'Web Design',
     'Website design and SEO buildout for an entertainment company. Delivered via Wix Studio with custom architecture and on-page SEO optimization. Private client work.',
     null, 'Client', null, array['Wix Studio','SEO'], 5);

  -- ── Inventor projects ───────────────────────────────────
  insert into projects (user_id, toggle_id, title, category, description, url, badge, image_url, tags, sort_order)
  values
    (uid, v_inventor, 'ARNOLD', 'Robotics · Embedded Systems',
     'An autonomous rover designed to detect and eliminate the Spotted Lanternfly, an invasive species devastating hardwood trees across the eastern United States. Field-validated at Loyola Maryland Arboretum. 2,200 trees protected.',
     'https://libraryofmorenita-hub.github.io/SLF-Terminator-Rover/', null, null, array['Raspberry Pi','CAD','Python'], 0),
    (uid, v_inventor, 'Neurosect', 'Biomedical Imaging · AI',
     'A speculative multimodal neural imaging system. Combines fMRI, EEG, MEG, and PPG signals in Bayesian consensus to surface latent cognitive patterns. Designed as a rigorous engineering response to precrime imaging concepts explored in science fiction.',
     'https://libraryofmorenita-hub.github.io/NeuroSect/', null, null, array['fMRI','EEG','Bayesian'], 1),
    (uid, v_inventor, 'MAXINE Recovery Device', 'Embedded Systems · Open Source',
     'An open-source recovery companion for hospital beds. Uses embedded ML on ARM hardware to monitor patient recovery metrics and surface early warning signals. Designed to reduce ICU readmission rates through continuous passive monitoring.',
     null, 'In Development', null, array['ARM','Embedded C++','ML'], 2);

  -- ── Painter projects ────────────────────────────────────
  insert into projects (user_id, toggle_id, title, category, description, url, badge, image_url, tags, sort_order)
  values
    (uid, v_painter, 'Garden Bouquet', 'Oil on Canvas',
     'A lush floral study in the warm palette of Southern California. This piece anchors an ongoing commission series exploring domestic botanical subjects.',
     null, 'Commission only', 'bouquet.jpeg', array[]::text[], 0),
    (uid, v_painter, 'Stained Glass Study', 'Oil on Canvas',
     'Light as subject. This work studies the way stained glass fragments and refracts natural light, rendered through oil paint layered to mimic transparency.',
     null, 'Commission only', 'stained%20glass.jpeg', array[]::text[], 1),
    (uid, v_painter, 'Celestial Study', 'Oil on Panel',
     'A nocturnal study of astronomical forms rendered in oil on panel. Intimate in scale. Part of a broader series exploring the night sky as emotional landscape.',
     null, 'Available', 'newsite%20images/stars.webp', array[]::text[], 2),
    (uid, v_painter, 'Untitled No. 3', 'Oil on Canvas',
     'Part of a personal series not currently available for sale. Included here as documentation of ongoing studio practice.',
     null, 'NFS', null, array[]::text[], 3),
    (uid, v_painter, 'Study in Terracotta', 'Oil on Panel',
     'A warm-toned study exploring the relationship between earth pigments and architectural form. Oil on panel, available for acquisition.',
     null, 'Available', null, array[]::text[], 4),
    (uid, v_painter, 'Floral Portrait', 'Oil on Canvas',
     'A large-format floral portrait built from direct observation. Each commission in this series is made to order with custom color palette and scale specifications.',
     null, 'Commission only', null, array[]::text[], 5);

  -- ── Cellist projects ────────────────────────────────────
  insert into projects (user_id, toggle_id, title, category, description, url, badge, image_url, tags, sort_order)
  values
    (uid, v_cellist, 'Live Performance', 'Acoustic · Live',
     'Available for live acoustic cello performance. Intimate gatherings, cultural events, private dinners, and brand experiences. Setlists range from classical repertoire to contemporary arrangements.',
     null, 'Available for Booking', null, array['Classical','Intimate','Events'], 0),
    (uid, v_cellist, 'String Compositions', 'Original Music',
     'Original compositions for solo cello currently in development. These pieces draw on classical training and contemporary influences to create works that function both as standalone art and as scores for visual media.',
     null, 'Coming Soon', null, array['Cello','Composition'], 1);

  -- ── Actress projects ────────────────────────────────────
  insert into projects (user_id, toggle_id, title, category, description, url, badge, image_url, tags, sort_order)
  values
    (uid, v_actress, 'Editorial Work', 'Modeling · Print',
     'Editorial and print modeling across fashion, lifestyle, and cultural publications. Portfolio available upon request. Represented for direct bookings.',
     null, 'Portfolio on Request', 'newsite%20images/muse.webp', array[]::text[], 0),
    (uid, v_actress, 'Brand Campaigns', 'Commercial · Brand',
     'Commercial and brand campaign work for consumer, lifestyle, and technology clients. Available for ambassador agreements and campaign cycles. Portfolio available upon request.',
     null, 'Portfolio on Request', null, array[]::text[], 1),
    (uid, v_actress, 'Film & Television', 'Acting',
     'Film and television acting. Available for auditions across drama, comedy, and commercial formats. Trained. Portfolio and reel available upon request.',
     null, 'Available for Auditions', null, array[]::text[], 2);

end $$;
