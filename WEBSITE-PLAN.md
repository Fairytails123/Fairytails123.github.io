# Rebuild www.thefairytails.co.uk — premium animated site, owned code, GitHub Pages

> **Master plan** (agreed 2026-06-11). This is the baseline. Each page gets its OWN in-depth
> pre-build interview to fine-tune its spec immediately before its build starts — see
> Build philosophy and the Page Status Tracker below. Companion file: `HANDOVER.md` (session
> status + next actions). Raw audit data: `docs/site-audit/`.

## Context

The Fairy Tails K9 Centre's site runs on the Duda builder (via IONOS) — no code ownership, subscription-dependent, and a full audit (17-agent sweep of all ~39 live URLs, 2026-06-11) found broken WhatsApp links on every page, placeholder `mailto:mymail@mailservice.com` buttons, an empty Google Maps link, a ~90%-placeholder gallery, stale "For 2024" copy, two pricing contradictions, and og:images on **signed CDN URLs expiring ~July 2026**. Rebuild as a static Astro site in a git repo the owner controls, hosted free on GitHub Pages, edited via Claude Code — with **premium, award-winning UX/UI using GSAP (and one Three.js showpiece)** as a hard requirement.

**Build philosophy (owner's explicit process):**
1. **Inside-out order** — Board & Train is built FIRST (it proves the design system); the homepage is built LAST, after every page it showcases is final.
2. **One page at a time** — a page is built, iterated, and signed off before the next begins.
3. **Per-page pre-build interview** — immediately before each page's build starts, the owner is re-interviewed in depth about every element of that page (sections, copy, CTAs, animation moments) to fine-tune this plan's spec. This plan is the baseline; the pre-build interview is the final word.
4. **Per-page build stages** — each page goes: (a) structure & real content → (b) art-direction/design pass (frontend-design skill) → (c) GSAP animation choreography → (d) polish: performance, accessibility, per-page SEO meta. Owner reviews on the live preview URL between passes.

## Interview decisions (locked, 2026-06-11)

| Topic | Decision |
|---|---|
| Hosting / scope / editing | GitHub Pages, custom domain `www.thefairytails.co.uk` (www canonical); main site only (grooming site untouched, linked); edited via Claude Code, no CMS; repo stays in this OneDrive folder (owner's choice) |
| Booking | Acuity untouched — all links byte-for-byte (owner `13914499`, appt types `51989230`/`56694430`, carts `1469464`/`1469467`, grooming `thefairytailsdoggrooming.as.me`) |
| Primary CTA (site-wide) | **Enquiry form** → n8n webhook → Telegram + email + log. Fields: name/email/phone/message + service dropdown (pre-filled per page) + dog name/breed/age + behavioural-concerns multi-select + preferred contact method & time |
| Design | Keep logo; evolve everything else. **Bold-but-performant animation**: GSAP + ScrollTrigger backbone, scroll-driven storytelling, micro-interactions; ONE Three.js/WebGL showpiece (homepage hero); reduced-motion fallbacks; Lighthouse ≥ 90 |
| Photos | Reuse current site images (harvested) + **ImgBB account owner will share**; always downloaded & self-hosted, never hotlinked |
| Content conflicts resolved | Intensive Dog Training = **£2,000** (homepage right, detail page stale); puppy classes include **three** intro sessions; everything else carries over as accurate |
| IA consolidation | `/training-stages`, `/admission-process`, `/boarding-information`, `/resources-collection` are absorbed (see page map) with meta-refresh stubs; DIY puppy course becomes ONE immersive hub at `/puppycourse` absorbing its 5 hidden subpages |
| New pages | `/training-plans` (comparison hub + "find your plan" interactive picker), `/membership-plans` ("apply" framing, savings counters) — promoted from homepage anchor sections; homepage keeps `#Trainingplans`/`#MembershipPlans` anchor summary sections so old links still land |
| Blog | Advice hub: categories (Puppies, Behaviour, Training Methods, Health & Care), related posts, per-post service CTA; 19 posts at identical root slugs |
| Contact | 2 prominent numbers (main + WhatsApp text line) + collapsible direct-lines directory; **Meet the team with names/roles (owner supplies)** |
| Analytics | Keep GTM `GTM-W93L9XK5` (Ads `AW-822632954` conversions) + Meta Pixel `612955530110673`; add new GA4; Consent Mode v2 banner (UK PECR) |
| Homepage hero | **Transformation story** — "we change dogs' lives" (anxious → calm), the site's Three.js/GSAP signature moment |
| Domain | Owner controls IONOS DNS; cutover is self-serve |

## Page map, build order & status tracker (inside-out)

Lifecycle per page: **pre-build interview → content → design → animation → polish → owner sign-off → next page.**

| # | Page | Pre-build interview | Built | Signed off |
|---|------|---------------------|-------|------------|
| 1 | `/dog-boarding-school` (Board & Train) — design-system proving ground | ☑ 2026-06-12 → **`docs/page-specs/01-dog-boarding-school.md`** | ◐ passes a–c live; hero video done + live (2026-06-18, owner's clips); polish (d) + 3 media slots pending | ☐ |
| 2 | `/intensive-dog-training` | ☑ 2026-06-29 → **`docs/page-specs/03-intensive-dog-training.md`** | ◐ content+design+motion live on preview (2026-06-30); week-by-week content skeleton + media interim; polish + sign-off pending | ☐ |
| 3 | `/dog-day-school` | ☑ 2026-06-29 → **`docs/page-specs/02-dog-day-school.md`** | ◐ content+design+motion live on preview (2026-06-29); polish + sign-off pending | ☐ |
| 4 | `/puppy-training-classes` | ☐ | ☐ | ☐ |
| 5 | `/training-plans` (new) | ☐ | ☐ | ☐ |
| 6 | `/membership-plans` (new) | ☐ | ☐ | ☐ |
| 7 | `/puppycourse` (immersive course hub) | ☐ | ☐ | ☐ |
| 8 | `/blog` + 19 posts | ☑ 2026-07-04 (compact — owner locked: light tidy-up copy, visible original dates, all-in-one rollout) | ◐ BUILT + LIVE 2026-07-04: advice hub w/ category filters + all 19 posts at legacy slugs with ORIGINAL 2020-2025 dates (content collection, BlogPosting JSON-LD, related posts, per-category CTA); owner review pending | ☐ |
| 9 | `/gallery` (built out of order at owner's request) | ☑ 2026-07-01 → **`docs/page-specs/09-gallery.md`** | ✅ BUILT + PUSHED + LIVE on preview (2026-07-01, commits b07f747 + d7443df); 50 photos (7 already-public + 19 ImgBB client + 10 Jotform training + 14 town/seafront scenes; all consent-confirmed; Halti/head-collar shots removed); owner sign-off + polish pending | ☐ |
| 10 | `/contact` | ☑ 2026-07-04 (owner-initiated: licence certificate + council-register verify link as trust centrepiece) | ◐ BUILT + LIVE 2026-07-04: call/WhatsApp cards, direct-lines accordion, licence certificate panel + register link, enquiry form, team photo (names/roles still owner-pending); owner review pending | ☐ |
| 11 | `/terms-and-conditions` | ☑ 2026-07-04 (owner request: restore missing legal page; legal copy verbatim from harvest) | ◐ BUILT + LIVE 2026-07-04: quality policy + full daycare agreement + grooming-terms link + training-stages block; footer link restored; owner review pending | ☐ |
| 12 | `/` **Homepage — LAST** | ☑ 2026-07-02 → **`docs/page-specs/12-homepage.md`** | ◐ content+design+motion+WebGL built + PUSHED + LIVE (2026-07-02, `57d9a99`, deploy verified 200); soul content + polish + sign-off pending | ☐ |

### Baseline spec per page

1. **`/dog-boarding-school` (Board & Train)** — Guided sales arc: problem → programme & why it works → proof (Archie-style case studies, testimonials, photo results) → week-by-week regime (absorbs `/training-stages` 3-stage method + parent-training Fridays) → pricing (£1,200 puppy 4wk / £2,500 adult 8–10wk / +£300 large) → honest limitations & eligibility → 4-step booking. 22-item checklist + open-visit policy + body-cam daily-reports promise in accordions. CTA: enquiry form. **Built with it: form component + n8n "Website Enquiry" workflow (live-tested), header/footer, design tokens, GSAP foundation.**
2. **`/intensive-dog-training`** — *Final spec: `docs/page-specs/03-intensive-dog-training.md` (interview 2026-06-29; the **day-only sibling of Board & Train** — same TAR programme minus overnight boarding, dog home every night + full day school by day).* TAR method, CER science section (**preserve `#ConditionedEmotionalResponse` anchor**; absorbs duplicate CER copy from resources-collection), 4-step process, **£2,000**/2mo (+£300 large, full day school incl.) and £1,200/1mo puppy intensive, client gallery. CTA: enquiry form.
3. **`/dog-day-school`** — *Final spec: `docs/page-specs/02-dog-day-school.md` (interview 2026-06-29).* Day-in-the-life scroll timeline (signature; updated timetable, open 8am–5:30pm), enrichment philosophy, **pricing cards + interactive estimator** (full/half × dog size × days/week → daily+monthly cost incl. weekly discount), CBS £15 flat section, proof (report samples + testimonials + photo rail + promo clip), admission section (absorbs `/admission-process`: assessment = 3 taster sessions £12.50 each 1hr/2hr/3hr, warm-framed criteria incl. DHP/Lepto/Kennel-Cough + females-in-season excluded, getting-ready checklist unchanged), membership teaser→`/membership-plans`. **Acceptance-gated** CTA: enquiry form (assessment) + regulars' Acuity day-booking link. **PM half-day removed; "teaching basic commands" dropped; overnight boarding moved OUT to Board & Train** (so `/boarding-information`→`/dog-boarding-school`, not here).
4. **`/puppy-training-classes`** — £175: 4 Thursday-evening sessions at Concordia Hall St Leonards + **three** day-school intro sessions; fix stale "For 2024"; benefits + curriculum; Acuity cart link `id=1469464` preserved alongside enquiry CTA; cross-sell DIY course.
5. **`/training-plans` (new)** — Comparison hub for all 8 offerings + **"find your plan" interactive picker** (age/issue/goal → recommended plan); animated plan cards link to detail pages; free phone consult (Acuity `56694430`) as universal fallback.
6. **`/membership-plans` (new)** — 4 tiers (Half £275/mo, Full T1 £375/mo, Full T2 £750 bi-monthly, Grooming sub £25/mo); savings-vs-pay-per-day animated counters; CTA: "Apply for membership" enquiry variant.
7. **`/puppycourse`** — ONE immersive free course hub: GSAP scroll chapters for Weeks 1–4 (Skills & Exposure / Build Confidence / Socialisation / Fine Tuning), daily schedule, toilet-training section (interactive schedule tool), methods/anti-punishment philosophy. Absorbs `/resources-collection` non-duplicate copy + the 5 hidden subpages.
8. **`/blog` + 19 posts** — Advice-hub index with category filters; post template (related posts, service CTA per category); posts at identical root slugs, filename = slug.
9. **`/gallery`** — *Final spec: `docs/page-specs/09-gallery.md` (built 2026-07-01, out of inside-out order at the owner's request).* Curated editorial mosaic (square tiles, 2×2 feature tiles, GSAP-Flip theme filters All/Playtime/Out&about/Training/Portraits, full-screen lightbox with keyboard/swipe), enquiry CTA. **50 photos from owner sources (consent confirmed 2026-07-01), after removing all Halti/head-collar shots at the owner's request: 7 already-public + 19 client day-care (ImgBB `session_photos` tab) + 10 Jotform training-in-action + 14 town/seafront/countryside scenes (Jotform).** Data-driven (`duda`/`client`/`training`/`scenes` arrays, round-robin interleave): adding a photo = drop file + one array line. ImgBB pool is consent-gated for social; captions use dog first names only. LIVE on preview (commits b07f747 + d7443df).
10. **`/contact`** — Simplified: main line + WhatsApp text line prominent, collapsible direct-lines (emergency/ops/grooming/training/pick-ups), full enquiry form, **Meet the team (names/roles/photos — owner supplies)**, address + hours + real Google Maps link. Address: Near the Milking Parlour, The Barn, Fairlight Place, Barley Lane, Hastings TN35 5DT.
11. **`/terms-and-conditions`** — Clean legal page (daycare T&Cs, hours, late fees, liability, grooming T&Cs pointer to sister site); the misplaced "why training takes time"/learning-stages marketing copy relocates to training pages.
12. **`/` Homepage — LAST** — Transformation-story hero (the Three.js/GSAP signature moment), services journey, `#Trainingplans` + `#MembershipPlans` anchor summary sections (exact-case IDs) rendering from pricing.json, proof strip, club/about, enquiry CTA. **MUST feature the Breed Matcher value-added tool** (owner instruction 2026-06-20): a prominent entry point to `/breed-matcher/` — decide link vs inline iframe-embed during the homepage pre-build interview. Specced fully in its own pre-build interview once all other pages are final. (See **Value-added tools** below.)
13. **`404`** — Friendly not-found + trailing-slash rescue script.

**Site-wide fixes baked into every page:** WhatsApp links corrected to `wa.me/447842116216` / `wa.me/441424300668`; placeholder `mailto:mymail@mailservice.com` buttons eradicated; footer Google Maps link gets the real place URL; day-school "Contact us" → `/contact` not `/`; Employee Login removed from public footer.

## URL manifest (~40 URLs — the go-live gate)

- **200 (rebuilt):** the 12 pages above + 19 blog post root slugs.
- **Meta-refresh stubs (Astro `redirects`):** `/puppy-classes`→`/puppy-training-classes` · `/training-stages`→`/dog-boarding-school` · `/admission-process`→`/dog-day-school` · `/boarding-information`→`/dog-boarding-school` (boarding lives with Board & Train, per the 2026-06-29 day-school interview) · `/resources-collection`→`/puppycourse` · `/puppy-week-1`, `/week-2-puppy`, `/puppy-week-3`, `/puppy-week-4`, `/puppy-toilet-schdule` (typo slug, verbatim)→`/puppycourse`.
- **Intentional 404:** `/staff-resources`, `/internal-management-resources`, `/feed/rss2`, `/feed/atom` (Astro generates `/rss.xml` instead).
- **Value-added tools (standalone):** `/breed-matcher/` (the Breed Matcher — served verbatim from `public/breed-matcher/index.html`; see below).
- `scripts/verify-urls.mjs` holds this manifest; `--dist` mode gates every page sign-off, `--live` mode gates and confirms DNS cutover.

## Value-added tools (standalone mini-apps)

Customer-facing interactive tools that are **not** Astro pages — self-contained single-file web apps, iterated on **in isolation** and shipped with the site. Pattern: the tool lives at `public/<tool>/index.html` (Astro copies `public/` verbatim → ships at `/<tool>/` with no build step); its dev kit (brief, tests, backups) lives at `tools/<tool>/` (not served).

- **Breed Matcher** (added 2026-06-20) — an honest, lead-generating breed-matching quiz: keeps the user's chosen breed the hero, shows an honest fit score that climbs once Fairy Tails services bridge the gaps; hard-nos never lift. Vanilla HTML/CSS/JS, British English, 96-breed dataset, node-tested engine.
  - **Tool:** `public/breed-matcher/index.html` → `/breed-matcher/`. **Dev kit:** `tools/breed-matcher/` (`CLAUDE.md` brief, `test/engine.test.mjs` via `npm run test:breed-matcher`, gitignored `backups/`).
  - **Homepage (page 12) must feature it** — recorded above. Service links in the tool point at the old live domain for now; repoint to new-site paths when those pages exist. Roadmap (extend dataset to 150+, richer score visual, more quizzes) is in the tool's brief.

## Architecture (verified June 2026)

- **Astro 6** (Node ≥ 22.12 — check first) + **Tailwind v4 via `@tailwindcss/postcss`** (NOT `astro add tailwind`/Vite plugin — Astro 6 bug withastro/astro#16542). **GSAP + ScrollTrigger** (free incl. premium plugins) loaded per-page; **Three.js only on the homepage**, lazy-loaded after LCP; `prefers-reduced-motion` fallbacks everywhere; animations are progressive enhancement on top of fully-rendered static HTML (SEO-safe).
- **URL preservation:** `build.format:'file'` + `trailingSlash:'never'` → GH Pages serves every legacy extensionless URL with a direct 200 (no redirects). Blog = content collection, `src/pages/[slug].astro`, **filename = legacy slug**, build-time collision guard. 404 page carries a trailing-slash rescue script (client-side strip + replace). Sitemap via `@astrojs/sitemap` with `.html`-stripping `serialize` guard (withastro/astro#15526).
- **Deploy:** GitHub Actions (`withastro/action@v6` → `actions/deploy-pages@v5`), Pages source = Actions, `main`-only, public repo (free-plan requirement — never commit client data/secrets; webhook URL in client JS is by-design, spam defence lives in n8n). `public/CNAME` = `www.thefairytails.co.uk`.
- **Data model (Content Layer):** `blog` glob collection (md, frontmatter: title/description/pubDate/category/heroImage); `pricing` file collection over `src/data/pricing.json` (~20 offerings: id, category, name, price, unit, features[], acuityUrl, order) — every plan grid on every page renders from this one file; `src/data/business.ts` = NAP, geo 50.8708/0.62896, hours Mon–Fri 8:00–17:30, phones by department, emails, GTM/Pixel/GA4 IDs, n8n webhook URL, socials.
- **Repo layout:** `public/` (CNAME, robots, favicon) · `src/{assets/{pages,blog,gallery}, components, layouts, content/blog, data, pages, styles}` · `scripts/{harvest,verify-urls}.mjs` · `.github/workflows/deploy.yml` · `docs/site-audit/` · project `CLAUDE.md` with editing recipes. Raw image archive OUTSIDE the repo at `..\fairytails-image-archive\`. OneDrive friction handled reactively (pause sync during installs / junction `node_modules` if needed).
- **Enquiry pipeline:** form fetch-POSTs JSON `{name,email,phone,service,dogName,breed,age,concerns[],contactPref,contactTime,message,page,website,elapsedMs}` to the n8n **production** webhook; honeypot (`website`) + `elapsedMs<4000` → fake success client-side. n8n "Website Enquiry": Webhook (Allowed Origins = `https://www.thefairytails.co.uk,http://localhost:4321`, respond via Respond-to-Webhook node) → validate/spam-gate (silent 200 on spam) → Telegram alert (service-tagged) + email to info@ (Reply-To submitter) + log row → 200. Built via n8n MCP; **always live-tested end-to-end with the execution read** (validation ≠ proof). Success pushes `dataLayer event:'enquiry_submitted'` → Ads conversion + GA4.
- **Tracking & consent:** Consent Mode v2 defaults (denied) → GTM snippet; self-hosted ~60-line banner; Meta Pixel migrated into GTM gated on marketing consent; GA4 tag gated on analytics consent (owner creates property + tags in GTM UI, guided).
- **SEO:** per-page Seo component (title/description/canonical/self-hosted OG 1200×630); JSON-LD — LocalBusiness (real address/geo/hours) on home+contact, BlogPosting on posts, Service on service pages; robots.txt + sitemap; GSC domain property (DNS TXT) created pre-cutover. (Ahrefs API unavailable on owner's plan; DR ≈ 0.4 → **URL preservation IS the SEO migration**; GSC is ground truth after launch.)

## Project stages

| Stage | Work | Gate |
|---|---|---|
| **0 — Harvest (FIRST — expiring CDN URLs)** | Script-crawl all ~39 live URLs incl. the 5 hidden course subpages: save copy, download every CDN image full-res to `..\fairytails-image-archive\<page>\`, record every Acuity href byte-for-byte, capture GTM/pixel snippets + sitemap | Manifest: every URL ✓copy ✓images ✓links; spot-open images |
| **1 — Foundation** | Repo init here; Astro 6 + Tailwind (PostCSS) + GSAP; config (format:'file', trailingSlash:'never', redirects map); Base layout + consent banner + GTM; `pricing.json` (corrected prices), `business.ts`; deploy.yml → live preview at `https://<user>.github.io/<repo>/` | Action green; clean build; consent banner verified |
| **2 — Page-by-page build loop** | Pages 1→11 in tracker order. Per page: **pre-build fine-tune interview → content → design → animation → polish → owner review on preview → sign-off**. Form+n8n built with page 1; blog collection with page 8 | Per page: owner sign-off + `verify-urls --dist` + Lighthouse ≥90 (perf/SEO/a11y) + reduced-motion check |
| **3 — Homepage** | Its own pre-build interview, then the same 4-pass build | Owner sign-off; anchors assert exact-case in dist; Lighthouse ≥90 incl. WebGL lazy-load |
| **4 — Site-wide SEO + tracking finish** | JSON-LD everywhere, OG images, sitemap/robots, GA4 property + GTM tags (guided), Rich Results + Tag Assistant (both consent states), full `--dist` manifest pass | All checks green; final content read-through |
| **5 — Cutover** | GitHub domain verify (TXT) ahead; screenshot IONOS records + TTL→300; `www` CNAME→`<user>.github.io`, apex A/AAAA→GH Pages IPs; remove stale Duda/IONOS records; Enforce HTTPS; GSC sitemap submit | `verify-urls --live` full manifest; apex→www 301; live form test (read n8n execution); live Acuity click; **keep Duda/IONOS 2–4 weeks**, then cancel |

## Owner inputs needed along the way

Page 1+: which Telegram chat/bot receives enquiry alerts · Page 9 (gallery): ImgBB access **received 2026-07-01** (owner's marketing-automation Google Sheet — session_photos tab; consent confirmed for the 24 photos used) · Page 10: team names/roles · Stage 4: GA4 property creation + GTM edits (their Google login, guided) · Stage 5: IONOS DNS login. Each page's pre-build interview may add small asks (case-study details, better photos).

## Key risks

1. **Duda image URLs expire ~July 2026 → Stage 0 harvest immediately.**
2. No server redirects on GH Pages ever → URL strategy locked at launch; never rename a slug without a stub.
3. Animation vs performance: GSAP is cheap, Three.js is not — WebGL stays homepage-only, lazy-loaded, with static fallback; Lighthouse ≥90 is a hard gate on every page.
4. CORS preflight on n8n webhook — must test from a real browser, not curl.
5. GH Pages case-sensitivity — slugs lowercase; anchor IDs exact-case (`Trainingplans`, `MembershipPlans`, `ConditionedEmotionalResponse`).
6. Public repo = permanent history — no client data, no staff content, no secrets.
7. n8n workflow must be Active + production URL, or every enquiry 404s.
8. Inside-out order means nav ships with page 1 linking to pages as they go live on preview (placeholder-free by stage 3).

## Verification

Standing gates: `verify-urls.mjs` manifest (~40 URLs: 200/stub/404) in `--dist` per sign-off and `--live` at cutover · per-page Lighthouse ≥90 + reduced-motion + mobile review · owner sign-off per page on the live preview URL · n8n enquiry tested end-to-end by reading the actual execution · Tag Assistant both consent states · Rich Results on home + a post · post-cutover: GSC sitemap Success, apex→www 301, live form + Acuity click-through.
