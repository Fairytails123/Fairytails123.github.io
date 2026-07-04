# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Rebuild of **www.thefairytails.co.uk** (Fairy Tails K9 Centre, a dog-training business) — replacing a rented Duda-builder site with an owner-controlled static **Astro 6** site on **GitHub Pages**, with premium GSAP animation and one Three.js homepage showpiece.

**Current state: building (started 2026-06-12), inside-out, paused between pages.** Foundation is live and pages are shipping to the preview in the `WEBSITE-PLAN.md` tracker order (Board & Train and Dog Day School are already on the preview). **Check `HANDOVER.md` first in every session for the live build status, the exact pick-up point, and next actions** — it is the single source of truth for status, updated when a session ends; do not trust any hard-coded state here.

## Commands

- `npm run dev` — dev server (localhost:4321)
- `npm run build` — static build to `dist/` (`format:'file'` → `dist/<slug>.html`, served extensionless)
- `npm run preview` — serve the built `dist/` locally
- `npm run verify-urls` — URL-manifest gate against `dist/`; `node scripts/verify-urls.mjs --live` checks the live domain. Manifest entries are `built` (FAIL if missing) or `planned` (WARN only) — flip planned→built as each page ships
- `npm run test:breed-matcher` — node regression harness for the Breed Matcher tool's scoring engine (see **Value-added tools** below); run after any edit to that tool's engine/data
- `node_modules` is a **junction** to `C:\dev\main-website-node_modules` (outside OneDrive — don't break it; recreate with `New-Item -ItemType Junction` after a fresh clone)
- Deploy: push to `main` → GitHub Actions → GitHub Pages (repo `Fairytails123/Fairytails123.github.io`, preview at https://fairytails123.github.io/)

## Authoritative documents

1. **`HANDOVER.md`** — session status + ordered next actions.
2. **`WEBSITE-PLAN.md`** — the master plan: locked interview decisions, page map with build-order/status tracker, per-page baseline specs, architecture, URL manifest, stage gates, risks. It is the *baseline*; each page's pre-build interview is the *final word*.
3. **`docs/page-specs/*.md`** — per-page FINAL specs produced by each pre-build interview (supersede the baseline for that page).
4. **`docs/site-audit/*.json`** — raw per-page audit of all ~39 live URLs (copy, links, images, defects, SEO baseline) that the plan was built from.
5. **`..\fairytails-image-archive\`** (outside the repo) — Stage 0 harvest: per-page verbatim `copy.md`, `links.json`, raw `page.html`, and every live-site image full-res. **This is the content source for every page build** — the audit JSONs are summaries; the harvest is verbatim.

This folder is used from more than one Windows machine via OneDrive. Claude's per-machine memory does **not** travel with it — durable project knowledge belongs in these repo files, not in session memory.

## The owner's process (explicit instructions — do not shortcut)

1. **Inside-out, one page at a time:** Board & Train (`/dog-boarding-school`) first, homepage LAST. Order = the status tracker table in `WEBSITE-PLAN.md`. A page is finished and signed off before the next begins.
2. **Pre-build interview per page:** immediately before each page's build, re-interview the owner in depth about every element of that page to fine-tune its spec. Never start building a page from the baseline spec alone.
3. **Four passes per page:** structure/content → design pass → GSAP animation pass → polish (perf/a11y/SEO), with owner review on the live preview URL between passes.
4. Tick the tracker boxes in `WEBSITE-PLAN.md` as pages progress.
5. Decisions in the plan's "Interview decisions" table are **locked — don't re-ask** (e.g. Intensive Dog Training is £2,000, the detail page's £1,800 is stale; puppy classes include three intro sessions; enquiry form is the site-wide primary CTA).

## Stage 0 harvest (completed 2026-06-12)

**Done — see `HANDOVER.md`.** The live site's images were on signed Duda CDN URLs **expiring ~July 2026**; all ~39 live URLs have been crawled and every image saved full-res into `..\fairytails-image-archive\<page>\` (outside this repo), with each page's copy + every Acuity href preserved byte-for-byte. That local archive — not the live CDN — is the content source for every page build. Spec in `WEBSITE-PLAN.md` Stage 0; re-harvest only if a future page needs media not already captured.

## Hard technical constraints

- **Stack:** Astro 6 (Node ≥ 22.12) + Tailwind v4 via **`@tailwindcss/postcss`** — NOT `astro add tailwind` / the Vite plugin (Astro 6 bug, withastro/astro#16542). GSAP + ScrollTrigger loaded per-page; Three.js **homepage hero only**, lazy-loaded after LCP; `prefers-reduced-motion` fallbacks everywhere.
- **URL preservation IS the SEO migration:** `build.format:'file'` + `trailingSlash:'never'`; blog markdown filename = legacy root-level slug; never rename a slug without a meta-refresh stub. `scripts/verify-urls.mjs` (~40-URL manifest; checks `dist/` by default, `--live` checks the live domain) gates every page sign-off and the DNS cutover.
- **Case sensitivity:** GH Pages is case-sensitive — slugs lowercase; preserved anchor IDs exact-case (`Trainingplans`, `MembershipPlans`, `ConditionedEmotionalResponse`).
- **Acuity booking links byte-for-byte** — never normalize or rewrite them.
- **Public repo** (free-plan requirement): no client data, no staff content, no secrets. The n8n webhook URL in client JS is by-design; spam defence lives in n8n.
- **Quality gates per page:** Lighthouse ≥ 90 (perf/SEO/a11y), reduced-motion check, `npm run verify-urls` (checks `dist/`), owner sign-off on the live preview.
- **n8n enquiry workflow:** always live-test end-to-end and read the actual execution — validation output is not proof. Test CORS from a real browser, not curl.
- **OneDrive friction:** pause sync during `npm install` / junction `node_modules` if needed.

## Code architecture

The foundation is built. **`src/pages/dog-boarding-school.astro` is the reference implementation** for every later page — mirror its conventions rather than inventing new ones.

**Page model.** Every page is a `<Base title description path ogImage?>` wrapper. `src/layouts/Base.astro` owns the whole `<head>` (title/description/`canonical`/OG/Twitter, with `canonical = business.domain + path`), Consent Mode v2 (defaults **denied** in an inline script *before* GTM loads — UK PECR), the GTM container (`business.tracking.gtm`), Astro `<ClientRouter />` (view transitions), and the `Header` / `<slot/>` / `Footer` / `ConsentBanner` shell. Pages supply only their `<main>` content + the four `<Base>` props. (`src/pages/index.astro` is only a temporary holding page so `/` resolves on the preview — the real homepage is built **LAST** per the inside-out order; don't treat it as the reference or ship it as the production home.)

**Data-driven rendering — single source of truth.** Never hard-code facts that live in data:
- `src/data/business.ts` (`business` const, `as const`) — NAP, opening `hours` (human-readable `display` string **+** a `jsonLd` `{opens, closes, days[]}` object for schema markup), `geo` `{lat, lng}` and `mapsUrl`, the full **phone directory** (`phones`, a keyed object — `main`/`emergency`/`opsManager`/`grooming`/`training`/`pickups` — each entry `{label, display, tel}`, plus `whatsapp` only on `main`), `emails`, `socials`, **Acuity booking URLs (byte-for-byte — never normalise)**, the grooming sister-site URL, tracking IDs, and the n8n `enquiryWebhook`. Every contact/booking link reads from here.
- `src/data/pricing.json` — `offerings[]`, each `{id, category, name, price, unit, largeDogSurcharge, eligibility, features[], acuityUrl, order, weeklyDiscountPrice?}`. Pages **filter by `category`** (`board-train` | `training` | `day-school` | `membership`) and **sort by `order`**; format money with a local `gbp()` (`£` + `toLocaleString('en-GB')`). Fix prices/facts in data, never in page copy.

**Components** (`src/components/`): `Header` (fixed; `.is-scrolled` toggled on scroll — the scrolled blur/tint lives on a `::before`, **never put `backdrop-filter`/`filter`/`transform` on the header element itself** or it becomes the containing block for the `position:fixed` mobile panel and clips the drawer; mobile slide-in drawer; two CTAs: Enquire (moss, primary) + Book Appointment (honey, `business.acuity.bookAppointment`, for returning regulars); nav grows **inside-out** — links added only as pages ship), `Footer` (contacts/NAP from `business`), `ConsentBanner` (self-hosted CMP — no third-party — that only ever *upgrades* consent and persists to `localStorage.ft-consent`), `EnquiryForm` (**site-wide primary CTA**; props `{service, page}`; POSTs JSON to `business.enquiryWebhook`; spam gate = honeypot `website` field **+** `elapsedMs < 4000` → silent client-side fake-success; pushes `enquiry_submitted` to `dataLayer` on success), `HillDivider` (rolling-hill SVG between section colours — `class` sets the fill via a `text-*` colour, `flip` mirrors it).

**Design system** (`src/styles/global.css`, Tailwind v4 `@theme`): "countryside editorial" — palettes `cream` / `moss` / `pine` / `bark` / `honey`; `--font-display` Fraunces Variable + `--font-body` Karla Variable (self-hosted via `@fontsource-variable/*`, imported in `Base`). Reuse the component classes instead of re-styling: `.btn` + `.btn-honey`/`.btn-moss`/`.btn-ghost-light` (with `.btn-arrow`), `.eyebrow`, `.squiggle` (accent underline), `.polaroid`, `.grain`, `.paw-bullet`, `.field`/`.field-label`, the `<details>` accordion (`.accordion-body`/`.accordion-chevron`), and `.drag-track`.

**Per-page assets.** Page images live in `src/assets/pages/<slug>/` (full-res from the harvest), are `import`ed and rendered with the astro:assets `<Image widths sizes>` component (not raw `<img>`). Body copy is lifted **verbatim from the harvest `copy.md`** into frontmatter arrays. **Video assets** (hero loops etc.) go in `public/media/` (served verbatim) and are produced with FFmpeg via the bundled `ffmpeg-static` (`node_modules/ffmpeg-static/ffmpeg.exe`; no system ffmpeg/ffprobe) — runbook + recipes in **`docs/video-hero-pipeline.md`**. ⚠️ The owner's iPhone clips are **HLG-HDR** and MUST be tonemapped to SDR or they render washed-out; raw clips/working files live in the gitignored `Videos\` folder (never commit — GitHub's 100 MB file limit).

**Animation contract** (GSAP + ScrollTrigger in a per-page `<script>`):
- Register the plugin; run an **idempotent** `init()` guarded by the standard `data-gsapInit` flag (`if (!root || root.dataset.gsapInit) return;`, then set `root.dataset.gsapInit = '1'` — reuse this exact flag, don't invent a per-page variant); wrap motion in `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`. **Reduced-motion returns early → the page is fully visible and static.**
- Set initial hidden states in **JS, never CSS**, so a no-JS / pre-hydration page still shows all content. Standard hooks: `data-reveal` (fade-up on scroll), `data-stagger` (stagger a group's children), `data-hero-*` (hero entrance timeline).
- ClientRouter lifecycle: re-run `init()` on `astro:page-load`, and **kill all ScrollTriggers on `astro:before-swap`** or they leak across navigations.
- Hero video: `preload="none"`, lazy `.load()/.play()` after first paint, **skipped for reduced-motion or `navigator.connection.saveData`**; the `poster` is the fallback frame.

**URL-preservation mechanics** (the SEO migration). In `astro.config.mjs`, `site` is the **final custom domain**, so canonical/OG/sitemap URLs point there *even on the preview* — which is why `public/robots.txt` is Disallow-all until cutover. `format:'file'` + `trailingSlash:'never'` serve every legacy URL extensionless; `redirects` are the 10 consolidated legacy slugs (emitted as meta-refresh stubs); the sitemap integration strips the `.html`. `src/pages/404.astro` strips a stray trailing slash and retries once. Keep `scripts/verify-urls.mjs` green before every sign-off.

## Value-added tools (standalone mini-apps)

Customer-facing interactive tools that are **not** Astro pages — self-contained single-file web apps the owner wants to iterate on **in isolation** and ship with the site.

- **Breed Matcher** — an honest, lead-generating breed-matching quiz (added 2026-06-20). It is a **standalone `index.html`** (vanilla HTML/CSS/JS, **no build step, no framework, no bundler** — opens directly in a browser; British English; its own self-contained palette).
- **Where it lives = the integration pattern for any such tool:**
  - **The tool itself (single source of truth):** `public/breed-matcher/index.html`. Astro copies `public/` **verbatim** into `dist/`, so it ships with **zero build wiring** and is served at **`/breed-matcher/`**. There is **only one copy** — edit it directly; do not create a mirror.
  - **The isolation/dev kit (NOT served):** `tools/breed-matcher/` — `CLAUDE.md` (the full authoritative brief; auto-loads when working in that folder), `README.md`, `test/engine.test.mjs` (the `npm run test:breed-matcher` harness), and a gitignored `backups/` (standing rule: back up before any edit). Keeping docs/tests under `tools/` (not `public/`) means they never ship.
- **Sacred rules for the Breed Matcher engine** (full detail in `tools/breed-matcher/CLAUDE.md`): the chosen breed stays the hero; **hard-nos never lift** (`supported === base`, stated plainly); the two-register tip voice. The 92 cap bounds the *lift*, not an already-excellent honest score. After any engine/data change: `npm run test:breed-matcher` (regression), then `npm run build && npm run verify-urls` (still ships).
- **Not on the homepage yet** — the site is built inside-out and the **homepage is built LAST**; featuring/linking/embedding the matcher on `/` is recorded in `WEBSITE-PLAN.md` + `HANDOVER.md` for the homepage build. The tool is fully usable standalone at `/breed-matcher/` on the preview meanwhile.
- **Service links** in the tool (`FT = {…}`) currently point at the old live domain (still resolving); repoint to new-site paths when those pages exist.
