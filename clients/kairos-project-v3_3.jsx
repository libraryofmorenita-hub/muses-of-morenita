import React, { useState, useEffect } from "react";

const C = {
  cream:"#F6F1E9", creamMid:"#EDE5D6", creamDeep:"#E0D5C2",
  ink:"#1C1710", inkSoft:"#3A3020", stone:"#8A7E6E", stoneMid:"#B8ADA0",
  sage:"#8AA870", green:"#5A9C38", orange:"#DF7830", red:"#C23A30",
  purple:"#8A589A", yellow:"#E0C030", night:"#16120E",
  moon:"#8A589A", sun:"#DF7830", eclipse:"#8A4840",
};

function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400&family=DM+Mono:wght@300;400&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);
}

/* ─── MVP Timeline: 3 months · May 2026 meeting ─────────────── */
/* Both sides 50% · Couple linking essential · TestFlight target */
/* Shop = affiliate only · No Shopify · Julia handles affiliate apps */

/* ── Phase + task data ───────────────────────────────────────── */
const PHASES = [
  { id:0, label:"Foundation & Setup",          clientLabel:"Foundation",    weeks:[1,1],   color:C.sage,    hours:40,
    tasks:[
      "Flutter project structure + flavor config (dev/prod)",
      "Supabase: project, schema, RLS skeleton, auth, storage",
      "RevenueCat: App Store Connect Free + Optimize SKUs",
      "Firebase: FCM project + push certificate",
      "Affiliate product table in Supabase (name, brand, url, phase_tags, image_url)",
      "Design token system: both color palettes, typography, spacing",
    ]},
  { id:1, label:"Auth & Onboarding",            clientLabel:"Onboarding",    weeks:[2,3],   color:C.orange,  hours:70,
    tasks:[
      "Sign in with Apple (mandatory for App Store)",
      "Email + password auth fallback",
      "Onboarding: side selection (Moon / Sun), goals, pronouns",
      "Cycle baseline setup (Moon) + health baseline setup (Sun)",
      "Couple link option at onboarding (code or skip)",
      "Subscription paywall — Free tier + Optimize",
      "Onboarding state machine: quit and resume at any screen",
    ]},
  { id:2, label:"Moon Side — 50%",              clientLabel:"Moon Side",     weeks:[4,6],   color:C.moon,    hours:90,
    tasks:[
      "Cycle calendar with phase color coding + predictions",
      "Daily log: period flow, symptoms, mood, energy, sleep",
      "Home dashboard: phase banner + day count + contextual tip",
      "Today's action cards (3 scrollable)",
      "Cycle phase calculation algorithm (period log → phase → predictions)",
      "Logging streak counter",
    ]},
  { id:3, label:"Sun Side — 50%",               clientLabel:"Sun Side",      weeks:[6,8],   color:C.sun,     hours:75,
    tasks:[
      "Single-screen Solar dashboard (everything visible, no scroll)",
      "Lifestyle log: sleep, stress, exercise, alcohol, supplements",
      "Basic sperm health entry (date, motility %, volume — manual)",
      "Solar lifestyle score calculation + gauge ring",
      "Daily Mission card — one directive per day",
      "Health behavior task checklist (supplement, no alcohol, exercise)",
    ]},
  { id:4, label:"Fertility Score — Simplified", clientLabel:"Fertility Score",weeks:[8,9],   color:C.green,   hours:50,
    tasks:[
      "Simplified 4-factor score algorithm — Moon side",
      "Simplified 4-factor score algorithm — Sun side",
      "Score ring UI: arc fills, color zones (red → amber → green → gold)",
      "Score status label: Needs Attention / Building / Good / Strong / Peak",
      "Plain-language score summary — one paragraph, no breakdown bars yet",
      "Eclipse combined score calculation (if coupled)",
    ]},
  { id:5, label:"Couple Linking",               clientLabel:"Eclipse Mode",  weeks:[9,10],  color:C.eclipse, hours:65,
    tasks:[
      "Partner code generation (6-digit, 48hr expiry) — Supabase Edge Function",
      "Enter code → validate → create couple record",
      "Confirmation screen + shared dashboard explainer",
      "Basic shared view: her phase + his score + fertile window countdown",
      "Privacy defaults (summaries only — no raw logs visible)",
      "Disconnect flow: archive milestones, individual data retained",
    ]},
  { id:6, label:"Affiliate Shop",               clientLabel:"Shop",          weeks:[11,11], color:C.orange,  hours:35,
    tasks:[
      "Phase-tagged product cards from Supabase catalog",
      "Click tracking: log user_id, phase, product_id, timestamp to Supabase",
      "Affiliate URL redirect → Thorne website or Amazon",
      "Phase-aware recommendation strip on home dashboard (3 products)",
      "Product detail: name, brand, phase tag, why-recommended copy",
    ]},
  { id:7, label:"Push Notifications — Basic",   clientLabel:"Notifications", weeks:[11,11], color:C.purple,  hours:20,
    tasks:[
      "Daily log reminder (user-set time)",
      "Cycle phase transition alert",
      "Fertile window opening alert (2 days before + day of)",
      "Eclipse: partner's fertile window alert (if linked)",
    ]},
  { id:8, label:"QA + TestFlight Beta",          clientLabel:"QA & Beta",     weeks:[12,12], color:C.sage,    hours:50,
    tasks:[
      "Device testing on iPhone SE, 14, 15 (physical devices)",
      "Score algorithm validation with known inputs",
      "Privacy model audit: confirm no raw logs visible cross-partner",
      "TestFlight build submitted, internal beta: 5–10 testers",
      "Critical bug fixes only — no new features this window",
      "App Store Connect listing started: description, keywords, screenshots",
    ]},
];

const MILESTONES = [
  { week:1,  label:"Stack confirmed",           color:C.sage    },
  { week:3,  label:"First user signs up",        color:C.orange  },
  { week:6,  label:"Moon side logging works",    color:C.moon    },
  { week:8,  label:"Sun side complete",          color:C.sun     },
  { week:9,  label:"Fertility Score live",       color:C.green   },
  { week:10, label:"First couple linked",        color:C.eclipse },
  { week:11, label:"Shop + affiliates live",     color:C.orange  },
  { week:12, label:"TestFlight Beta",            color:C.red, big:true },
];

/* No Shopify · No Claude API · No Sanity in MVP */
const MONTHLY_COSTS = [
  { service:"Supabase",        low:0, high:25, note:"DB, auth, affiliate click tracking, couple sync", color:C.green  },
  { service:"RevenueCat",      low:0, high:0,  note:"Free under $2,500 MRR · 1% after",               color:C.sun    },
  { service:"Firebase FCM",    low:0, high:0,  note:"Free under 1M push/month",                       color:C.yellow },
  { service:"Sentry",          low:0, high:0,  note:"Free under 5k errors/month",                     color:C.red    },
  { service:"PostHog",         low:0, high:0,  note:"Free under 1M events/month",                     color:C.green  },
  { service:"Cloudflare",      low:0, high:5,  note:"CDN · affiliate redirect tracking endpoint",     color:C.sage   },
  { service:"Apple Developer", low:8, high:8,  note:"$99/year annualized",                            color:C.stone  },
];

const DEFERRED = [
  { label:"Probability Engine",         when:"Month 4–5",  color:C.yellow  },
  { label:"Full Fertility Score UI",    when:"Month 4–5",  color:C.green   },
  { label:"Gamification — badges",      when:"Month 4–5",  color:C.orange  },
  { label:"Claude API notifications",   when:"Month 5–6",  color:C.purple  },
  { label:"The Library (Sanity CMS)",   when:"Month 5–6",  color:C.purple  },
  { label:"Ombre Aura visualization",   when:"Month 5–6",  color:C.moon    },
  { label:"LH Strip Photo AI",          when:"Month 6–7",  color:C.purple  },
  { label:"Grief & Loss full flows",    when:"Month 6–7",  color:C.sage    },
  { label:"LGBTQIA+ inclusive flows",   when:"Month 6–7",  color:C.moon    },
  { label:"Postpartum mode",            when:"Month 6–7",  color:C.red     },
  { label:"Med Spa bookings",           when:"Month 7–8",  color:C.sun     },
  { label:"Android launch",             when:"Month 10+",  color:C.green   },
];

const OPEN_DECISIONS = [
  { label:"App name confirmed",          detail:"Kairos is working title. bykairos.app + bykairos.ai available. Confirm before App Store listing.",   status:"pending",   color:C.orange },
  { label:"Thorne affiliate approved",   detail:"Julia applying. Approval typically 1–2 weeks. Must be live before Week 11 shop build.",              status:"pending",   color:C.green  },
  { label:"Amazon Associates approved",  detail:"Julia applying. Approval 1–3 days. Required for Amazon product links in affiliate shop.",            status:"pending",   color:C.green  },
  { label:"Beta test invite list",       detail:"5–10 testers needed for TestFlight by Week 12. Client to identify and share contact list.",          status:"pending",   color:C.sage   },
  { label:"Subscription pricing — MVP",  detail:"MVP ships Free + Optimize only. Eclipse tier launches post-MVP. Confirm Optimize price point.",      status:"pending",   color:C.moon   },
  { label:"Medical Advisory Board",      detail:"CMO confirmed. Need OBGYN + RE + Urologist + Perinatal therapist for content review in Phase 2.",   status:"pending",   color:C.red    },
  { label:"Meeting cadence",             detail:"Bi-weekly check-ins recommended. This dashboard serves as standing agenda.",                         status:"pending",   color:C.yellow },
  { label:"Shop = affiliate only at launch", detail:"Confirmed May 6. Thorne + Amazon affiliate links. No Shopify. No own brand products at MVP.",    status:"confirmed", color:C.green  },
  { label:"Both sides at 50% for MVP",   detail:"Confirmed May 6. Moon + Sun both ship at 50% feature depth. Full scope builds in background.",      status:"confirmed", color:C.green  },
  { label:"Couple linking in MVP",       detail:"Confirmed May 6. Eclipse mode essential for launch. Basic shared view ships Week 10.",              status:"confirmed", color:C.green  },
  { label:"Data research partnerships",  detail:"Not in MVP. Flag for Phase 3 legal review.",                                                        status:"confirmed", color:C.green  },
];

const totalTaskCount = PHASES.reduce((a, p) => a + p.tasks.length, 0);
function calcProgress(checked) {
  const done = Object.values(checked).filter(Boolean).length;
  return { done, total: totalTaskCount, pct: done / totalTaskCount };
}
function calcPhaseProgress(phase, checked) {
  const done = phase.tasks.filter((_, i) => checked[`${phase.id}-${i}`]).length;
  return { done, total: phase.tasks.length, pct: done / phase.tasks.length };
}
function getCurrentPhaseIdx(checked) {
  for (let i = 0; i < PHASES.length; i++) {
    if (calcPhaseProgress(PHASES[i], checked).pct < 1) return i;
  }
  return PHASES.length - 1;
}

/* ── Primitives ──────────────────────────────────────────────── */
function Lbl({ children, color = C.stone, mb = 14 }) {
  return <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color, marginBottom:mb }}>{children}</div>;
}
function Hd({ children, size = 36, style = {} }) {
  return <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:size, fontStyle:"italic", fontWeight:300, color:C.ink, lineHeight:1.15, ...style }}>{children}</div>;
}
function Bd({ children, style = {} }) {
  return <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.stone, lineHeight:1.85, ...style }}>{children}</p>;
}
function Mn({ children, size = 11, color = C.ink, style = {} }) {
  return <span style={{ fontFamily:"'DM Mono',monospace", fontSize:size, color, ...style }}>{children}</span>;
}
function Hr() {
  return <div style={{ height:1, background:C.creamDeep, margin:"56px 0" }} />;
}

/* ── Icons ───────────────────────────────────────────────────── */
function MoonIco({ s = 18, c = C.moon }) {
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M16 10A8 8 0 0 1 7 17a8 8 0 0 0 9-7z" fill={c} opacity={0.9} />
    </svg>
  );
}
function SunIco({ s = 18, c = C.sun }) {
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill={c} opacity={0.9} />
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={10+Math.cos(r)*6} y1={10+Math.sin(r)*6} x2={10+Math.cos(r)*8.5} y2={10+Math.sin(r)*8.5} stroke={c} strokeWidth="1.4" strokeLinecap="round" />;
      })}
    </svg>
  );
}
function EclipseIco({ s = 22 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="15" cy="12" r="8" fill={C.sun} opacity={0.3} />
      <circle cx="10" cy="12" r="8" fill={C.moon} opacity={0.7} />
    </svg>
  );
}

/* ── Phone Frame ─────────────────────────────────────────────── */
function Phone({ children, bg = "#F6F1E9" }) {
  return (
    <div style={{
      width: 280, height: 560, borderRadius: 38,
      background: bg,
      border: `10px solid ${C.ink}`,
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 32px 80px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.05)",
      flexShrink: 0,
    }}>
      {/* Status bar notch */}
      <div style={{ height: 28, background: bg, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8 }}>
        <div style={{ width: 72, height: 18, background: C.ink, borderRadius: "0 0 12px 12px" }} />
      </div>
      <div style={{ height: "calc(100% - 28px)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP DEMOS
══════════════════════════════════════════════════════════════ */

/* ── Moon Side Demo ──────────────────────────────────────────── */
function MoonDemo() {
  const phaseList = [
    { name:"New Moon · Menstrual",  days:"Days 1–5",   color:C.red,    desc:"Rest. Warmth. Iron-rich foods." },
    { name:"Waxing · Follicular",   days:"Days 6–13",  color:C.green,  desc:"Energy rises. Optimism builds." },
    { name:"Full Moon · Ovulation", days:"Days 14–16", color:C.yellow, desc:"Peak fertility. Feel radiant." },
    { name:"Waning · Luteal",       days:"Days 17–28", color:C.purple, desc:"Nesting. Sensitivity rises." },
  ];
  return (
    <div style={{ height:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      {/* Top bar */}
      <div style={{ padding:"10px 14px 8px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.creamDeep}` }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:C.ink }}>Lunar Aura</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:C.yellow, background:`${C.yellow}18`, padding:"2px 8px", borderRadius:2 }}>Day 14 · Peak</div>
      </div>

      {/* Full-width ombre color square — the whole aura */}
      <div style={{ width:"100%", height:216, position:"relative", flexShrink:0, overflow:"hidden", background:"#F7EEE3" }}>

        {/* ── Analogous warm palette — all in the rose-amber family ── */}
        {/* Colors that blend: rose→salmon, terracotta→amber, amber→mauve — no muddy intersections */}

        {/* Deep rose — upper left, New Moon / Menstrual */}
        <div style={{
          position:"absolute", top:-55, left:-55,
          width:240, height:240, borderRadius:"50%",
          background:"radial-gradient(circle, #B84060 0%, rgba(184,64,96,0.55) 38%, transparent 70%)",
          filter:"blur(38px)", opacity:0.62,
        }}/>

        {/* Warm terracotta — upper right, Waxing / Follicular */}
        <div style={{
          position:"absolute", top:-40, right:-40,
          width:220, height:220, borderRadius:"50%",
          background:"radial-gradient(circle, #C47250 0%, rgba(196,114,80,0.50) 38%, transparent 70%)",
          filter:"blur(36px)", opacity:0.58,
        }}/>

        {/* Honey amber — lower right, Full Moon / Ovulation — the dominant, brightest zone */}
        <div style={{
          position:"absolute", bottom:-40, right:-30,
          width:245, height:230, borderRadius:"50%",
          background:"radial-gradient(circle, #C89838 0%, rgba(200,152,56,0.62) 40%, transparent 70%)",
          filter:"blur(32px)", opacity:0.74,
        }}/>

        {/* Dusty plum — lower left, Waning / Luteal */}
        <div style={{
          position:"absolute", bottom:-50, left:-40,
          width:225, height:225, borderRadius:"50%",
          background:"radial-gradient(circle, #906080 0%, rgba(144,96,128,0.52) 38%, transparent 70%)",
          filter:"blur(36px)", opacity:0.60,
        }}/>

        {/* Blush salmon — center-top bridge, softens rose + terracotta */}
        <div style={{
          position:"absolute", top:10, left:"28%",
          width:160, height:150, borderRadius:"50%",
          background:"radial-gradient(circle, #DC9080 0%, rgba(220,144,128,0.42) 42%, transparent 70%)",
          filter:"blur(28px)", opacity:0.44,
        }}/>

        {/* Golden peach — center bridge, amber + plum */}
        <div style={{
          position:"absolute", bottom:"18%", left:"28%",
          width:140, height:130, borderRadius:"50%",
          background:"radial-gradient(circle, #C8885A 0%, rgba(200,136,90,0.40) 42%, transparent 70%)",
          filter:"blur(26px)", opacity:0.40,
        }}/>

        {/* Warm luminous core — candlelight glow at center */}
        <div style={{
          position:"absolute", top:"5%", left:"10%",
          width:"80%", height:"90%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,252,244,0.58) 0%, rgba(255,248,232,0.18) 52%, transparent 72%)",
          filter:"blur(18px)",
        }}/>

        {/* Top cream vignette */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:36,
          background:"linear-gradient(to bottom, rgba(247,238,227,0.80), transparent)",
        }}/>
        {/* Bottom cream vignette */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:32,
          background:"linear-gradient(to top, rgba(247,238,227,0.70), transparent)",
        }}/>

        {/* Corner labels — Cormorant italic, sits on each phase zone */}
        <div style={{ position:"absolute", top:9, left:11, fontFamily:"'Cormorant Garamond',serif", fontSize:8, fontStyle:"italic", color:"rgba(255,255,255,0.90)", letterSpacing:"0.04em" }}>New Moon</div>
        <div style={{ position:"absolute", top:9, right:11, fontFamily:"'Cormorant Garamond',serif", fontSize:8, fontStyle:"italic", color:"rgba(255,255,255,0.88)", letterSpacing:"0.04em" }}>Waxing</div>
        <div style={{ position:"absolute", bottom:9, left:11, fontFamily:"'Cormorant Garamond',serif", fontSize:8, fontStyle:"italic", color:"rgba(255,255,255,0.84)", letterSpacing:"0.04em" }}>Waning</div>
        <div style={{ position:"absolute", bottom:9, right:11, fontFamily:"'Cormorant Garamond',serif", fontSize:8, fontStyle:"italic", color:"rgba(255,255,255,0.96)", letterSpacing:"0.04em" }}>Full Moon ★</div>

        {/* Day 14 — warm glowing dot in the amber zone */}
        <div style={{ position:"absolute", bottom:"28%", right:"22%", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"rgba(50,30,10,0.80)", background:"rgba(255,250,238,0.75)", padding:"2px 6px", borderRadius:2, backdropFilter:"blur(6px)", letterSpacing:"0.07em" }}>Day 14</div>
          <div style={{
            width:13, height:13, borderRadius:"50%",
            background:"white",
            boxShadow:"0 0 0 3px rgba(255,255,255,0.30), 0 0 20px rgba(255,245,210,0.95), 0 0 8px rgba(200,152,56,0.5)",
          }}/>
        </div>

        {/* Health nodes — same warm family as the field */}
        {[
          { l:"42%", t:"34%", c:"rgba(200,152,56,0.88)",  s:5 },
          { l:"65%", t:"26%", c:"rgba(196,114,80,0.82)",  s:4 },
          { l:"25%", t:"50%", c:"rgba(184,64,96,0.78)",   s:4 },
          { l:"52%", t:"60%", c:"rgba(144,96,128,0.78)",  s:3 },
          { l:"36%", t:"46%", c:"rgba(220,144,128,0.75)", s:4 },
          { l:"70%", t:"50%", c:"rgba(200,136,90,0.72)",  s:3 },
        ].map((n, i) => (
          <div key={i} style={{
            position:"absolute", left:n.l, top:n.t,
            width:n.s*2, height:n.s*2, borderRadius:"50%",
            background:n.c, transform:"translate(-50%,-50%)",
            boxShadow:`0 0 ${n.s*3}px ${n.c}`,
          }}/>
        ))}
      </div>

      {/* Phase explanations below the square */}
      <div style={{ padding:"10px 14px", flex:1, overflow:"hidden" }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:C.stoneMid, marginBottom:9 }}>Your Cycle Phases</div>
        {phaseList.map(p => (
          <div key={p.name} style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:8 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:p.color, flexShrink:0, marginTop:3 }} />
            <div>
              <div style={{ display:"flex", gap:7, alignItems:"baseline", marginBottom:1 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.ink }}>{p.name}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.stoneMid }}>{p.days}</span>
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ height:38, background:C.creamMid, display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:`1px solid ${C.creamDeep}` }}>
        {["Home","Cycle","Together","Shop","Profile"].map((t,i) => (
          <div key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:i===0?C.moon:C.stoneMid, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Sun Side Demo ───────────────────────────────────────────── */
function SunDemo() {
  const metrics = [
    { label:"Sleep",          val:7.4, max:10,  unit:"hrs", trend:"+0.4h", c:C.green  },
    { label:"Stress Index",   val:2.8, max:10,  unit:"/10", trend:"↓ Low",  c:C.sage   },
    { label:"Sperm Motility", val:68,  max:100, unit:"%",   trend:"Stable", c:C.purple },
    { label:"Diet Quality",   val:80,  max:100, unit:"pts", trend:"+5 pts", c:C.orange },
  ];
  return (
    <div style={{ height:"100%", background:"#F7F7F5", display:"flex", flexDirection:"column" }}>

      {/* Score header — big number, Strava-style */}
      <div style={{ padding:"14px 14px 10px", background:"white", borderBottom:`3px solid ${C.orange}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#A0998C", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:3 }}>Solar Score · Today</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:46, color:"#1C1710", lineHeight:1 }}>74</div>
          </div>
          <div style={{ textAlign:"right", paddingTop:2 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.green, marginBottom:6 }}>▲ +4 pts</div>
            <div style={{ padding:"3px 8px", background:`${C.orange}15`, border:`1px solid ${C.orange}50` }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:C.orange, letterSpacing:"0.1em" }}>STRONG</span>
            </div>
          </div>
        </div>
        {/* Score bar */}
        <div style={{ height:3, background:"#EBEBE8", marginTop:10 }}>
          <div style={{ height:"100%", width:"74%", background:`linear-gradient(to right, ${C.orange}, ${C.yellow})` }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"#C0B8B0" }}>0</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"#C0B8B0" }}>Week avg 71</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"#C0B8B0" }}>100</div>
        </div>
      </div>

      {/* Metric rows — clean separator style */}
      <div style={{ flex:1, background:"white", margin:"8px 0 0" }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{ padding:"10px 14px", borderBottom:i < metrics.length - 1 ? "1px solid #EBEBE8" : "none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:6 }}>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#A0998C", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:2 }}>{m.label}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:20, color:"#1C1710", lineHeight:1 }}>
                  {m.val}<span style={{ fontSize:9, color:"#A0998C" }}>{m.unit}</span>
                </div>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:m.c, textAlign:"right" }}>{m.trend}</div>
            </div>
            <div style={{ height:2, background:"#EBEBE8" }}>
              <div style={{ height:"100%", background:m.c, width:`${(m.val/m.max)*100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Today's directive */}
      <div style={{ padding:"8px 12px 10px", background:"#F7F7F5" }}>
        <div style={{ padding:"10px 12px", background:"white", borderLeft:`3px solid ${C.orange}`, borderRadius:"0 4px 4px 0" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.orange, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:5 }}>Today's Directive</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#3A3020", lineHeight:1.6 }}>No alcohol. CoQ10 taken. Lunar partner's window opens in 2 days.</div>
        </div>
      </div>

      {/* Bottom nav — clean, light */}
      <div style={{ height:38, background:"white", display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:"1px solid #EBEBE8" }}>
        {["Home","Data","Together","Shop","Profile"].map((t,i) => (
          <div key={t} style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:i===0?C.orange:"#C0B8B0", letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Eclipse Demo ────────────────────────────────────────────── */
function EclipseDemo() {
  return (
    <div style={{ height:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px", display:"flex", alignItems:"center", justifyContent:"center", gap:8, borderBottom:`1px solid ${C.creamDeep}` }}>
        <EclipseIco s={18} />
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:C.ink }}>Eclipse Mode</div>
      </div>
      {/* Scores */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:8, padding:"12px 10px 10px", alignItems:"center" }}>
        {/* Moon */}
        <div style={{ background:C.creamMid, border:`1px solid ${C.moon}30`, borderRadius:6, padding:"12px 10px" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.moon, letterSpacing:"0.1em", marginBottom:8 }}>MOON</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:28, color:C.moon, lineHeight:1 }}>82</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, color:C.stone, marginTop:5 }}>Day 14 · Ovulation</div>
          <div style={{ height:1, background:C.creamDeep, margin:"8px 0" }} />
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, fontStyle:"italic", color:C.stone }}>Fertile window open</div>
        </div>
        {/* Eclipse combined */}
        <div style={{ textAlign:"center" }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:C.creamMid, border:`1px solid ${C.eclipse}30`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto 4px" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:C.eclipse }}>78</div>
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.stoneMid, letterSpacing:"0.08em" }}>Eclipse</div>
        </div>
        {/* Sun */}
        <div style={{ background:C.night, border:`1px solid ${C.sun}20`, borderRadius:6, padding:"12px 10px" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.sun, letterSpacing:"0.1em", marginBottom:8 }}>SUN</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:28, color:C.sun, lineHeight:1 }}>74</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"rgba(255,255,255,0.3)", marginTop:5 }}>Lifestyle · Strong</div>
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"8px 0" }} />
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"rgba(255,255,255,0.3)" }}>Streak: 7 days</div>
        </div>
      </div>
      {/* Fertile window countdown */}
      <div style={{ padding:"8px 10px" }}>
        <div style={{ padding:"10px 12px", background:`${C.eclipse}08`, border:`1px solid ${C.eclipse}25`, borderRadius:6 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.eclipse, letterSpacing:"0.1em", marginBottom:4 }}>Fertile Window</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontStyle:"italic", color:C.ink }}>Open now · Day 14</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.eclipse }}>Peak</div>
          </div>
        </div>
      </div>
      {/* Shared milestones */}
      <div style={{ padding:"0 10px", flex:1 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:C.stoneMid, marginBottom:8 }}>Shared Milestones</div>
        {[
          {label:"Accounts linked", done:true},
          {label:"First fertile window", done:true},
          {label:"30-day behavior streak", done:false},
          {label:"Eclipse Score 85+", done:false},
        ].map(({label,done})=>(
          <div key={label} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:done ? C.green : C.creamDeep, flexShrink:0 }} />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:done ? C.inkSoft : C.stoneMid }}>{label}</span>
          </div>
        ))}
      </div>
      {/* Alignment callout */}
      <div style={{ margin:"8px 10px 10px", padding:"10px 12px", background:C.creamMid, borderRadius:4, textAlign:"center" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:"italic", color:C.ink }}>"Everything is aligned. Tonight is a good night."</div>
      </div>
      {/* Nav */}
      <div style={{ height:38, background:C.creamDeep, display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:`1px solid ${C.creamDeep}` }}>
        {["Home","Cycle","Together","Shop","Profile"].map((t,i)=>(
          <div key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:i===2?C.eclipse:C.stoneMid, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Fertility Score Demo ─────────────────────────────────────── */
function ScoreDemo() {
  const r=50, circ=2*Math.PI*r;
  const contributors = [
    {label:"Cycle Regularity",      pct:88, c:C.moon   },
    {label:"Ovulation Confirmed",   pct:95, c:C.yellow },
    {label:"Nutrition + Supps",     pct:65, c:C.green  },
    {label:"Lifestyle Quality",     pct:78, c:C.orange },
    {label:"Partner Alignment",     pct:82, c:C.eclipse},
  ];
  return (
    <div style={{ height:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"10px 14px 6px", borderBottom:`1px solid ${C.creamDeep}` }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.ink }}>Fertility Score™</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>Tap any factor to see how to improve it</div>
      </div>
      {/* Big ring */}
      <div style={{ display:"flex", justifyContent:"center", padding:"16px 0 10px" }}>
        <div style={{ position:"relative", width:120, height:120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform:"rotate(-90deg)" }}>
            <defs><linearGradient id="fsg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.moon}/><stop offset="50%" stopColor={C.green}/><stop offset="100%" stopColor={C.yellow}/></linearGradient></defs>
            <circle cx="60" cy="60" r={r} fill="none" stroke={C.creamDeep} strokeWidth="7"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke="url(#fsg)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${0.82*circ} ${circ}`}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:32, color:C.ink, lineHeight:1 }}>82</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.green, letterSpacing:"0.1em", marginTop:2 }}>STRONG</div>
          </div>
        </div>
      </div>
      {/* Contributors */}
      <div style={{ padding:"0 14px", flex:1 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:C.stoneMid, marginBottom:10 }}>Score Breakdown</div>
        {contributors.map(({label, pct, c}) => (
          <div key={label} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.inkSoft }}>{label}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:c }}>{pct}%</span>
            </div>
            <div style={{ height:3, background:C.creamDeep, borderRadius:2 }}>
              <div style={{ height:"100%", borderRadius:2, background:c, width:`${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Tip */}
      <div style={{ padding:"8px 14px 10px" }}>
        <div style={{ padding:"8px 10px", background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:4 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.green, marginBottom:3 }}>How to improve</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.inkSoft, lineHeight:1.5 }}>Logging your prenatal daily could add up to 12 pts over 30 days.</div>
        </div>
      </div>
      {/* Nav */}
      <div style={{ height:38, background:C.creamDeep, display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:`1px solid ${C.creamDeep}` }}>
        {["Home","Cycle","Together","Shop","Profile"].map((t,i)=>(
          <div key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:i===0?C.green:C.stoneMid, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Shop Demo ───────────────────────────────────────────────── */
function ShopDemo() {
  return (
    <div style={{ height:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${C.creamDeep}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.ink }}>For You Now</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:C.yellow }}>Day 14 · Peak</div>
      </div>
      {/* AI strip */}
      <div style={{ padding:"8px 10px", background:`${C.yellow}10`, borderBottom:`1px solid ${C.creamDeep}` }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.yellow, marginBottom:2 }}>AI Picks · Ovulation Phase</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>Based on today's phase and your logged data</div>
      </div>
      {/* Product card */}
      <div style={{ padding:"10px", flex:1 }}>
        {/* Image placeholder */}
        <div style={{ height:120, background:C.creamDeep, borderRadius:8, marginBottom:10, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity:0.3 }}>
            <rect x="5" y="5" width="30" height="30" rx="4" stroke={C.stone} strokeWidth="1.5"/>
            <line x1="5" y1="5" x2="35" y2="35" stroke={C.stone} strokeWidth="1"/>
            <line x1="35" y1="5" x2="5" y2="35" stroke={C.stone} strokeWidth="1"/>
          </svg>
          <div style={{ position:"absolute", top:8, left:8, padding:"3px 8px", background:C.yellow, borderRadius:2 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.ink }}>Ovulation</span>
          </div>
        </div>
        {/* Product info */}
        <div style={{ marginBottom:6 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, color:C.stone, marginBottom:3 }}>Thorne Research</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.ink, marginBottom:4 }}>CoQ10 200mg</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:C.ink }}>$34.00</div>
        </div>
        {/* AI reason */}
        <div style={{ padding:"8px 10px", background:C.creamMid, borderRadius:4, marginBottom:10 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.green, marginBottom:3 }}>Why Kairos recommends this</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone, lineHeight:1.55 }}>TTC mode active. CoQ10 supports egg quality and cellular energy — particularly beneficial during the ovulation window.</div>
        </div>
        {/* Actions */}
        <div style={{ display:"flex", gap:6 }}>
          <div style={{ flex:1, padding:"9px", background:C.ink, borderRadius:4, textAlign:"center" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.cream }}>Add to Cart</span>
          </div>
          <div style={{ padding:"9px 12px", background:C.creamMid, borderRadius:4 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>Save</span>
          </div>
        </div>
      </div>
      {/* Nav */}
      <div style={{ height:38, background:C.creamDeep, display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:`1px solid ${C.creamDeep}` }}>
        {["Home","Cycle","Together","Shop","Profile"].map((t,i)=>(
          <div key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:i===3?C.orange:C.stoneMid, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ── Library Demo ────────────────────────────────────────────── */
function LibraryDemo() {
  return (
    <div style={{ height:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${C.creamDeep}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.ink }}>For You Now</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:C.moon }}>Day 14 · Ovulation</div>
      </div>
      {/* Article */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {/* Article hero image */}
        <div style={{ height:100, background:C.creamDeep, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ opacity:0.25 }}>
            <rect x="3" y="3" width="30" height="30" rx="3" stroke={C.stone} strokeWidth="1.5"/>
            <line x1="3" y1="3" x2="33" y2="33" stroke={C.stone} strokeWidth="1"/>
            <line x1="33" y1="3" x2="3" y2="33" stroke={C.stone} strokeWidth="1"/>
          </svg>
          <div style={{ position:"absolute", top:8, left:10, display:"flex", gap:5 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.moon, background:`${C.moon}15`, border:`1px solid ${C.moon}40`, padding:"2px 7px" }}>Ovulation</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:C.stone, background:`${C.stone}15`, border:`1px solid ${C.stone}40`, padding:"2px 7px" }}>Expert</span>
          </div>
        </div>
        <div style={{ padding:"12px 14px", flex:1, overflow:"hidden" }}>
          {/* Title */}
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontStyle:"italic", fontWeight:400, color:C.ink, lineHeight:1.35, marginBottom:10 }}>
            Reading your body's fertile window with confidence
          </div>
          {/* Byline */}
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${C.creamDeep}` }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>Dr. [Name], OBGYN</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.stoneMid }}>6 min read</span>
          </div>
          {/* Content excerpt */}
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.stone, lineHeight:1.72 }}>
            The fertile window spans approximately six days — the five days before ovulation and the day of ovulation itself. Understanding the signals your body sends during this time is one of the most powerful tools in fertility awareness.
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.stoneMid, lineHeight:1.72, marginTop:8 }}>
            Cervical mucus, basal body temperature, and LH surges each tell part of the story. Used together, they form a picture no single test can provide alone...
          </div>
          {/* Read more */}
          <div style={{ marginTop:12, display:"flex", gap:8 }}>
            <div style={{ flex:1, padding:"8px", background:C.ink, borderRadius:4, textAlign:"center" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.cream }}>Read Full Article</span>
            </div>
            <div style={{ padding:"8px 10px", background:C.creamMid, borderRadius:4 }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:C.stone }}>Save</span>
            </div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <div style={{ height:38, background:C.creamDeep, display:"flex", alignItems:"center", justifyContent:"space-around", borderTop:`1px solid ${C.creamDeep}` }}>
        {["Home","Cycle","Together","Shop","Profile"].map((t,i)=>(
          <div key={t} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:7, color:i===4?C.purple:C.stoneMid, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    id:"moon", label:"Moon Side", icon:<MoonIco s={14} c={C.moon}/>, color:C.moon,
    tagline:"Warm. Cyclical. Emotionally Intelligent.",
    description:"The Moon Side adapts to every phase of the 28-day cycle — soft visuals, phase-reactive colors, and an emotional intelligence layer that meets the user where they are.",
    items:["Cycle calendar with phase color coding","Lunar Aura health visualization","Phase-aware dashboard (no scroll)","TTC optimization + TWW support","Hormonal health & postpartum mode","Grief & loss emotional support flow"],
    demo:<MoonDemo/>, phoneBg:C.cream,
  },
  {
    id:"sun", label:"Sun Side", icon:<SunIco s={14} c={C.sun}/>, color:C.sun,
    tagline:"Precise. Angular. Performance-Driven.",
    description:"The Sun Side is built for the user who wants data, not decoration. Everything fits on one screen — score, metrics, directive, and partner sync.",
    items:["Single-screen Solar dashboard (no scroll)","Sperm health logging + parameter trends","Lifestyle score: sleep, stress, diet, exercise","Daily Mission card — one clear directive","Behavior + partner support task system","Data-forward correlation insights"],
    demo:<SunDemo/>, phoneBg:"#F7F7F5",
  },
  {
    id:"eclipse", label:"Eclipse Mode", icon:<EclipseIco s={16}/>, color:C.eclipse,
    tagline:"When the moon and sun align.",
    description:"Eclipse Mode is the shared space — a summary layer that lets both partners stay connected without exposing raw data. Link with a code. Disconnect at any time.",
    items:["Account linking via 6-digit code or deep link","Combined Eclipse Score with Alignment Bonus","Shared milestone journal and feed","Fertile window alignment countdown","Live partner sync via Supabase Realtime","Eclipse Grief Support mode"],
    demo:<EclipseDemo/>, phoneBg:C.cream,
  },
  {
    id:"score", label:"Fertility Score", icon:null, color:C.green,
    tagline:"Like a credit score for your reproductive health.",
    description:"Both partners have their own score (0–100) built from 7 weighted factors. Tap the ring for a plain-language breakdown of what's working and what to do next.",
    items:["7-factor weighted algorithm per side","Score ring: 0–100 with color zones","Plain-language contributor breakdown","'How to improve' action cards per factor","Combined Eclipse Score with Alignment Bonus","Score history + nightly trend calculation"],
    demo:<ScoreDemo/>, phoneBg:C.cream,
  },
  {
    id:"shop", label:"The Shop", icon:null, color:C.orange,
    tagline:"Products that know where you are in your cycle.",
    description:"AI recommendations keyed to your current phase, score, and logged symptoms. A knowledgeable friend, not a storefront. No paid placements — ever.",
    items:["Phase-aware AI recommendation strip","Score Booster products for weak factors","Eclipse Bundle Builder for couples","Affiliate products at launch","Vetted third-party brands in Phase 2","Med spa bookings in Phase 2"],
    demo:<ShopDemo/>, phoneBg:C.cream,
  },
  {
    id:"library", label:"The Library", icon:null, color:C.purple,
    tagline:"Knowledge that moves with your cycle.",
    description:"Expert-written guides and brand editorial, surfaced automatically based on the user's current phase, logged symptoms, and goals.",
    items:["Hybrid: brand editorial + expert contributors","Phase-aware article surfacing (live in app)","Moon + Sun content streams","Grief & loss editorial collection","Web-accessible SEO acquisition hub","Minimum 30 articles seeded at launch"],
    demo:<LibraryDemo/>, phoneBg:C.cream,
  },
];

function FeaturesSection() {
  const [active, setActive] = useState(0);
  const feat = FEATURES[active];

  return (
    <div>
      <Lbl color={C.orange}>Core Features</Lbl>
      <Hd style={{ marginBottom:8 }}>Six pillars. One platform.</Hd>
      <Bd style={{ marginBottom:28, maxWidth:560 }}>Select a feature to see an app preview. Each pillar interconnects — the Score feeds the Shop, the Library feeds the Score, Eclipse connects both sides.</Bd>

      {/* Toggle buttons */}
      <div style={{ display:"flex", gap:6, marginBottom:32, flexWrap:"wrap" }}>
        {FEATURES.map((f, i) => (
          <button key={f.id} onClick={() => setActive(i)}
            style={{
              all:"unset", cursor:"pointer",
              padding:"8px 16px",
              borderRadius:3,
              border:`1px solid ${active === i ? f.color : C.creamDeep}`,
              background:active === i ? `${f.color}14` : "transparent",
              display:"flex", alignItems:"center", gap:7,
              transition:"all 0.2s",
            }}
          >
            {f.icon && f.icon}
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.06em", color:active === i ? f.color : C.stone, transition:"color 0.2s" }}>
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {/* Demo + list */}
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:48, alignItems:"start" }}>
        {/* Phone demo */}
        <div style={{ opacity:1, transition:"opacity 0.3s ease" }}>
          <Phone bg={feat.phoneBg}>
            {feat.demo}
          </Phone>
        </div>

        {/* Feature list */}
        <div style={{ paddingTop:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            {feat.icon && feat.icon}
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontStyle:"italic", color:feat.color }}>{feat.label}</div>
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:"0.06em", color:feat.color, marginBottom:14, fontStyle:"italic" }}>
            {feat.tagline}
          </div>
          <Bd style={{ marginBottom:24 }}>{feat.description}</Bd>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {feat.items.map((it, i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:18, height:2, background:feat.color, flexShrink:0, marginTop:9, borderRadius:1 }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.inkSoft, lineHeight:1.65 }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:28, padding:"14px 16px", background:`${feat.color}08`, border:`1px solid ${feat.color}30`, borderRadius:4 }}>
            <Lbl color={feat.color} mb={0}>Phase</Lbl>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.inkSoft, marginTop:4 }}>
              {feat.id === "moon" ? "Weeks 8–15 · 200 hrs" :
               feat.id === "sun"  ? "Weeks 16–20 · 125 hrs" :
               feat.id === "eclipse" ? "Weeks 29–33 · 125 hrs" :
               feat.id === "score" ? "Weeks 21–25 · 125 hrs" :
               feat.id === "shop" ? "Weeks 40–43 · 100 hrs" :
               "Phase 2 · Weeks 64–67"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS DIAL
══════════════════════════════════════════════════════════════ */
function Dial({ pct, size = 200 }) {
  const r = (size/2) - 14, circ = 2*Math.PI*r, cx = size/2, cy = size/2;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
        <defs>
          <linearGradient id="dlg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={C.moon}/>
            <stop offset="50%"  stopColor={C.green}/>
            <stop offset="100%" stopColor={C.sun}/>
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.creamDeep} strokeWidth="8"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#dlg)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${pct*circ} ${circ-pct*circ}`}
          style={{ transition:"stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:42, color:C.ink, lineHeight:1 }}>
          {Math.round(pct*100)}<span style={{ fontSize:18, color:C.stone }}>%</span>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:8, letterSpacing:"0.16em", textTransform:"uppercase", color:C.stoneMid, marginTop:5 }}>Complete</div>
      </div>
    </div>
  );
}

/* ── Checkbox ────────────────────────────────────────────────── */
function CBox({ checked, color, label, onChange }) {
  return (
    <div onClick={onChange} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"7px 0", cursor:"pointer" }}>
      <div style={{ width:15, height:15, flexShrink:0, marginTop:1, border:`1.5px solid ${checked ? color : C.creamDeep}`, borderRadius:2, background:checked ? color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <polyline points="1,4 3.5,6.5 8,1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:checked ? C.stoneMid : C.inkSoft, textDecoration:checked ? "line-through" : "none", lineHeight:1.6, transition:"all 0.2s" }}>
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLIENT VIEW
══════════════════════════════════════════════════════════════ */
function ClientView({ checked }) {
  const { done, total, pct } = calcProgress(checked);
  const curIdx = getCurrentPhaseIdx(checked);
  const curPhase = PHASES[curIdx];
  const approxWeek = Math.round(pct * 11) + 1;
  const completedMs = MILESTONES.filter(m => m.week <= approxWeek).length;
  const mLow = MONTHLY_COSTS.reduce((a,c)=>a+c.low,0);
  const mHigh = MONTHLY_COSTS.reduce((a,c)=>a+c.high,0);

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"0 40px 80px" }}>

      {/* HERO */}
      <div style={{ padding:"72px 0 64px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Ambient color fields */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"10%", left:"5%", width:200, height:200, borderRadius:"50%", background:C.purple, opacity:0.06, filter:"blur(60px)" }}/>
          <div style={{ position:"absolute", top:"15%", right:"6%", width:180, height:180, borderRadius:"50%", background:C.orange, opacity:0.07, filter:"blur(55px)" }}/>
          <div style={{ position:"absolute", bottom:"10%", left:"12%", width:160, height:160, borderRadius:"50%", background:C.sage, opacity:0.06, filter:"blur(50px)" }}/>
          <div style={{ position:"absolute", bottom:"15%", right:"10%", width:150, height:150, borderRadius:"50%", background:C.yellow, opacity:0.08, filter:"blur(50px)" }}/>
        </div>

        {/* Eclipse icon */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
          <EclipseIco s={40}/>
        </div>

        {/* Wordmark */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(72px, 14vw, 160px)", fontStyle:"italic", fontWeight:300, lineHeight:0.92, letterSpacing:"-0.02em", color:C.ink }}>
          Kairos
        </div>

        {/* Greek definition */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:C.stone, marginTop:16, letterSpacing:"0.04em" }}>
          καιρός — the opportune moment. the critical point of action.
        </div>

        {/* Moon / Sun concept line */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginTop:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <MoonIco s={16} c={C.moon}/>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:C.moon }}>Moon cycle</span>
          </div>
          <div style={{ width:1, height:16, background:C.creamDeep }}/>
          <Mn size={9} color={C.stoneMid}>∿ 28 days</Mn>
          <div style={{ width:1, height:16, background:C.creamDeep }}/>
          <Mn size={9} color={C.stoneMid}>24 hrs ∿</Mn>
          <div style={{ width:1, height:16, background:C.creamDeep }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontStyle:"italic", color:C.sun }}>Sun cycle</span>
            <SunIco s={16} c={C.sun}/>
          </div>
        </div>

        {/* Description */}
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.stone, maxWidth:500, margin:"16px auto 0", lineHeight:1.82 }}>
          A pregnancy optimization platform built around two celestial rhythms. Two complete experiences. One shared moment of alignment.
        </div>

        {/* Tags */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:28, flexWrap:"wrap" }}>
          {[
            ["Lunar Tracking", C.purple],["Solar Score", C.orange],["Fertility Score", C.green],
            ["Eclipse Mode", C.eclipse], ["AI Shop", C.yellow], ["The Library", C.sage],
          ].map(([l, c]) => (
            <span key={l} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:c, border:`1px solid ${c}`, padding:"5px 13px", borderRadius:2, background:`${c}14` }}>{l}</span>
          ))}
        </div>

        {/* Status badge */}
        <div style={{ display:"flex", justifyContent:"center", marginTop:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", background:C.creamMid, borderRadius:2 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse-dot 2s ease-in-out infinite" }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:C.green }}>Active Build</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.stoneMid }}>· iOS · Flutter · Phase 1</span>
          </div>
        </div>
      </div>

      <div style={{ height:1, background:C.creamDeep }}/>

      {/* PROGRESS */}
      <div style={{ padding:"52px 0 56px" }}>
        <Lbl color={C.green}>Overall Progress</Lbl>
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:52, alignItems:"center", marginBottom:36 }}>
          <Dial pct={pct} size={200}/>
          <div>
            <Hd size={32} style={{ marginBottom:16 }}>{done} of {total} tasks complete.</Hd>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
              {[
                {label:"Current Phase", val:curPhase.clientLabel,         color:curPhase.color},
                {label:"Milestones",    val:`${completedMs} / ${MILESTONES.length}`, color:C.green},
                {label:"MVP Target",    val:"Week 12 · ~3 months",        color:C.red},
              ].map(({label,val,color})=>(
                <div key={label} style={{ padding:14, background:C.creamMid, borderRadius:4, borderTop:`2px solid ${color}` }}>
                  <Lbl color={C.stoneMid} mb={7}>{label}</Lbl>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontStyle:"italic", color:C.ink }}>{val}</div>
                </div>
              ))}
            </div>
            {PHASES.map(p => {
              const {done:pd,total:pt,pct:pp} = calcPhaseProgress(p, checked);
              return (
                <div key={p.id} style={{ display:"grid", gridTemplateColumns:"130px 1fr 36px", alignItems:"center", gap:10, marginBottom:7 }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.stone }}>{p.clientLabel}</span>
                  <div style={{ height:2, background:C.creamDeep, borderRadius:1 }}>
                    <div style={{ height:"100%", borderRadius:1, background:p.color, width:`${pp*100}%`, transition:"width 0.6s ease" }}/>
                  </div>
                  <Mn size={9} color={pp===1?p.color:C.stoneMid}>{pd}/{pt}</Mn>
                </div>
              );
            })}
          </div>
        </div>
        <Lbl color={C.stone}>Checkpoints</Lbl>
        <div style={{ position:"relative", marginBottom:14 }}>
          <div style={{ height:2, background:C.creamDeep, borderRadius:1 }}/>
          <div style={{ position:"absolute", top:0, left:0, height:2, background:`linear-gradient(to right,${C.moon},${C.green},${C.sun})`, width:`${pct*100}%`, borderRadius:1, transition:"width 0.8s ease" }}/>
          {MILESTONES.map((m,i)=>(
            <div key={i} style={{ position:"absolute", top:-5, left:`${((m.week-1)/11)*100}%`, transform:"translateX(-50%)" }}>
              <div style={{ width:m.big?12:8, height:m.big?12:8, borderRadius:"50%", background:m.week<=approxWeek?m.color:C.creamDeep, border:`2px solid ${C.cream}` }}/>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {["Wk 1","Wk 3","Wk 6","Wk 9","Wk 12"].map(l=><Mn key={l} size={8} color={C.stoneMid}>{l}</Mn>)}
        </div>
      </div>

      <Hr/>

      {/* VISION */}
      <div>
        <Lbl color={C.moon}>What Is Kairos</Lbl>
        <Hd style={{ marginBottom:20 }}>Not a period tracker.<br/>A pregnancy optimization platform.</Hd>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }}>
          <div>
            <Bd>Most fertility apps are reactive — they tell you when you're ovulating and stop there. Kairos is proactive. It gives both partners a shared Fertility Score™ and a daily action plan to improve their combined odds — week over week.</Bd>
            <Bd style={{ marginTop:14 }}>Built around two celestial rhythms: the 28-day lunar cycle governing reproductive health, and the daily solar arc governing energy and lifestyle. When they align — that's the Kairos moment.</Bd>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              {icon:<MoonIco s={20} c={C.moon}/>, label:"Moon Cycle",  sub:"28-day lunar rhythm · Cycle tracking, hormonal health, ovulation", color:C.moon},
              {icon:<SunIco  s={20} c={C.sun}/>,  label:"Sun Cycle",   sub:"Daily solar arc · Lifestyle, sperm health, behavioral optimization", color:C.sun},
              {icon:<EclipseIco s={22}/>,           label:"Eclipse Mode",sub:"When both align · Couple dashboard, combined score, shared journey", color:C.eclipse},
            ].map(({icon,label,sub,color})=>(
              <div key={label} style={{ display:"flex", gap:14, padding:18, background:C.creamMid, borderRadius:6, borderLeft:`3px solid ${color}` }}>
                <div style={{ flexShrink:0, marginTop:2 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontStyle:"italic", color:C.ink, marginBottom:5 }}>{label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.stone, lineHeight:1.65 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Hr/>

      {/* FEATURES — 6 toggle demos */}
      <FeaturesSection/>

      <Hr/>

      {/* FERTILITY SCORE detail */}
      <div>
        <Lbl color={C.green}>The Centerpiece</Lbl>
        <Hd style={{ marginBottom:16 }}>The Fertility Score™</Hd>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
          <div>
            <Bd>Analogous to a credit score — legible, explainable, and actionable. Both partners have their own score (0–100) built from 7 weighted factors. The Eclipse Score combines them with an Alignment Bonus earned when both show up.</Bd>
            <Bd style={{ marginTop:14 }}>On tap, users see every contributing factor as a colored bar with a one-sentence plain-language explanation and a specific action to improve it. Score updates nightly as new data is logged.</Bd>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              {side:"Moon Side", color:C.moon, factors:["Cycle Regularity 20%","Ovulation Confirmed 20%","Nutrition + Supplements 15%","Lifestyle Quality 15%","Tracking Consistency 10%","Symptom Load 10%","Partner Alignment 10%"]},
              {side:"Sun Side",  color:C.sun,  factors:["Substance Avoidance 20%","Sleep Quality 15%","Supplement Adherence 15%","Exercise Balance 15%","Diet Quality 10%","Stress Management 10%","Partner Support 15%"]},
            ].map(({side,color,factors})=>(
              <div key={side} style={{ padding:"16px 18px", background:C.creamMid, borderRadius:6, borderTop:`2px solid ${color}` }}>
                <Lbl color={color}>{side}</Lbl>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {factors.map((f,i)=><span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.stone, background:C.cream, padding:"2px 7px", borderRadius:2 }}>{f}</span>)}
                </div>
              </div>
            ))}
            <div style={{ padding:"12px 18px", background:`${C.eclipse}10`, border:`1px solid ${C.eclipse}30`, borderRadius:6 }}>
              <Lbl color={C.eclipse}>Eclipse Combined</Lbl>
              <Mn size={10} color={C.inkSoft}>(Moon × 0.5) + (Sun × 0.5) + Alignment Bonus (up to +5 pts)</Mn>
            </div>
          </div>
        </div>
      </div>

      <Hr/>

      {/* MONETIZATION */}
      <div>
        <Lbl color={C.green}>Revenue Model</Lbl>
        <Hd style={{ marginBottom:8 }}>Freemium. Three tiers.</Hd>
        <Bd style={{ marginBottom:28, maxWidth:540 }}>Free to download for core tracking. Premium unlocks the full suite. Eclipse gives both partners full access plus couple-specific features.</Bd>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, background:C.creamDeep, borderRadius:6, overflow:"hidden", marginBottom:16 }}>
          {[
            {tier:"Free",     price:"$0",     period:"always", color:C.stone,   dark:false, items:["Cycle & ovulation tracking","Basic Fertility Score (number only)","3-month cycle history","Shop access + purchase","Couple linking (basic dashboard)"]},
            {tier:"Optimize", price:"$14.99", period:"/month", color:C.moon,    dark:true,  items:["Full Fertility Score breakdown","Pregnancy Probability Engine","Unlimited history + analytics","LH strip photo AI","Phase-aware Library content","AI recommendations","Gamification","PDF health report export"]},
            {tier:"Eclipse",  price:"$22.99", period:"/month", color:C.eclipse, dark:false, items:["Both partners get full Optimize","Combined Eclipse Score","Couple-specific gamification","Joint shop bundles","Intimacy window optimization","Couple AI recommendations"]},
          ].map(({tier,price,period,color,dark,items})=>(
            <div key={tier} style={{ background:dark?C.ink:C.cream, padding:"24px 20px" }}>
              <Lbl color={dark?"rgba(246,241,233,0.4)":C.stone}>{tier}</Lbl>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:28, color:dark?C.cream:color, lineHeight:1, marginBottom:16 }}>
                {price}<span style={{ fontSize:11, color:dark?"rgba(246,241,233,0.4)":C.stone }}>{period}</span>
              </div>
              {items.map((it,i)=>(
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:7 }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" style={{ flexShrink:0, marginTop:3 }}>
                    <polyline points="1,4.5 3.5,7 9,1" stroke={dark?"rgba(246,241,233,0.4)":color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:dark?"rgba(246,241,233,0.6)":C.inkSoft, lineHeight:1.6 }}>{it}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Hr/>

      {/* TECH + COSTS */}
      <div>
        <Lbl color={C.purple}>Technical Foundation</Lbl>
        <Hd style={{ marginBottom:8 }}>Stack & monthly obligations.</Hd>
        <Bd style={{ marginBottom:16, maxWidth:540 }}>MVP stack is deliberately lean — no Shopify, no Claude API, no Sanity. The affiliate shop is entirely Supabase-powered. Monthly cost drops to under $40.</Bd>
        <div style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap" }}>
          {[["No Shopify",C.green],["No Claude API",C.green],["No Sanity CMS",C.green]].map(([l,c])=>(
            <div key={l} style={{ padding:"5px 14px", background:`${c}10`, border:`1px solid ${c}40`, borderRadius:2 }}>
              <Mn size={9} color={c}>{l} in MVP · Phase 2</Mn>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:28 }}>
          {[
            {name:"Flutter + Dart",   role:"iOS App",      note:"iOS first. Android Phase 3 — same codebase, near-zero extra work.",           color:C.moon  },
            {name:"Supabase",         role:"Backend",      note:"DB + auth + affiliate click tracking + couple sync. Privacy at DB level.",     color:C.green },
            {name:"RevenueCat",       role:"Subscriptions",note:"Handles all Apple IAP. Free under $2,500 MRR. No custom subscription logic.",  color:C.sun   },
            {name:"Firebase FCM",     role:"Notifications",note:"Push notifications — cycle alerts, log reminders. Free at MVP volume.",        color:C.yellow},
            {name:"PostHog",          role:"Analytics",    note:"User behavior, funnel tracking. Free under 1M events/month.",                  color:C.sage  },
            {name:"Supabase Storage", role:"Affiliate DB",  note:"Product catalog, click log, phase tags. No external commerce platform.",      color:C.green },
          ].map(({name,role,note,color})=>(
            <div key={name} style={{ padding:16, background:C.creamMid, borderRadius:4, borderTop:`2px solid ${color}` }}>
              <Mn size={12} color={color} style={{ display:"block", marginBottom:4 }}>{name}</Mn>
              <Lbl color={C.stoneMid} mb={8}>{role}</Lbl>
              <Bd style={{ fontSize:11 }}>{note}</Bd>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:12 }}>
          <Lbl color={C.green} mb={0}>Monthly Infrastructure</Lbl>
          <div>
            <Mn size={9} color={C.stoneMid}>Launch range  </Mn>
            <Mn size={18} color={C.green}>${mLow}</Mn>
            <Mn size={10} color={C.stoneMid}> – </Mn>
            <Mn size={18} color={C.green}>${mHigh}</Mn>
            <Mn size={9} color={C.stoneMid}>/month</Mn>
          </div>
        </div>
        <div style={{ border:`1px solid ${C.creamDeep}`, borderRadius:6, overflow:"hidden", marginBottom:14 }}>
          {MONTHLY_COSTS.map((item,i)=>(
            <div key={item.service} style={{ display:"grid", gridTemplateColumns:"150px 1fr 54px 54px", alignItems:"center", gap:14, padding:"11px 18px", background:i%2===0?C.cream:C.creamMid, borderBottom:i<MONTHLY_COSTS.length-1?`1px solid ${C.creamDeep}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:item.color, flexShrink:0 }}/>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.inkSoft }}>{item.service}</span>
              </div>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:C.stoneMid }}>{item.note}</span>
              <Mn size={10} color={item.low===0&&item.high===0?C.green:C.stone} style={{ textAlign:"right" }}>{item.low===0&&item.high===0?"Free":`$${item.low}`}</Mn>
              <Mn size={10} color={item.color} style={{ textAlign:"right" }}>{item.high===0?"—":`$${item.high}`}</Mn>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"150px 1fr 54px 54px", alignItems:"center", gap:14, padding:"13px 18px", background:C.ink }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(246,241,233,0.35)" }}>Total / month</span>
            <div/>
            <Mn size={12} color={C.cream} style={{ textAlign:"right" }}>${mLow}</Mn>
            <Mn size={12} color={C.green} style={{ textAlign:"right" }}>${mHigh}</Mn>
          </div>
        </div>
        <div style={{ padding:"16px 18px", background:`${C.orange}0E`, border:`1px solid ${C.orange}35`, borderRadius:4 }}>
          <Lbl color={C.orange}>Apple Tax</Lbl>
          <Bd style={{ fontSize:12 }}>Apple takes 30% of in-app subscription revenue in Year 1 (15% after). Mitigation: direct users to subscribe via the Kairos website using Stripe — Apple cannot take a cut of web-originated subscriptions. Legal and widely practiced.</Bd>
        </div>
      </div>

      <Hr/>

      {/* DEFERRED TO PHASE 2 */}
      <div>
        <Lbl color={C.stone}>Building in the Background</Lbl>
        <Hd style={{ marginBottom:8 }}>Deferred. Not forgotten.</Hd>
        <Bd style={{ marginBottom:24, maxWidth:540 }}>
          These features are scoped and designed — they build in parallel while MVP is in testing. Each ships in the months immediately following TestFlight beta.
        </Bd>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {DEFERRED.map((d, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:C.creamMid, border:`1px solid ${d.color}30`, borderRadius:2 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.inkSoft }}>{d.label}</span>
              <Mn size={8} color={d.color} style={{ marginLeft:4 }}>{d.when}</Mn>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Lbl color={C.red}>Client Action Required</Lbl>
        <Hd style={{ marginBottom:8 }}>Open decisions.</Hd>
        <Bd style={{ marginBottom:28, maxWidth:540 }}>These items require your input before they affect the build. Confirmed items are noted. Pending items need a decision before the relevant phase begins.</Bd>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {OPEN_DECISIONS.map((d,i)=>(
            <div key={i} style={{ display:"grid", gridTemplateColumns:"20px 1fr auto", gap:14, alignItems:"start", padding:"16px 18px", background:d.status==="confirmed"?`${C.green}08`:C.creamMid, border:`1px solid ${d.status==="confirmed"?`${C.green}30`:C.creamDeep}`, borderRadius:4 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:d.status==="confirmed"?C.green:C.creamDeep, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1, flexShrink:0 }}>
                {d.status==="confirmed"&&(
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <polyline points="1,4 3.5,6.5 8,1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.ink, marginBottom:4 }}>{d.label}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.stone, lineHeight:1.6 }}>{d.detail}</div>
              </div>
              <div style={{ padding:"3px 10px", borderRadius:2, background:d.status==="confirmed"?`${C.green}18`:`${C.orange}14`, border:`1px solid ${d.status==="confirmed"?`${C.green}40`:`${C.orange}40`}`, flexShrink:0 }}>
                <Mn size={8} color={d.status==="confirmed"?C.green:C.orange}>{d.status==="confirmed"?"Confirmed":"Pending"}</Mn>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STUDIO VIEW
══════════════════════════════════════════════════════════════ */
function StudioView({ checked, onToggle }) {
  const [openPhase, setOpenPhase] = useState(null);
  const { done, total, pct } = calcProgress(checked);

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"48px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:40 }}>
        <div>
          <Lbl color={C.orange}>Studio · Amelia</Lbl>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontStyle:"italic", color:C.cream }}>Task Breakdown</div>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:28, color:C.green, lineHeight:1 }}>{done}</div>
            <Lbl color="rgba(246,241,233,0.4)" mb={0}>Done</Lbl>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:28, color:"rgba(246,241,233,0.3)", lineHeight:1 }}>{total-done}</div>
            <Lbl color="rgba(246,241,233,0.4)" mb={0}>Left</Lbl>
          </div>
        </div>
      </div>

      {/* Mini summary */}
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:24, padding:"20px 24px", background:"rgba(255,255,255,0.04)", borderRadius:6, border:"1px solid rgba(255,255,255,0.06)", marginBottom:32, alignItems:"center" }}>
        <div style={{ position:"relative", width:80, height:80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform:"rotate(-90deg)" }}>
            <defs>
              <linearGradient id="sdlg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.moon}/>
                <stop offset="100%" stopColor={C.sun}/>
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
            <circle cx="40" cy="40" r="30" fill="none" stroke="url(#sdlg)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${pct*2*Math.PI*30} ${2*Math.PI*30}`}
              style={{ transition:"stroke-dasharray 0.8s ease" }}
            />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <Mn size={18} color={C.cream}>{Math.round(pct*100)}</Mn>
            <Mn size={7} color="rgba(246,241,233,0.3)">%</Mn>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 20px" }}>
          {PHASES.map(phase => {
            const {done:pd,total:pt,pct:pp} = calcPhaseProgress(phase, checked);
            return (
              <div key={phase.id} style={{ display:"grid", gridTemplateColumns:"95px 1fr 26px", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, color:"rgba(246,241,233,0.45)" }}>{phase.clientLabel}</span>
                <div style={{ height:2, background:"rgba(255,255,255,0.06)" }}>
                  <div style={{ height:"100%", background:phase.color, width:`${pp*100}%`, transition:"width 0.6s ease" }}/>
                </div>
                <Mn size={8} color={phase.color}>{pd}/{pt}</Mn>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checklists */}
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {PHASES.map(phase => {
          const {done:pd,total:pt,pct:pp} = calcPhaseProgress(phase, checked);
          const isOpen = openPhase === phase.id;
          const isDone = pp === 1;
          return (
            <div key={phase.id}>
              <button onClick={() => setOpenPhase(isOpen?null:phase.id)}
                style={{ all:"unset", cursor:"pointer", width:"100%", display:"grid", gridTemplateColumns:"auto 1fr auto auto auto", alignItems:"center", gap:14, padding:"13px 16px", background:isOpen?"rgba(255,255,255,0.06)":"transparent", borderLeft:`3px solid ${isOpen?phase.color:isDone?`${phase.color}50`:"transparent"}`, borderRadius:4, transition:"all 0.25s" }}
              >
                <div style={{ width:8, height:8, borderRadius:"50%", background:isDone?phase.color:pp>0?`${phase.color}70`:"rgba(255,255,255,0.12)", flexShrink:0 }}/>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontStyle:"italic", color:isDone?"rgba(246,241,233,0.4)":"rgba(246,241,233,0.9)", textDecoration:isDone?"line-through":"none" }}>{phase.label}</div>
                <Mn size={9} color="rgba(246,241,233,0.25)">Wk {phase.weeks[0]}–{phase.weeks[1]}</Mn>
                <Mn size={10} color={phase.color} style={{ minWidth:32, textAlign:"right" }}>{pd}/{pt}</Mn>
                <div style={{ fontSize:16, color:"rgba(246,241,233,0.3)", transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.25s" }}>›</div>
              </button>
              <div style={{ maxHeight:isOpen?600:0, overflow:"hidden", transition:"max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
                <div style={{ padding:"8px 16px 16px 39px", borderLeft:`3px solid ${phase.color}35` }}>
                  {phase.tasks.map((task,ti) => {
                    const key = `${phase.id}-${ti}`;
                    return <CBox key={key} checked={!!checked[key]} color={phase.color} label={task} onChange={()=>onToggle(key)}/>;
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:16, border:`1px solid ${C.red}40`, borderRadius:4, marginTop:8 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:C.red, flexShrink:0 }}/>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:C.red }}>MVP Launch — Week 48</div>
          <Mn size={9} color={`${C.red}80`} style={{ marginLeft:"auto" }}>{Math.round(pct*100)}% to launch</Mn>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════ */
export default function KairosProjectPage() {
  useFonts();
  const [view, setView] = useState("client");
  const [checked, setChecked] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get("kairos-tasks");
        if (result && result.value) setChecked(JSON.parse(result.value));
      } catch (e) {}
      setLoaded(true);
    }
    load();
  }, []);

  async function toggleTask(key) {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    try {
      await window.storage.set("kairos-tasks", JSON.stringify(next));
      setLastSaved(new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }));
    } catch (e) {}
  }

  const { pct } = calcProgress(checked);
  const isClient = view === "client";

  if (!loaded) {
    return (
      <div style={{ background:C.cream, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Mn size={11} color={C.stoneMid}>Loading…</Mn>
      </div>
    );
  }

  return (
    <div style={{ background:isClient?C.cream:C.night, color:isClient?C.ink:C.cream, fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", transition:"background 0.4s ease" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:rgba(90,156,56,0.2);}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:${C.sage};}
        @keyframes pulse-dot{0%,100%{opacity:0.3}50%{opacity:1}}
      `}</style>

      {/* TOP BAR */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:isClient?"rgba(246,241,233,0.96)":"rgba(22,18,14,0.96)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${isClient?C.creamDeep:"rgba(255,255,255,0.06)"}`, padding:"0 40px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <EclipseIco s={22}/>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:isClient?C.ink:C.cream }}>Kairos</div>
          <div style={{ width:1, height:14, background:isClient?C.creamDeep:"rgba(255,255,255,0.1)" }}/>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:isClient?C.stone:"rgba(246,241,233,0.4)" }}>Project Overview</div>
        </div>
        <div style={{ display:"flex", background:isClient?C.creamDeep:"rgba(255,255,255,0.06)", borderRadius:4, padding:2 }}>
          {[{id:"client",label:"Client View"},{id:"studio",label:"Studio"}].map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{ all:"unset", cursor:"pointer", padding:"6px 20px", borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", background:view===v.id?(isClient?C.ink:"rgba(255,255,255,0.12)"):"transparent", color:view===v.id?C.cream:(isClient?C.stone:"rgba(246,241,233,0.4)"), transition:"all 0.2s" }}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:56, height:3, background:isClient?C.creamDeep:"rgba(255,255,255,0.08)", borderRadius:2 }}>
              <div style={{ height:"100%", borderRadius:2, background:`linear-gradient(to right,${C.moon},${C.green})`, width:`${pct*100}%`, transition:"width 0.6s" }}/>
            </div>
            <Mn size={10} color={C.green}>{Math.round(pct*100)}%</Mn>
          </div>
          {lastSaved && view==="studio" && <Mn size={8} color="rgba(246,241,233,0.2)">Saved {lastSaved}</Mn>}
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.orange }}>Morenita Design</div>
        </div>
      </div>

      {isClient ? <ClientView checked={checked}/> : <StudioView checked={checked} onToggle={toggleTask}/>}

      <div style={{ borderTop:`1px solid ${isClient?C.creamDeep:"rgba(255,255,255,0.06)"}`, padding:"16px 40px", display:"flex", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:12, fontStyle:"italic", color:isClient?C.stoneMid:"rgba(246,241,233,0.2)" }}>Kairos · In Development · 2025</div>
        <Mn size={8} color={isClient?C.stoneMid:"rgba(246,241,233,0.15)"}>Client · Julia Yan · Morenita Design</Mn>
      </div>
    </div>
  );
}
