# HANDOVER — Fairy Tails main-website rebuild

**Last updated:** 2026-06-12 (later) · **Status: BUILDING — Stage 0 + Stage 1 done; Page 1 (Board & Train) content + design + animation passes built, awaiting owner review before the polish pass.**

## Where things stand (2026-06-12 session)

1. **Stage 0 harvest — RUN & VERIFIED 2026-06-12.** All 40 live URLs (39 known + sitemap extra
   `/internal-management-resources`) crawled into `..\fairytails-image-archive\<slug>\` (verbatim
   `copy.md`, `links.json`, raw `page.html`, 502 validated full-res images ~124 MB, **plus all 11
   live-site MP4 videos ~535 MB in `<slug>\videos\`** — incl. the homepage opening film and 4
   Board & Train clips, candidate hero-loop material). `_site\` has sitemap/robots/GTM+pixel
   snippets; `HARVEST-MANIFEST.md` records per-page results. `/puppy-classes` and
   `/internal-management-resources` are password-locked Duda stubs on the live site (documented,
   nothing to harvest). **The harvest `copy.md` files are the content source for every page
   build** (the audit JSONs are only summaries).
2. **Page 1 pre-build interview — DONE.** Final spec: **`docs/page-specs/01-dog-boarding-school.md`**
   (arc confirmed; Holiday B&T = 3rd pricing tier; proof = Archie + body-cam + testimonials +
   before/after; merged week-by-week regime drafted for owner correction; warm parent-to-parent
   voice; warm & natural design system; regime scroll-story is the signature animation; video hero
   with placeholder; **Telegram deferred — email-only alerts for now**).
3. **Stage 1 foundation — DONE.** Astro 6 + Tailwind v4 (`@tailwindcss/postcss`) + GSAP installed
   (`node_modules` junctioned to `C:\dev\main-website-node_modules`); `astro.config.mjs` with
   `format:'file'` + `trailingSlash:'never'` + all 10 redirect stubs; Base layout with Consent
   Mode v2 (default denied) + GTM `GTM-W93L9XK5` + self-hosted consent banner; header (real logo)
   /footer with corrected wa.me links; `src/data/business.ts` + `src/data/pricing.json`;
   `scripts/verify-urls.mjs` (45-URL manifest, `--dist` passes 0 failures); deploy workflow
   `.github/workflows/deploy.yml`; `public/robots.txt` is **Disallow-all until cutover**.
4. **n8n "Website Enquiry" workflow — LIVE & TESTED** (`qVpPqijvyEqWiPwy`, ftmanager.app.n8n.cloud).
   Webhook `https://ftmanager.app.n8n.cloud/webhook/website-enquiry` (CORS: www domain +
   fairytails123.github.io + localhost:4321) → validate/spam-gate → legit: Respond 200 → log to
   **Data Table `website_enquiries`** (`P8lhJp8JzpVecqdM`) → email info@ via "Resend SMTP
   (Fairytails)" with Reply-To submitter. **Live-tested end-to-end 2026-06-12: legit POST ran all
   6 nodes (SMTP accepted, exec 14236), spam POST silently 200'd with no row/email (exec 14237).**
   Telegram alert node deliberately NOT added yet (owner deferred choosing a destination).
5. **Page 1 — passes a–c of 4 BUILT** at `src/pages/dog-boarding-school.astro` (content from the
   harvested verbatim copy per the interview arc; then design + animation after owner feedback
   "doesn't feel premium" on the bare content pass).
   - **Design system ("countryside editorial", `src/styles/global.css`):** Fraunces Variable
     (display) + Karla Variable (body) self-hosted via @fontsource; moss/pine/cream/honey palette;
     grain texture; rolling-hill `HillDivider.astro`; polaroid photo cards; squiggle underline
     accents; paw-bullet motif; `.btn`/`.field` component classes.
   - **Animation (GSAP+ScrollTrigger, per-page chunk ~114 KB raw):** hero entrance timeline;
     parallax video hero — `public/media/board-train-hero.mp4` (10 s, 960 px, 2.45 MB, cut via
     ffmpeg-static from the harvested live-site film `a8DP...web3+(Original)-v.mp4`; poster jpg
     fallback; `preload=none`, plays only without reduced-motion/data-saver); scroll reveals
     (`data-reveal`) + staggers (`data-stagger`); **signature: week-by-week walk — honey trail
     fills + paw marker scrubs down the regime timeline, steps highlight as you pass**;
     drag-to-scroll polaroid rail; animated mobile slide-in menu + scrolled header; animated
     kit accordion; Astro **ClientRouter** view transitions. All animation is reduced-motion
     gated (`gsap.matchMedia`) and progressive (initial states set by JS, never CSS).
   - Placeholder slots still marked for: owner's final hero clip, body-cam clips, testimonials,
     before/after pairs.

## Next actions (in order)

1. **Owner review of design+animation on the live preview** (https://fairytails123.github.io/dog-boarding-school)
   — plus the standing content checks: drafted week-by-week regime (incl. mid-course home-break
   copy) and the Archie "proof, not promises" framing.
2. **Polish pass** — Lighthouse ≥ 90 (watch the 2.45 MB hero video + 114 KB GSAP chunk),
   reduced-motion check, mobile review, per-page SEO/JSON-LD, then owner sign-off + tick tracker.
   Note: GTM page_view fires once per full load — add a History Change trigger in GTM at Stage 4
   for ClientRouter navigations.
3. Page 2 (`/intensive-dog-training`): run its pre-build interview first.

## Owner inputs still open

- Page 1 (before sign-off): hero video clip · regime-timeline corrections · testimonial picks ·
  before/after photos + body-cam clips.
- Deferred: Telegram destination for enquiry alerts (workflow ready for the node).
- Page 9: ImgBB access · Page 10: team names/roles · Stage 4: GA4/GTM login session ·
  Stage 5: IONOS DNS login.

## Quick reference

- **Repo/deploy:** `Fairytails123/Fairytails123.github.io` (user site → serves at root, no base
  path; `public/CNAME` deliberately ABSENT until DNS cutover, robots.txt Disallow-all until then).
  Push to `main` → Actions → Pages.
- **Commands:** `npm run dev` / `npm run build` / `npm run verify-urls`.
- **Stack rules, URL rules, locked decisions:** see `CLAUDE.md` + `WEBSITE-PLAN.md` (unchanged).
- **Test enquiry rows:** the live test wrote one row to the `website_enquiries` data table
  (deleted after verification; executions 14236/14237 remain as evidence).
