// ── APP SHELL ──────────────────────────────────────────────────────────────
// One shared Supabase client + auth guard + escaping helper, used by every
// page in this app instead of each page hand-typing its own copy (2026-09-06
// cleanup — previously duplicated verbatim across 10 files, see the
// "Morenita Structure Audit" review).
//
// Classic script, NOT an ES module — everything below is attached to
// `window` deliberately, because the app relies on inline onclick="..."
// handlers throughout, and those only see global scope.
//
// Load order matters: include the Supabase CDN <script> tag first, then this
// file, e.g.
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.115.0/dist/umd/supabase.min.js"></script>
//   <script src="../shared/app-shell.js"></script>   (path depth varies — see README)

(function () {
  'use strict';

  const SB_URL  = 'https://kebmscbmfzpvcqrvvpul.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlYm1zY2JtZnpwdmNxcnZ2cHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5OTE0MDEsImV4cCI6MjEwNDU2NzQwMX0.eebSYqn0aadkRG0xLxmu7Lir1QaS3A7uc-fFVpPzxsg';

  window.sb = supabase.createClient(SB_URL, SB_ANON);

  // HTML-escape helper. Every DB-sourced string must pass through this
  // before it hits innerHTML — this app has no server-side sanitization, so
  // this is the only thing standing between a stray "<" in a title/bio/tag
  // and stored XSS once more than one person can write content.
  window.esc = function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Server-verified auth guard. Always sb.auth.getUser() (asks Supabase to
  // validate the session), never getSession() alone (only reads the locally
  // stored JWT without verifying it) — see portal.html's older pattern for
  // the weaker version this replaces. Redirects to loginPath if there's no
  // verified session; otherwise resolves with the user.
  window.requireAuth = async function requireAuth(loginPath) {
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) {
      window.location.href = loginPath;
      return null;
    }
    return user;
  };

  // Resolves a PUBLIC profile by handle — the multi-tenant lookup every
  // public page (portfolio, case-study, artwork, collection) should use
  // instead of a hardcoded email. Returns null if the handle doesn't exist
  // (caller should fail into an empty/"not found" state, never throw).
  window.getProfileByHandle = async function getProfileByHandle(handle) {
    if (!handle) return null;
    const { data } = await sb.from('profiles').select('*').eq('handle', handle).maybeSingle();
    return data || null;
  };

  // Reads the ?u= handle param every public page now accepts, falling back
  // to Amelia's handle so every existing link (none of which pass ?u=) keeps
  // resolving to exactly what it resolves to today.
  window.currentHandle = function currentHandle(fallback) {
    return new URLSearchParams(window.location.search).get('u') || fallback || 'amelia-arabe';
  };
})();
