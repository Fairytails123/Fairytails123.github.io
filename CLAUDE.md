# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Rebuild of **www.thefairytails.co.uk** (Fairy Tails K9 Centre, a dog-training business) — replacing a rented Duda-builder site with an owner-controlled static **Astro 6** site on **GitHub Pages**, with premium GSAP animation and one Three.js homepage showpiece.

**Current state: building (started 2026-06-12), PAUSED mid-page-1.** Foundation is live; Board & Train has content + design + animation passes deployed to the preview, with refinement + polish pass next. Check `HANDOVER.md` first in every session — it tracks status, the exact pick-up point, and next actions, and should be updated when a session ends.

## Commands

- `npm run dev` — dev server (localhost:4321)
- `npm run build` — static build to `dist/`
- `npm run verify-urls` — URL-manifest gate against `dist/` (`node scripts/verify-urls.mjs --live` for the live domain)
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

## Time-critical first action

**Stage 0 harvest before anything else:** the live site's images are on signed Duda CDN URLs **expiring ~July 2026**. The first build session must download every image full-res from all ~39 live URLs into `..\fairytails-image-archive\<page>\` (outside this repo) and save each page's copy + every Acuity href byte-for-byte. Spec in `WEBSITE-PLAN.md` Stage 0.

## Hard technical constraints (once building starts)

- **Stack:** Astro 6 (Node ≥ 22.12) + Tailwind v4 via **`@tailwindcss/postcss`** — NOT `astro add tailwind` / the Vite plugin (Astro 6 bug, withastro/astro#16542). GSAP + ScrollTrigger loaded per-page; Three.js **homepage hero only**, lazy-loaded after LCP; `prefers-reduced-motion` fallbacks everywhere.
- **URL preservation IS the SEO migration:** `build.format:'file'` + `trailingSlash:'never'`; blog markdown filename = legacy root-level slug; never rename a slug without a meta-refresh stub. `scripts/verify-urls.mjs` (~40-URL manifest, `--dist` / `--live` modes) gates every page sign-off and the DNS cutover.
- **Case sensitivity:** GH Pages is case-sensitive — slugs lowercase; preserved anchor IDs exact-case (`Trainingplans`, `MembershipPlans`, `ConditionedEmotionalResponse`).
- **Acuity booking links byte-for-byte** — never normalize or rewrite them.
- **Public repo** (free-plan requirement): no client data, no staff content, no secrets. The n8n webhook URL in client JS is by-design; spam defence lives in n8n.
- **Quality gates per page:** Lighthouse ≥ 90 (perf/SEO/a11y), reduced-motion check, `verify-urls --dist`, owner sign-off on the live preview.
- **n8n enquiry workflow:** always live-test end-to-end and read the actual execution — validation output is not proof. Test CORS from a real browser, not curl.
- **OneDrive friction:** pause sync during `npm install` / junction `node_modules` if needed.

## Single sources of data (planned)

All pricing/plan grids render from `src/data/pricing.json`; NAP, hours, phone directory, analytics IDs, and the n8n webhook URL live in `src/data/business.ts`. Fix prices in data, never in page copy.
