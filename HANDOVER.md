# HANDOVER — Fairy Tails main-website rebuild

## ⏸️ PAUSE POINT 2026-07-06 — read this first

**2026-07-06 session: NEW page `/comprehensive-puppy-training` (page "4b") interviewed → built → adversarially reviewed → DEPLOYED + LIVE, then promoted into the nav as "Puppy School", then SEO indexability confirmed + hardened.** All on production (Hostinger), verified live. Effort mode: ultracode (workflow-orchestrated).

**What shipped (3 deploys, all green):**
1. **`/comprehensive-puppy-training`** (commit `483a973` page + `c499f3c` nav) — a NEW dedicated page for the £1,200 Comprehensive Puppy Training product (`pricing.json` `puppy-intensive`), added at owner request so the menu isn't overloaded. Built via a **recon workflow** (9 agents → slug/differentiation/section plan) + an **adversarial-review workflow** (16 agents, 12 findings → 7 rejected, 5 minor fixed: card-subtitle AA contrast `bark-400`→`bark-500`, 2 dead imports, softened an absolute "no separation anxiety" claim → "Confident when left alone", meta length). Spec = **`docs/page-specs/04b-comprehensive-puppy-training.md`** (all locked decisions + section map + owner-review items). Owner interview locked: **trainer-led/labour-intensive** positioning (the differentiator vs the **parent-led** £175 classes) · real overnight boarding → carries the 5-star council-licence badge on the separation-anxiety section · signature = **"time on / time off"** socialisation-rhythm scroll story · enquiry + free-consult CTAs (product has no Acuity link) · reused live puppy hero clip (**bespoke swap = TODO**) · dashed testimonial placeholder. `monthPlan`/`faqs`/`rhythm` copy are **DRAFTS** for owner correction.
2. **Nav change (owner, same day):** menu item **"Puppy Classes" → "Puppy School"**, repointed to `/comprehensive-puppy-training` (the PRIMARY puppy offer we promote). **`/puppy-training-classes` LEAVES the nav** but stays reachable via internal links (homepage service-grid `detailHref` + the puppy pages' cross-sell cards). `Header.astro` `nav[]` is the single source (drives desktop + mobile drawer); one-line desktop fit + mobile drawer re-verified. This **REVERSED the initial "off-nav" plan** (04b spec + WEBSITE-PLAN + 05 spec all updated).
3. **SEO indexability** (commit `77fd09f`) — owner wants max SEO. Verified LIVE the site is fully indexable: `robots.txt` = `Allow: /` + sitemap, **no `noindex`** (meta or `X-Robots-Tag`), correct self-canonicals, real (non-placeholder) homepage. Added the standalone **`/breed-matcher/`** tool to the sitemap via `customPages` (live sitemap now **31 URLs** incl. `/comprehensive-puppy-training`). Fixed the STALE "Disallow until cutover" notes in `astro.config.mjs` + `CLAUDE.md` (they could trick a future session into re-blocking). **Owner has submitted the sitemap in Google Search Console + requested indexing on key pages.** ⚠️ Ahrefs' GSC MCP is **plan-gated** ("Insufficient plan" on `management-projects`/`gsc-pages`) → check indexing status directly in GSC, not via Ahrefs.

**Also this session: PAGE 5 `/training-plans` FULLY SPECCED** (pre-build interview, 3 AskUserQuestion rounds) → **`docs/page-specs/05-training-plans.md`** — ready to build. Locked: **Training + Board & Train = 9 plans** · **instant filter chips** (Age/Goal/Format/Budget, AND logic + soft-dim, empty-state = free-consult card) · one flat animated grid · **no** comparison table · **NO cross-sell** (page ends on the free consult) · card CTA = detail page if it exists, else Acuity/consult · video hero (owner picks the clip) · **free phone consult = primary CTA** · budget = **TWO bands** (pay-as-you-go £0–175 / programme £1,200+) · the Comprehensive Puppy card links to the new page.

**NEXT BUILD:** **page 5 `/training-plans`** — spec is DONE, so it can go straight to build (just re-confirm the few open choices with the owner, e.g. which reserve hero clip). Then `/membership-plans`, then `/puppycourse`.

**Deploys:** page `483a973`, nav `c499f3c`, SEO `77fd09f` — all `Deploy to Hostinger` runs green. (One `gh run watch` dropped on a transient GH-API **401** mid-poll — NOT a deploy failure; confirm with `gh run view <id> --json conclusion`.) The **rollup native-dep npm bug** hit again → `npm i @rollup/rollup-win32-x64-msvc@4.61.1 --no-save` fixed it (x64 this machine, not arm64).

**OWNER REVIEW QUEUE — comprehensive puppy page:** correct the DRAFT copy on preview (4-week `monthPlan`, 6 `faqs`, the "time on/off" `rhythm` text) · swap the interim hero clip for a bespoke trainer-led film · supply a real puppy-graduate testimonial (consent-gated) · **site-wide a11y polish:** `.eyebrow` in `honey-600` fails WCAG AA on cream (shared token issue on ALL built pages — fix once at token level, e.g. → `honey-700`, and bump the sibling pages' card-subtitle `bark-400`→`bark-500` to match this page).

## ⏸️ Previous pause point 2026-07-05 — read this

**2026-07-05 session: PAGE 4 `/puppy-training-classes` interviewed, built, adversarially reviewed (5 confirmed findings fixed pre-deploy), COMMITTED + PUSHED + LIVE-VERIFIED on production (commit `5ad8949`, deploy green first try, `verify-urls --live` 47/0).** Full detail in the ▶ 2026-07-05 section below; spec + owner-review open items in `docs/page-specs/04-puppy-training-classes.md` (BUILD STATE). Working tree after push: clean except the n8n-brief status edit in `CLAUDE.md` from the parallel n8n session (leave for that workstream unless Kam says otherwise).

**OWNER REVIEW QUEUE — puppy page (newest):** class-night timeline rundown (draft) · kit list (draft) · FAQ answers (drafts, esp. missed-session + family attendance) · **"Intensive Training" nav label** (shortened for the one-line nav — approve or supply alternative) · supply the puppy-parent testimonial · confirm whether the 3 included day-school intros are FULL DAYS (copy deliberately says "three intro sessions" — review found duration unsourced) · test on a real phone AND a tablet (768–1023px now shows the drawer, not the desktop nav).

**NEXT BUILD:** page 5 `/training-plans` (then membership-plans, puppycourse) — pre-build interview first, per the owner process. Baseline in WEBSITE-PLAN.md; harvest folder `fairytails-image-archive/`.

## ⏸️ Previous pause point 2026-07-04 (end of a MEGA-session)

**Everything below dated 2026-07-04 shipped that day, all committed + pushed + live-verified on production (www.thefairytails.co.uk, Hostinger).** In order: Book-Appointment CTA restored + scrolled-drawer bug fix → homepage retagline ("A calmer, happier dog is in there.") → **PAGE 8 BLOG** (hub + 19 legacy posts, original 2020-2025 dates) → header Grooming link (Blog → footer) → drawer "Talk to us" redesign → estimator optional extras (Sniffari £5/day, pick-up/drop-off £1/journey) → **Flexi Pass** inline note (£99.95/5 days, pricing.json `flexiPass`) → NEW blog post `/animal-management-qualification-jobs` (+ Careers category) → **PAGE 11 TERMS** (verbatim + owner-approved cross-ref fixes) → homepage Force-free card reword → **5-star council rating + licence WK/202503477** (footer badge site-wide, B&T panel, trust strips) → both-viewports testing RULE added to CLAUDE.md → **13 owner videos processed: 6 placements live** (day-school hero recut, B&T town film + owner loop, intensive loop, home reassurance loop) → **PAGE 10 CONTACT** (licence certificate + council-register verify link; Contact = footer-only, phone stays in nav) → **homepage hero SEQUENCE** (photo → particles form the LOGO → home-hero.mp4 fades in) → **membership & club plan details corrected site-wide** (owner-supplied old-site cards; free pick-ups reinstated as a full-day-tier/grooming-sub perk — see night 4 + 12-homepage.md) → **site-wide button/link audit + dead-end CTA sweep** (breed-matcher service links repointed off dead old-Duda paths; unbuilt-page CTAs + 7 legacy redirect stubs → owner-approved TEMP targets — flip-back checklist in the 🔔 block below; dead blog citation → Wayback snapshot — see night 5).

**Deploys:** last commit today `94dd8f1` region; FTPS action flaky (`Timeout (control socket)` → `gh run rerun --failed`); after push match runs by `headSha`, not `--limit 1`. **Stale-DNS trap** (old Duda site still live on old IPs) documented below — "old site showing" = cached DNS, not a regression.

**OWNER REVIEW QUEUE (next session's first conversation):** (1) watch the homepage hero sequence + all 5 video placements on real phone/desktop — timing tweaks are one-liners; (2) blog: flagged verbatim defects (puppy-daycare truncated paragraph, fear-and-anxiety fragments, door-post merged bullets, 15-food garbled lines) + category assignments; (3) terms: solicitor skim recommended (Fairy Tails/Tales spellings, clause 3.2 lettering); (4) contact: supply team names/roles for proper team cards; (5) homepage soul content still owed (founder story, real transformation dog, review rating).

**BUILD QUEUE:** pages 5-7 remain (training-plans, membership-plans, puppycourse); **page 4 puppy-training-classes BUILT 2026-07-05** (see the ▶ 2026-07-05 section below); then polish passes (Lighthouse/a11y) + sign-offs across all built pages; OG images; GTM/GA4 (Stage 4 leftovers); legacy blog posts DONE.

**🔔 STANDING SESSION-START NUDGE (owner request 2026-07-04): gently remind the owner at the start of EVERY session that pages 5-7 (training-plans, membership-plans, puppycourse) still need building.** Until they ship, TEMP link targets are live (owner-approved 2026-07-04) and each carries a `TEMP:` code comment — **FLIP-BACK CHECKLIST when each page is built:**
- `/membership-plans` built → homepage `index.astro` membership button back to "Compare membership plans" → `/membership-plans`; day-school teaser button → `/membership-plans` (both currently: homepage → `#enquire`, day-school → `/#MembershipPlans`).
- `/puppycourse` built → the six `astro.config.mjs` stubs (`resources-collection`, `puppy-week-1/3/4`, `week-2-puppy`, `puppy-toilet-schdule`) → `/puppycourse` (now `/blog`) **+** the DIY-course pathway card on BOTH `puppy-training-classes.astro` AND `comprehensive-puppy-training.astro` → `/puppycourse` (both now `/blog`, each carries a `TEMP:` comment).
- ✅ ~~`/puppy-training-classes`~~ — DONE 2026-07-05: `detailHref['puppy-classes']`, the `'/puppy-classes'` redirect and breed-matcher `FT.puppy` all flipped to `/puppy-training-classes` (backup taken per standing rule, harness 17/17).
- (Breed-matcher service links were repointed to the new site 2026-07-04; as of 2026-07-05 none remain TEMP.)

## ▶ 2026-07-05 — 🐶 PAGE 4 /puppy-training-classes BUILT + REVIEWED + LIVE (`5ad8949`; interview → spec → media → page + site-wide wiring → 38-agent review → deploy)

Full pre-build interview (3 AskUserQuestion rounds + follow-ups + owner-typed week 1-4 curriculum) → **`docs/page-specs/04-puppy-training-classes.md`** (the authoritative spec; all locked decisions tabled there). Highlights:
- **Facts locked:** Concordia Hall St. Leonards Thursdays 6pm (stale "For 2024" dropped) · rolling enrolment · **£175 = 4 evening sessions/month + THREE day-school intros** · under-6-months + day-school vaccine set (DHP/Lepto/KC) · trainers unnamed for now · SEO title fixed ("Puppy Training Classes in Hastings & St Leonards"), legacy meta description kept.
- **Signature interaction:** "A class night" timeline 6:00→7:00pm — night-sky sibling of the day-school dawn→dusk mechanic (moonlit trail + rising MOON marker + faint CSS stars; same scrub/dim pattern, `data-night-*` hooks). **The rundown times/blocks are a Claude DRAFT — owner corrects on preview.** Kit list + 5 FAQs also drafts; testimonial = graceful placeholder (owner supplies later).
- **Media (from the reserved drop-ins, all already SDR — no tonemap needed):** hero = `puppy-classes-hero.mp4` (1.8 MB, re-encode of the CLEAN `Puppy+Class-v` hall clip; the `puppy class.mp4` twin has baked-in social-post graphics — unusable) + poster. Golden-pup portrait clips → `puppy-walk-loop.mp4` (park loose-lead, in the four-weeks section) + `puppy-settle-loop.mp4` (café settle + sea-view sit w/ xfade, in the day-school bridge) — `video[data-src]` polaroids via `initVideoLoops`. 9 harvested images curated into `src/assets/pages/puppy-training-classes/` (AI ChatGPT png + "SAY NO TO CRUEL COLLARS" poster graphic + logo dropped; the WhatsApp real-hall photo KEPT as the welcome polaroid `class-night-hall.jpg`).
- **Page:** 13 sections per spec (hero w/ both CTAs [enquiry primary + Acuity cart "Reserve your place — £175" byte-for-byte] · verbatim why-classes/benefits/bond copy · owner curriculum week cards · class-night timeline · day-school bridge · booking + pricing card from `pricing.json` `puppy-classes` · entry rules + kit accordions · FAQ accordion · puppy-pathways cross-sell [DIY card TEMP→`/blog`] · EnquiryForm `service="Puppy Training Classes"`). Standard GSAP contract (`data-gsapInit` guard, matchMedia, before-swap kill, `overflow-x-clip` on both step lists).
- **⚠️ SITE-WIDE header change (flag to owner):** the 6th nav link made desktop nav labels wrap two-line (owner one-line rule). Fixed in `Header.astro`: `.nav-link` nowrap, gaps tightened (gap-5), CTAs `!px-4` (was 5), phone `hidden xl:block` (was lg — phone now only ≥1280px), and **nav label "Intensive Dog Training" → "Intensive Training"** (nav/drawer only; page title unchanged — owner to approve or supply an alternative). **The adversarial review then caught that nowrap CLIPPED the Book Appointment CTA at tablet widths (768–990px, hamburger hidden = unreachable)** → final fix: **desktop nav now shows from `lg:` (1024px) instead of `md:`; 768–1023px gets the hamburger + drawer** (which never clips). Verified: 768 drawer, 1024+ one-line nav, 1440 one-line incl. phone ≥1280.
- **6-agent-dimension adversarial review workflow (38 agents, 11 findings → 5 confirmed by 3-refuter majority) — all 5 FIXED before deploy:** (1) the header tablet clipping above; (2) HIGH copy: page claimed the 3 included day-school intros were "full days"/"three days" — unsourced and contradicted by the day-school page's 1/2/3-hour taster model → softened to "three intro sessions" everywhere; (3) females-in-season published as a blanket hall-class rule → rescoped to the day-school intro sessions only (per policy source); (4) the class-night step dim/spotlight was a silent no-op (gsap `autoAlpha` leaves inline opacity:1 that beats the `.night-step` dim CSS) → entrance tween is now x-only, CSS owns opacity (dim raised 0.38→0.55 for readability). **⚠️ The same no-op exists on the 3 sibling pages (dog-day-school ~1124, intensive ~826, board&train ~860 — their day/regime-step dim rules never engage); decide at polish whether to activate or delete there**; (5) the moon marker clipped ~8px at phone widths (track `left-[7px]` vs `-left-[15px]` moon inside `overflow-x-clip`) → mobile track moved to 15px. (Also: unused `puppyRecall` import removed. The day-school page's SUN has the same minor mobile clip — polish note.)
- **Wiring flips:** Header nav +Puppy Classes · verify-urls planned→built (47 URLs, 0 failures, 3 planned left) · `/puppy-classes` stub → real page · homepage `detailHref` → real page · breed-matcher `FT.puppy` → real page (backup `tools/breed-matcher/backups/index-20260705-*-pre-puppy-link-flip.html`; harness 17/17) · WEBSITE-PLAN tracker row 4 ticked.
- **QA:** build clean (30 pages) · dist greps (1× "£175 per course", 3× "three intro sessions", 0× "two intro sessions", cart link intact) · Chrome-verified desktop (~1258 real + 1440 emulated: hero video playing, night timeline scrubbing, pricing card, accordions) AND mobile 390 touch (hero, drawer w/ 6 links, timeline, 0 px horizontal overflow) · 0 console errors · arm64 note: needed the documented `npm i --no-save @rollup/rollup-win32-arm64-msvc@4.61.1 @img/sharp-win32-arm64@0.34.5` again.
- **OWNER REVIEW LIST for this page:** (1) class-night rundown times/blocks (draft), (2) kit list (draft), (3) FAQ answers esp. missed-session + family-attendance wording (drafts), (4) the "Intensive Training" nav label, (5) supply the puppy-parent testimonial when ready, (6) week 3 recall wording ("earns them their freedom") ok?, (7) confirm whether the 3 day-school intros are full days (copy says "sessions" — see review finding).
- **DEPLOYED + LIVE-VERIFIED (owner asked "make all live for testing"):** commit `5ad8949` (25 files) pushed → `Deploy to Hostinger` run `28741693776` green FIRST TRY (no FTPS flake) → live checks all pass: `verify-urls --live` 47/0 · `/puppy-training-classes` 200 with corrected copy · `/puppy-classes` stub redirecting to the real page · all 3 new videos 200 · breed-matcher `FT.puppy` live on the new URL. Also committed: the n8n-VPS brief in `CLAUDE.md` **with SSH host/user/key REDACTED (public repo — access details stay in the migration handover doc)**; CRLF warnings on commit are normal for this repo.

## ▶ 2026-07-04 (night 5) — Site-wide button/link AUDIT + dead-end CTA sweep + citation fix — ALL LIVE (`8de5922`, `94dd8f1`)

Owner asked for "the list of command buttons which don't work or don't point to meaningful output", then approved fixes. **Audit method (reusable):** script-extract every `<a>`/`<button>`/`<form>` from `dist/` (40 pages, 1,324 elements — scratchpad script, worth re-running before cutover-grade milestones), check internal targets + anchors against the built files, `curl` every unique external URL. **Findings → fixes:**
1. **Breed Matcher `FT` service links were 404ing since the domain cutover** — they pointed at old-Duda paths (`/daycare`, `/training`, `/grooming`, `/dog-walking`, `/boarding`) which the NEW site serves as 404s. Repointed (backup taken per standing rule; engine untouched, harness 17/17): daycare+walking→`/dog-day-school`, intensive→`/intensive-dog-training`, boarding→`/dog-boarding-school`, grooming→sister site, puppy→`/#Trainingplans` (TEMP), `SITE`→www (skips the apex 301). CLAUDE.md breed-matcher note updated.
2. **CTAs to unbuilt pages 4-7** → owner-approved TEMP targets (all carry `TEMP:` code comments; flip-back checklist in the 🔔 block above): homepage membership button → relabelled "Enquire about membership" → `#enquire` (it sits INSIDE `#MembershipPlans` and the cards now show full details — self-link was pointless); day-school teaser → `/#MembershipPlans`; homepage puppy-classes card → `#enquire` (matches the existing enquiry-first pattern in `detailHref`).
3. **7 legacy redirect stubs meta-refreshed into 404s** (`astro.config.mjs`): `/puppy-classes` → `/#Trainingplans` (was `/puppy-training-classes`); the six puppycourse stubs → `/blog` (was `/puppycourse`).
4. **Dead citation** in `/force-free-trainers-v-balanced-dog-trainers`: Purdue Croney `enrichment.pdf` 404 → Wayback snapshot (`web/20221206081800/...`) of the SAME document (`94dd8f1`).
**Verified fine, no action:** all Acuity/grooming/socials/maps/council/gov.uk externals 200 (Facebook 400 = bot-block only); all JS buttons have handlers (consent, drawer, blog+gallery chips, lightbox, estimator, matcher wizard); `/blog?category=` deep links valid; ScienceDirect/ResearchGate 403s = bot-blocks; zero empty hrefs. The dog-parks post's tracking-stuffed Google-search link works — tidy someday.

## ▶ 2026-07-04 (night 4) — Membership & club plan details corrected SITE-WIDE (owner-supplied old-site cards = the authority)

Owner reported the membership/club plan details were inaccurate and supplied a screenshot of the OLD site's four membership cards as the truth of "what is on offer" (matches `fairytails-image-archive/home/copy.md` "## Membership plans" verbatim). Fixed:
- **`src/data/pricing.json`** — all 4 membership offerings rewritten **verbatim from the old-site cards**: Half Days £275/mo "per month · AM or PM" +£25 large dogs (booked & invoiced for you, hot towel wash, monthly bath & brush w/ maintenance trim, priority boarding, **half-price** Full Dog Grooming); Tier 1 £375/mo +£25 (adds Full-Day School, **free pick-ups & drop-offs**, half-price grooming — the old-site card's "1 free training session/month" bullet was **removed at owner instruction same day**); Tier 2 £750 bi-monthly **largeDogSurcharge now `0` (was null) — "+£0 for large dogs" is a selling point** (FREE Full Dog Grooming, **TWO free training sessions/cycle — owner corrected same day from the old card's four; aggregation parenthetical dropped with it**); Grooming Subscription £25/mo (eligibility "Available to our regular grooming dogs.", online booking code, reminders, **free pick ups and drop offs**, monthly maintenance OR full groom, free nail clipping). Eligibility fields now carry the full availability sentences.
- **⚠️ POLICY REVERSAL (owner 2026-07-04):** this reinstates *free pick-ups & drop-offs* as a **membership Tier 1/Tier 2 + Grooming Subscription perk**, partially superseding the 2026-07-02 "£1/journey for everyone, not free even on membership" decision. **£1/journey still stands for pay-per-day day school** (estimator extras unchanged). Recorded in `docs/page-specs/12-homepage.md` (both the fact-fix table row and §Built-alongside bullet) so a future session doesn't "reconcile" membership back to £1.
- **`src/pages/index.astro`** `#MembershipPlans` cards — removed the `.slice(0, 3)` feature truncation (ALL features now render), added the large-dog surcharge line (`typeof plan.largeDogSurcharge === 'number'` — deliberately NOT truthiness, so Tier 2 renders "+£0 for large dogs"), added the per-card eligibility sentence, reworded the section intro (grooming subscription is for grooming dogs, not school dogs).
- **`src/pages/dog-day-school.astro`** membership teaser reworded — old copy claimed "a free monthly training session" for membership generally; it's a full-day-tier perk.
- **QA:** build clean, verify-urls 47/0 failures, dist grep (stale "£1/journey pick-ups"/"Free grooming" gone), Chrome-verified on preview at desktop + emulated 390px (both changed pages), 6-agent adversarial review workflow on the diff before push.

## ▶ 2026-07-04 (night 3) — HOMEPAGE HERO SEQUENCE: photo → storm particles FORM THE LOGO → hero film fades in

Owner spec: keep the hero image + cloud particles, make the "random dots" gather into the brand logo, then start a hero video (day-school-style). Implemented in `index.astro`'s `initHero3D`:
- **Shader:** new `aLogo` attribute + `uLogo`/`uColorLogo` uniforms — third morph target on the existing scattered→calm mix; wobble/size damp toward the logo, colour → bright honey `#efc987`.
- **Logo targets:** brand `logo.png` sampled at ≤260px (alpha>120, luminance≤215 → skips the white card, keeps dog/fairy/text; ~17.5k points; verified visually — legible logo at 3,800 particles). Mobile COUNT raised 1800→2600 for text fidelity.
- **Timeline (QUICKENED same night, owner: "video within ~2s"):** settle 0.1–0.8s → logo forms 0.55–1.55s (~1s) → short beat → `play()` at ~2.0s, video fades in 0.8s, canvas fades out (render loop STOPS after — `stopped` flag in `sync()`). Video `.load()` fires at init so it's buffered by entry. Sequence verified end-to-end in a FOREGROUND browser tab (video playing, opacity 1, 0 console errors).
- **Video:** `public/media/home-hero.mp4` (1.8 MB, 12.2s loop) cut from the montage's UNUSED second half (lane pack-walk 123-128 → van-crate staffie 139-142.5 → apricot poodle run-in 149.5-154) — zero overlap with the day-school hero. `<video data-home-hero-video data-hero-media>` under the canvas (inherits scroll parallax).
- **Fallbacks:** reduced-motion/save-data = static photo (unchanged); logo sampling fails → settle + video at 3s; autoplay refused → formed logo stays; no WebGL → photo.
- **⚠️ Automation-tab caveat (again):** rAF throttling + background-media power policy mean the sequence can't be watched via the Chrome tools — verified instead via state probes (video.load() fired = logo phase ran; 0 console errors) + a 2D-canvas simulation of the exact sampling (screenshot in session). OWNER should watch it on a real device.

## ▶ 2026-07-04 (night 2) — PAGE 10 /contact BUILT + LIVE, licence certificate as trust centrepiece

Owner-initiated (follow-on from the council-rating rollout): `/contact` built per the WEBSITE-PLAN baseline — prominent call + WhatsApp icon cards, email/address/hours (Maps link), **collapsible direct-lines directory** (emergency/ops/grooming/training/pickups from `business.phones`, with response-time notes; dead 07842 nowhere), full `EnquiryForm` (`service="General enquiry"`), team photo (names/roles STILL owner-pending per baseline). **Trust centrepiece:** the framed council licence certificate photo (`src/assets/pages/contact/licence-certificate.jpg`, from owner 2026-07-04) + `CouncilRating` badge + facts (15 boarders / 55 day-care max, valid to 10 Dec 2028) + **"Verify us on the council register" → https://www.hastings.gov.uk/licensing/animal/register/**. LocalBusiness JSON-LD on the page (plan: home+contact). Nav: **Contact added to header (6 links) — the raw phone number was REMOVED from the desktop nav to stop two-line wrapping** (phone still in drawer/footer/contact page); Contact also in footer Explore. verify-urls 47 URLs 0 failures (4 planned left: pages 4-7).

**📼 2026-07-04 (night): the `site-videos\` batch (13 clips) was PROCESSED + INTEGRATED — see the "trust videos" section below.** Placements shipped: day-school hero (recut from the owner's montage — owner kept the WebGL storm on the homepage), B&T proof film (click-to-play `bt-town-training.mp4`, 27 MB, replaces the body-cam placeholder card), B&T involvement loop, intensive day-school-section loop, homepage reassurance loop (all `video[data-src]` polaroids driven by `src/scripts/videoLoops.ts` — IO lazy-play, poster-only for reduced-motion/save-data; NB muted loops WON'T play in a backgrounded automation tab — Chrome power-saving — that's environmental, not a bug). **IN RESERVE (not yet placed):** both golden-puppy clips + both puppy-class clips (earmarked for the /puppy-training-classes build), `web3` + `Training1` + `Parklandscape` montages, and the oversaturated `Training-new-home` staff clip. `day-school-hero-new\` folder is now moot (hero came from the montage).

**📼 STANDING CHECK — owner video drop folders.** The owner drops new raw clips into `Videos\_owner-dropins\<purpose>\`. At session start, glance at `Videos\_owner-dropins\` for new files; process via the FFmpeg pipeline (`docs/video-hero-pipeline.md` — tonemap HLG→SDR, grade, trim, compress, poster) before anything ships. Raw clips are gitignored and must NEVER be committed (100 MB limit) or copied raw into `public\media\`. Currently expected:
- `day-school-hero-new\` (created 2026-07-04) — replacement day-school hero.
- `site-videos\` (created 2026-07-04) — a BATCH of trust-building videos for site-wide placement. Owner will designate the homepage-hero and Dog-School-hero clips (by filename prefix `HOMEPAGE-HERO…` / `DAYSCHOOL-HERO…`, or by message); the REST are for Claude to review, analyse and place wherever they best build trust/credibility across the site (owner brief 2026-07-04: videos = psychologically high-trust markers). Review each clip's content before choosing placements; check client-dog consent posture (memory: client-dog media is consent-gated) before publishing any dog that isn't already public.

## ▶ 2026-07-04 (evening 3) — 5-star council rating + licence display LIVE site-wide (`9eb6230`)

Owner requirement: as a licensed premises the licence number **WK/202503477** must be displayed; old site showed a 5-star footer graphic. Facts now in **`business.licence`** (`{number, authority: 'Hastings Borough Council', rating: 5}`) — new **`src/components/CouncilRating.astro`** renders the badge (SVG gold stars in the honey palette, for dark backgrounds; props: `licence`, `align`, `size`). Placements: (1) **Footer, every page** — centred badge + licence number + one-line 2018-Regulations sentence (the legal display); (2) **Board & Train** — "Care within a regulated framework" pine-900 panel at the end of the problem section (badge + inspected-by-council + 2018 Regs + "independently checked, not just promised") **+** "5-star council-licensed premises" first trust-strip item (strip now 4 items, `sm:grid-cols-2 lg:grid-cols-4`); (3) **Homepage** — same trust-strip treatment. Terms-page clause cross-refs also corrected same day (owner-approved: 18→20, 20→18/21-23, 23→22, 32→31; `267c10c`). All live-verified incl. footer on blog pages.

## ▶ 2026-07-04 (evening 2) — NEW blog post (Careers category) + PAGE 11 /terms-and-conditions BUILT — both LIVE

1. **New original blog post** `/animal-management-qualification-jobs` (owner-written, published 2026-07-04, `a9c9e50`): employer's view on animal management qualifications. Added a **5th blog category `Careers`** (content.config enum + hub filter list in blog.astro — the hub's category array is hard-coded, remember to extend it for any new category + add a CTA entry in `[slug].astro` `ctas` or the build renders `cta.heading` of undefined). Careers CTA → day school + enquire. Hero = `doggy-friends` (already public on /dog-day-school — no new consent exposure). Internal links (day school/boarding/grooming) + external source links (BIAZA, UK Pet Food, NCS, legislation.gov.uk DDA 1991 c.65 / HSWA 1974 c.37 / SI 2018/486) added.
2. **Page 11 `/terms-and-conditions` BUILT** (`64b695c`, owner request — "they are important for our service"): legal copy **verbatim** from `fairytails-image-archive/terms-and-conditions/copy.md` — quality policy, full 36-clause daycare agreement, grooming-terms button → `https://fairytailsdoggrooming.co.uk/terms-and-conditions/`, 4-stage learning block, section-3 note. **Only 3 artefacts fixed** (stray "Here's a revised version of clause 12:" line removed; ETIRE→ENTIRE; Aquisition→Acquisition) — clause cross-reference oddities (18→21, 20→"22 to 24", 23→23, 32→32) left AS-IS, flagged to owner. Footer "Terms and conditions" link restored. No GSAP on this page (deliberate — legal page, always fully visible). verify-urls: 47 URLs, 0 failures, 5 planned left (pages 4-7 + /contact).
3. **Ops gotcha learned:** after `git push`, `gh run list --limit 1` can race the new run and return the PREVIOUS (already-green) run — poll for the run whose headSha = the pushed commit before watching, or you'll "verify" a deploy that hasn't happened.

## ▶ 2026-07-04 (late) — Day-school estimator: optional extras + Flexi Pass note; header/drawer polish — ALL LIVE

Owner-driven batch, each piece deployed + live-verified same day (deploys `dc7ae01`, `571977c`, `3d4c1c2`; the Hostinger FTPS action intermittently fails with `Timeout (control socket)` — just `gh run rerun <id> --failed`):
1. **Estimator optional extras** — Sniffari walk (£5/day), Morning pick-up + Home drop-off (£1/journey each, one journey per attended day) as switch toggles; itemised "Optional extras +£X/week" row; week/month totals include them; weekly discount applies to care only. Prices in `pricing.json.addOns`.
2. **Flexi Pass note (NEW product, owner interview 2026-07-04):** "Five Days Flexi Pass — Daycare" £99.95 = 5 full days = £19.99/day (exactly the full-day weekly rate), valid 30 days, stackable. Presented as a **smart inline note** in the estimator result panel (honey-bordered box): shows only when "Comes every week" is UNTICKED; **washed out (opacity .3) when Half day selected** (pass = full days only); **informational only — no button; NO T&Cs on site** (terms live on Acuity at purchase — owner explicitly said don't build them). Product data: `pricing.json.flexiPass`. No `offerings[]` entry (would render a plan card).
3. **Header:** Blog link removed from nav (footer-only, SEO); **Grooming** (sister site, `business.groomingSite`) added between Dog Day School and Gallery. **Mobile drawer:** contact block redesigned — "Talk to us" divider + icon-badge rows (moss phone badge "Tap to call", honey WhatsApp badge "Quickest reply"); drawer now `overflow-y-auto` + `mt-auto` (was `justify-between`, which crushed the links on small screens).

## ▶ 2026-07-04 (evening) — 📚 PAGE 8 BLOG BUILT + LIVE: `/blog` advice hub + all 19 legacy posts with their ORIGINAL 2020-2025 dates

Owner asked for the legacy blog migrated "as if built and written over time — same dates as the last website." Compact pre-build interview locked: **light tidy-up copy** (typos only, no rewrites), **visible original dates** on posts + hub cards, **all-in-one rollout**.

**Architecture (per WEBSITE-PLAN page 8):** `src/content.config.ts` blog glob collection (`src/content/blog/<slug>.md`, filename = legacy root slug; schema title/description/pubDate/updatedDate/category/heroImage/heroAlt) · `src/pages/[slug].astro` post template (build-time reserved-slug collision guard; moss-900 header w/ category eyebrow → `/blog?category=`, byline "Kamal Singh • <original date>", polaroid hero, `.post-body` prose [global.css], per-category service CTA [Puppies/Health&Care→day-school, Behaviour→intensive, Training Methods→board&train], 3 related posts, **BlogPosting JSON-LD with the original datePublished/dateModified**) · `src/pages/blog.astro` hub (legacy `<title>`+meta description preserved; category filter chips, `?category=` deep-linkable, cards newest-first with original dates) · Header nav + Footer got "Blog". GSAP entrance + scroll reveals per the standard contract.

**Content:** the original publish dates were recovered from each archived post's `page.html` JSON-LD (`datePublished` — range 2020-04-15 → 2025-08-10). 4 parallel agents converted `fairytails-image-archive/<slug>/copy.md` → collection markdown (boilerplate stripped, ~30 body/hero images copied to `src/assets/blog/<slug>/` with sanitised names, internal links root-relative, Acuity byte-for-byte, dead 07842 numbers → 01424 300668 where they appeared in body copy). **⚠️ NOTE for this machine:** the image archive lives INSIDE the repo folder at `.\fairytails-image-archive\` (gitignored) — the `..\` path in CLAUDE.md is the other machine's layout.

**Flagged for owner (left verbatim per light-tidy rule):** puppy-daycare post's "Long-lasting Friendships" paragraph ends mid-sentence (truncated on the OLD live site too — needs an ending); fear-and-anxiety post has several dangling fragments; door-reactivity post has merged task-list bullets (defect exists in the original HTML); 15-food-items has two garbled sentences. Also: dog-parks post had a mistyped variant of the dead line (07842116217) — replaced with 01424 300668, confirm OK.

**QA:** build clean (26 pages) · `verify-urls` **0 failures** (all 19 slugs + `/blog` flipped to `built`; only the 6 genuinely-unbuilt pages still WARN) · no boilerplate/07842 leakage in dist (grep-verified) · JSON-LD + visible dates spot-checked (dog-barking = 2022-03-20 ✓) · Chrome-verified on preview: hub grid + working category filters, post header/byline/hero, body typography, no broken images. (Screenshot captures kept timing out under CDP — page JS was verified alive; animations crawl in automation tabs due to rAF throttling, full speed in a real browser.)

**Deploy notes (both worth remembering):** (1) the first FTPS upload failed with `Timeout (control socket)` — transient Hostinger FTP hiccup; `gh run rerun <id> --failed` succeeded. (2) **⚠️ DNS-propagation trap: the OLD Duda/IONOS site is STILL UP on the old IPs** (e.g. `2001:8d8:100f:f000::200`), and any device/resolver with a cached pre-cutover `www` record silently gets the ENTIRE old site — looks exactly like "the deploy didn't work"/"the site rolled back". Diagnosis that cracked it: `Resolve-DnsName` (queries DNS servers directly) showed correct Hostinger A+AAAA while `curl --write-out "%{remote_ip}"` showed the actual connection going to IONOS — when those two disagree it's a stale local/ISP cache, and `ipconfig /flushdns` fixes that machine. Caches expire fully within ~24-48 h of the 2026-07-04 cutover. If the owner reports "old site showing" / "blog missing", it's THIS, not a regression. Post-flush `verify-urls --live`: **0 failures** (all 20 blog URLs 200 w/ correct dates; feeds + internal-management properly 404; breed-matcher 200).

**NEXT:** owner reviews the live blog (esp. the flagged verbatim defects + category assignments + tagline of hub "Five years of honest advice…"). Then resume standing plan (remaining pages 4-7, 10, 11; polish passes).

## ▶ 2026-07-04 (later still) — the above header work is now **COMMITTED + PUSHED + LIVE** (`1c7ea71`, Hostinger deploy green, both CTAs + Acuity link verified in the served HTML). Owner also re-taglined the homepage hero: "The dog you love / is still in there." → **"A calmer, happier dog / is in there."** (owner felt the old line could read as the love having faded; chosen from four options) — commit `9503682`, deployed + live-verified same day. Next: resume the standing plan (26 legacy blog posts — see the cutover section below).

## ▶ 2026-07-04 (later) — Header "Book Appointment" CTA added (owner request) + scrolled-mobile-menu bug FIXED. ~~⚠️ NOT committed, NOT pushed~~ **superseded — shipped, see above**

Owner asked for the old site's prominent header **Book Appointment** button back, for returning regulars, linking `https://app.acuityscheduling.com/schedule/be03d6bc`. This **partially reverses the 2026-07-02 enquiry-first header change** — the header now carries BOTH: **Enquire (moss, primary for new customers) + Book Appointment (honey, for regulars)**.

1. **`src/data/business.ts`** — new `acuity.bookAppointment` = `https://app.acuityscheduling.com/schedule/be03d6bc` (byte-for-byte, per the Acuity rule).
2. **`src/components/Header.astro`** — desktop nav: honey `Book Appointment` button added in the rightmost slot after Enquire; **the phone number link is now `hidden lg:block`** (only ≥1024 px) so the nav fits at md widths (verified no overflow at 768 px — labels wrap to two lines, acceptable). Mobile drawer: full-width honey Book Appointment button ABOVE Enquire.
3. **🐛 PRE-EXISTING LIVE BUG FOUND + FIXED — mobile menu broken whenever the page is scrolled:** `.is-scrolled` put `backdrop-filter: blur(10px)` on `[data-header]`, and **backdrop-filter makes an element the containing block for `position:fixed` descendants** — so the `fixed inset-0` mobile panel got trapped inside the ~64 px header bar (drawer rect measured h=128 px scrolled vs full-viewport at top). This survived the 2026-07-02 mobile-menu fix because it only manifests after scrolling. **Fix:** moved the scrolled background/blur/shadow onto an always-present `[data-header]::before` (absolute inset-0, z -1, opacity 0→1 on `.is-scrolled`) so the header itself never gets a filter; pseudo added to the reduced-motion `transition:none` list. ⚠️ Durable lesson (same family as the Tailwind-v4 `translate` one): **never put `backdrop-filter`/`filter`/`transform` on an ancestor of a `position:fixed` overlay.**

**QA:** `npm run build` clean · `npm run verify-urls` **0 failures** · Chrome-verified on `npm run preview`: 1440 px (button prominent, rightmost), 768 px (no overflow, phone hidden), 390 px drawer open at top AND after scrolling (full-height cream drawer, Book Appointment above Enquire), scrolled frosted header bar unchanged.

**NEXT SESSION:** owner review → **commit + push to `main`** (= auto-deploy to production www.thefairytails.co.uk via the FTP action) — changed files: `src/data/business.ts`, `src/components/Header.astro`, `HANDOVER.md`, `CLAUDE.md`. Then resume the standing plan (26 legacy blog posts — see the cutover section below).

## ▶ 2026-07-04 — 🚀 STAGE 5 CUTOVER DONE — SITE IS LIVE AT https://www.thefairytails.co.uk (production host = HOSTINGER, not GitHub Pages)

The domain migrated IONOS→Hostinger (email first, then .uk IPS-tag transfer to AXIDOMAINS; full story in `C:\Users\Kam\OneDrive\Business\CODING\Hostinger\n8n-vps-migration-handover.md`). **The original Stage-5 plan (GH Pages custom domain) was superseded by owner decision: production is Hostinger Business hosting**, addon vhost `thefairytails.co.uk`, docroot `/home/u575459407/domains/thefairytails.co.uk/public_html`.

Commit `89c0012` (pushed + deployed + live-verified):
1. **`public/.htaccess` (NEW — load-bearing on Hostinger/LiteSpeed):** 301s everything to `https://www.thefairytails.co.uk` (canonical www + HTTPS) and rewrites extensionless URLs to their `.html` files (GH Pages did this implicitly; without it every legacy URL 404s). Keep this file in every deploy.
2. **`public/robots.txt`:** preview Disallow-all → LIVE allow-all + `Sitemap: https://www.thefairytails.co.uk/sitemap-index.xml`.
3. **`.github/workflows/deploy-hostinger.yml` (NEW — THE deploy path):** on every push to `main`: npm ci → astro build → `verify-urls.mjs --dist` gate → FTPS deploy of `dist/` to Hostinger. Secrets: `FTP_SERVER` (31.220.106.186 — IP on purpose, ftp hostname is new DNS), `FTP_USERNAME` (`u575459407.ftwebsite`), `FTP_PASSWORD` (owner-set; first run failed 530 until owner reset the FTP password in hPanel). On-demand: `gh workflow run deploy-hostinger.yml`.
4. **`.github/workflows/deploy.yml`:** GH Pages preview is now **workflow_dispatch-only** (so the allow-all robots.txt never auto-reaches the preview host; preview still serves the old Disallow-all until someone manually redeploys it).

Live verification passed: apex/HTTP→https+www 301 chain, `/gallery` 200, `/puppy-classes` meta-refresh stub, robots.txt + sitemap-index.xml 200, valid SSL. ⚠️ Hostinger's `hosting_deployStaticWebsite` API endpoint 500s on this account — use the GitHub Action, not the API deploy.

**NEXT WEBSITE SESSION (owner-agreed): build the 26 legacy blog posts** — they're the `verify-urls` WARNs ("planned, not built yet"); source copy/images archived in `fairytails-image-archive/blog/`; rebuild each at its exact original URL (redirect to nearest page instead if not worth keeping). Also still pending: owner's GSC sitemap submission (property confusion — "Invalid sitemap address"; likely needs the Domain-property + full sitemap URL); GA4/GTM stage; team page content. NOTE: `fairytailsdoggrooming.co.uk` is a separate sister grooming site on the same hosting — **never redirect it here**.

## ▶ 2026-07-02 (later) — SITE-WIDE MOBILE-COMPATIBILITY FIX (owner reported "menu bar doesn't work on mobile"). COMMITTED (`12740e7`) + PUSHED + LIVE — menu open + zero overflow re-verified with touch emulation AGAINST THE LIVE PREVIEW on /, /dog-boarding-school and /gallery. (Pages deploy flaked once with a transient "Deployment failed, try again later" — `gh run rerun --failed` succeeded.)

Full mobile pass across all 6 built pages, verified with Playwright at 320/360/390/414 px (touch emulation) against BOTH the dev server and the production `dist` via `npm run preview`. Desktop verified unchanged at 1440 px (nav/hamburger/checkbox sizes/scroll width all identical). `npm run build` 6 pages 0 errors · `npm run verify-urls` 0 failures. **4 fixes, 9-line diff:**

1. **Mobile menu never opened (the reported bug)** — `Header.astro`: the drawer's Tailwind v4 `translate-x-full` utility sets the CSS **`translate` property**, but the `.is-open` rule tried to cancel it with `transform: translateX(0)` — a different property — so the backdrop dimmed but the drawer stayed off-screen on every page. Fix: open-state rule → `translate: 0 0` and the drawer transition → `transition: translate …`. ⚠️ Durable lesson: **Tailwind v4 `translate-*`/`scale-*`/`rotate-*` utilities use the native CSS properties, not `transform`** — any CSS meant to override them must set the same property. (A confusing wrinkle while verifying: the long-running dev server mixed pre-edit and post-edit copies of the scoped Header CSS across ClientRouter swaps → menu appeared broken again after nav; dev-only artifact, gone after a dev-server restart and absent in the prod build.)
2. **24 px horizontal overflow on Board & Train + Intensive (+ latent on Day School)** — the week-by-week steps' GSAP entrance (`gsap.from(step, {x: 40})`) holds every below-fold step 40 px right of its slot; on mobile the near-full-width steps genuinely widened the page to 414 at a 390 viewport (page could be dragged sideways). Fix: `overflow-x-clip` on the `[data-regime-list]` / `[data-day-list]` wrapper in all three pages (animation unchanged — steps now slide in from behind the section edge).
3. **Homepage Breed Matcher embed unusable on phones** — the tool's intro is ~893 px tall inside a 600 px iframe, so the **Start button was stranded below an invisible iframe-internal scroll**. Fix: `index.astro` iframe → `h-[900px]` mobile, `sm:h-[680px]` (desktop untouched); Start button verified visible in-frame at 390 px.
4. **Enquiry-form checkboxes small for touch** — `EnquiryForm.astro` concerns checkboxes → `h-5 w-5` + `py-1` row padding on mobile, `sm:` reverts to the exact previous desktop sizing.

Also verified at mobile widths, no changes needed: gallery mosaic/filters/lightbox (48 px controls, tap-tested), Day School estimator, hero sections, enquiry form fields (16 px font — no iOS zoom), consent banner, footer, standalone `/breed-matcher/`. Env note: this session's machine is **arm64** and needed the HANDOVER-documented `npm i --no-save @rollup/rollup-win32-arm64-msvc@4.61.1 @img/sharp-win32-arm64@0.34.5` (package.json/lockfile untouched). **Next: owner review on a real phone → commit + push** (6 files: Header, EnquiryForm, index, dog-boarding-school, intensive-dog-training, dog-day-school).

## ▶ 2026-07-02 — Page 12 (HOMEPAGE) BUILT — initial version (content + design + motion + WebGL). NOT yet committed/pushed.

Built the **flagship homepage** (the LAST page in the inside-out order) at the owner's request ("make it the strongest page… interview me first"). Full **4-round, 16-question pre-build interview** → **`docs/page-specs/12-homepage.md`** (the authoritative spec + BUILD STATE log). Page at **`src/pages/index.astro`** (replaces the old holding stub), mirroring the Board & Train reference.

- **Locked interview decisions:** enquiry-first (every path → the form) · **transformation-story hero** (anxious → calm) · lead audience = **owners of struggling dogs** · warm parent-to-parent voice · **two tracks** ("Training that transforms" vs "Day-to-day care & the club") · extras bundled into one **"life in the club"** section · **Breed Matcher inline** (iframe) for extra value · proof = **photos & daily life** (gallery) · media **reuse-now-swap-later** · differentiator = **whole-dog club (A–Z)** · **named founder + team** (owner to supply) · kept: IKEA-bookcase analogy, "1066 country premier club", both commitment badges, doggy events.
- **Signature moment = a real WebGL hero** (`three` added as a dep): a lazy-loaded (dynamic `import('three')` after first paint) **particle "settling storm"** that resolves anxious→calm, layered over a static countryside photo. **Skipped for reduced-motion / data-saver / no-WebGL → the static photo hero stands alone** (LCP-safe, SSR-rendered). Pauses when the hero scrolls off-screen or the tab hides; disposed on `astro:before-swap` with nav-staleness guards.
- **Sections (11):** 3D hero → reassurance ("we've helped dogs like yours") → whole-dog club → **Track 1 (Board & Train/Intensive lead + full range grid, `#Trainingplans` anchor)** → **Track 2 (day school + membership, `#MembershipPlans` anchor)** → **Breed Matcher inline** → daily-life proof rail + credibility bar → IKEA-bookcase honesty → life in the club → about/founder → enquiry form + location. Anchors are exact-case (GH Pages case-sensitive). All prices render from `pricing.json`; JSON-LD `LocalBusiness` on the page.
- **⚠️ Two SITE-WIDE fact fixes shipped (owner, 2026-07-02):** (1) **dog walking = £5/walk, not £2** (`pricing.json` day-full + day-half-am; `dog-day-school.astro` add-ons line); (2) **pick-ups = £1/journey for EVERYONE — nothing "free"** (`pricing.json` membership Tier-1 "Free pickups" → "£1/journey pick-ups & drop-offs"; day-school membership-teaser copy reworded off "free walks/pickups"). **Header CTA changed site-wide: "Book Appointment" (Acuity) → "Enquire" (`/#enquire`)** per the enquiry-first decision (affects all live pages).
- **QA:** `npm run build` → **6 pages, 0 errors**; `npm run verify-urls` → **0 failures**. Browser-verified on the dev server (hero, reassurance, tracks render; **no console errors**; Breed Matcher iframe wiring confirmed — dev-server 404s on the `/breed-matcher/` dir-index so the iframe `data-src` uses the explicit `/breed-matcher/index.html`, which works in dev AND prod; the tool renders "Find Your Breed"). GSAP/ScrollTrigger reveals freeze in a *hidden* automation tab — a background-throttle artifact, not a bug (identical to the live B&T hero); a focused user sees full motion.
- **Adversarial review workflow** (7 agents, 6 dimensions + triage) → **14 verified findings; 12 fixed** (honesty: removed unverified "five-star" → "well-loved" + TODO with the audited 4.9★/61; LCP `fetchpriority=high`; WebGL off-screen pause + nav-staleness gen-token/`isConnected` guards; social-walks price from data; meta desc trimmed to ~155; reduced-motion gate for `animate-bounce` in `global.css` [fixes B&T too]; drag-rail keyboard a11y + hint contrast bark-400→500; iframe `<noscript>` fallback; `mm.revert()` on before-swap; JSON-LD telephone → E.164). **2 deferred:** `og:image` + JSON-LD `image` (need a designed 1200×630 OG card — polish follow-up).
- **Owner inputs still needed (placeholders in place, swap before sign-off):** founder name + "why we started" + team names/roles/photos · one real transformation dog (with consent) · exact qualifications/accreditation body/logos · real years + dogs-trained number · confirmed review rating/count · fresh homepage hero media (optional) · pick/approve the hero headline + SEO title/description · a 1200×630 OG card.
- **STATUS: COMMITTED (`57d9a99`) + PUSHED + LIVE on the preview (2026-07-02).** Pages deploy run `28611528666` succeeded and was verified serving **200 at https://fairytails123.github.io/** — hero headline, both tracks, exact-case `#Trainingplans`/`#MembershipPlans`, `LocalBusiness` JSON-LD, the Breed Matcher embed, and the `£1/journey` pickup line all present; the `£5` dog-walking fix confirmed live on `/dog-day-school`. Next: owner review (desktop + phone) → swap soul content → polish pass (Lighthouse ≥90 / a11y / reduced-motion audit) → live enquiry-form n8n test (service defaults; CORS from a real browser) → sign-off → tick tracker row 12 → **site feature-complete → Stage 5 cutover checklist**.

## ▶ 2026-07-01 — Page 9 (Gallery) BUILT + PUSHED + LIVE on preview (awaiting owner sign-off + polish)

Built **out of the inside-out order at the owner's explicit request.** Pre-build interview (in-chat) → **`docs/page-specs/09-gallery.md`**. Page at **`src/pages/gallery.astro`**, mirroring the Board & Train reference.

- **Design/interaction:** curated **editorial mosaic** (square tiles + 2×2 feature tiles), **GSAP-Flip theme filters** (All / Playtime / Out & about / Training / Portraits with live counts), **full-screen lightbox** (prev/next, keyboard ←/→/Esc, swipe, focus-trap, scroll-lock, neighbour preload), hero band with Ken-Burns/parallax, enquiry CTA. All reduced-motion gated; single `data-galleryInit` guard; keydown scoped to the lightbox (no nav leak); `astro:before-swap` cleanup.
- **Photos = 50 grid + 1 hero**, from THREE owner-provided sources, interleaved (round-robin) with feature tiles spaced evenly:
  1. **10 already-public** shots (from the harvest, 800px squares).
  2. **24 client day-care photos** from the owner's **ImgBB** library (via the `session_photos` tab of their marketing-automation Google Sheet). Portrait; centre-cropped in tiles, full in lightbox.
  3. **16 training-in-action photos** from the owner's **Jotform "Training Report"** form (`240177109303044`, EU; 3,018 submissions, "My Photo in Training" field). Full-res (~5 MB) downscaled to lean webp; curated for **real-world location variety** (café settling, high street, park, seafront, Rock-a-Nore fishing huts, the barn/field, even a dog settling on a bus). These strengthen the Training + Out & about themes.
  - Three vision-curation workflows ran (16 harvested; 69 ImgBB → 24; 114 Jotform → 16), each producing alt text + captions.
  - **Update 2026-07-01 (owner request): removed all 14 Halti/head-collar shots and replaced them with 14 town/seafront/countryside `scenes`** (4th array; Jotform, screened to exclude head collars + rotated). Composition now **7 already-public + 19 client + 10 training + 14 scenes = 50** (Out & about 21 · Training 12 · Playtime 9 · Portraits 8). Unused harvested squares (gallery-4/6/12/13/14) also dropped. If more Halti shots surface, delete the entry from its array in `gallery.astro` + `git rm` the asset.
- **⚠️ Consent:** the ImgBB source is the **`session_photos` tab of the owner's consent-gated social-media automation sheet** (`docs.google.com/.../1nctIh0ICD...`) — its consent tab marks every real dog `pending` (only a `__TEST_DOG__` is `approved`). The Jotform photos are client dogs' training-report images. Building **paused to flag the ImgBB consent gate**; the **owner confirmed (2026-07-01) they have consent** to use both the ImgBB and Jotform photos on the public website. Captions use **dog first names only**. If consent for a dog changes, delete its entry from the `client`/`training` array in `gallery.astro` and rebuild.
- **Wiring:** `Header.astro` nav + `Footer.astro` link (Gallery); `verify-urls.mjs` `/gallery` → **built**. Final asset set (after the swap) in `src/assets/pages/gallery/` = **51 files**: 7 `gallery-*.webp` + hero `gallery-15.webp` + 19 `client-*.jpg` + 10 `train-*.webp` + 14 `scene-*.webp`. `npm run build && verify-urls` → **0 failures** (50 images optimised).
- **Env note (same class as Page 2's):** this session's node is **x64**, but the junction `node_modules` only carried **arm64** native binaries → installed `@rollup/rollup-win32-x64-msvc@4.61.1` + `@img/sharp-win32-x64@0.34.5` `--no-save` (package.json/lockfile untouched). If a future session can't build, install the arch-matching rollup + sharp binaries.
- **QA:** browser-verified on the dev server (hero, mosaic, filters, lightbox) + live after each push. **11 real bugs found & fixed:** 3 in QA (lightbox backdrop rAF-gating → CSS-driven + `setTimeout` fallback; reduced-motion double-init; `document` keydown leak → scoped to lightbox) + 4 from an adversarial code review (lightbox permanently `aria-hidden` → toggled; stale close-timeout on quick reopen → cancelled; background not `inert` while modal open → inert; `gsap.matchMedia` not reverted on nav → reverted) + the 14 head-collar photos removed (owner request) with a head-collar screen on the replacements. (The other 4 were minor build/asset cleanups.)
- **✅ COMMITTED + PUSHED + LIVE (2026-07-01).** Two commits on `main`: **`b07f747`** (build the page, 50 photos) + **`d7443df`** (swap Halti/head-collar shots → town/seafront/countryside scenes). GitHub Actions Pages deploy succeeded both times; **verified live at `https://fairytails123.github.io/gallery`** (200, 50 tiles, filters, lightbox, scene assets serving; Gallery nav link on every page).
- **Open before sign-off:** owner bug-check on the live preview (desktop + phone; confirm each dog's crop/curation is acceptable — a few kept shots wear a neck collar/body harness, which is fine, only muzzle-strap Haltis were removed); optional higher-res client originals (lightbox tops out ~960 px for the ImgBB set; the Jotform scenes are sharper); polish pass (Lighthouse ≥ 90 / reduced-motion / per-page SEO + JSON-LD); sanity-check the now-longer header nav (4 service links + Gallery) at tablet widths. Plenty more town/seafront/action shots available in the Jotform pool (3,000+ reports) if the owner wants more.

## ▶ 2026-06-30 — Page 2 (Intensive Dog Training) BUILT (content + design + motion; awaiting owner review + polish)

Pre-build interview done → **`docs/page-specs/03-intensive-dog-training.md`** (final spec + BUILD STATE log).
Page built at **`src/pages/intensive-dog-training.astro`**, mirroring the Board & Train reference.

- **Identity:** the **day-only sibling of Board & Train** — same TAR programme **minus overnight boarding**; the dog attends full day school by day, home every night, parent training from week 5. Slug `/intensive-dog-training` preserved.
- **Signature interaction:** the **week-by-week scroll-story** (reuses Board & Train's trail/paw mechanic) — currently an **8-step skeleton**; owner to supply the real week content.
- **Sections:** hero (interim video) · TAR-method (verbatim) · 4 "how it helps" cards (verbatim) · week-by-week · day-school-included (→`/dog-day-school`) · staying-involved (daily handover + weekly summary + wk-5 parent training) · pricing (2 cards) · **CER science under `#ConditionedEmotionalResponse`** (verbatim, exact case) · eligibility + day-only kit · proof (4 gallery cards + placeholders) · 4-step process (verbatim) · enquiry form (`service="Intensive Dog Training"`).
- **Owner decisions baked in (interview 2026-06-29/30):** £2,000/2mo all-inclusive of day school (taster folded into intake); puppy £1,200/1mo, **local pups ≤18 weeks**, full day school (= puppy Board & Train minus overnight); daily handover + weekly summary + wk-5 parent training (replaces boarding-only body-cam/visits); reuse-B&T-minus-residential eligibility + DHP/Lepto/Kennel-Cough; custom hero footage to come.
- **Data fix:** `pricing.json` `puppy-intensive` — removed false "Boarding included", eligibility → "Local puppies up to 18 weeks".
- **Media (interim, graded via `ffmpeg-static`):** hero `public/media/intensive-hero.mp4` (1.6 MB, 1280×720, from the legacy `Parklandscape_V4` countryside clip — SDR, no tonemap) + poster. Photos in `src/assets/pages/intensive-dog-training/` (8 harvested webp; ChatGPT/WhatsApp images dropped).
- **Wiring:** `Header.astro` nav link (between Board & Train and Dog Day School); `verify-urls.mjs` (`/intensive-dog-training`→built); cross-link on `dog-boarding-school.astro` → Intensive; `WEBSITE-PLAN.md` tracker row 2 updated. `npm run build && npm run verify-urls` → **0 failures**.
- **Env note:** local build needed `@rollup/rollup-win32-arm64-msvc@4.61.1` installed `--no-save` (this machine is **arm64**; the shared junction `node_modules` only had x64 binaries). CI (Linux) unaffected; `package.json`/lockfile untouched. *(If a future session can't build on this machine, re-run that install.)*
- **Open before sign-off:** owner bug-check on preview; real **week-by-week content** (skeleton now); **case study + testimonial**; **custom hero footage**; parent-training/weekly-summary specifics; SEO approval; then polish (Lighthouse / reduced-motion / **Service JSON-LD**) + enquiry-form live n8n test.

## ▶ 2026-06-29 — Page 3 (Dog Day School) BUILT (content + design + motion; awaiting owner review + polish)

Pre-build interview done → **`docs/page-specs/02-dog-day-school.md`** (final spec + BUILD STATE log).
Page built at **`src/pages/dog-day-school.astro`**, mirroring the Board & Train reference, with the
`frontend-design` skill's craft applied inside the locked countryside-editorial system.

- **Signature interaction:** scroll-driven **"a day in the life" timeline** (dawn→dusk honey trail with a
  rising/setting **sun** marker, owner's updated timetable). **Plus an interactive cost estimator** (full/half × size × days/week ×
  "comes every week" → live per-day/week/month from `pricing.json`). Both verified live on the local
  preview (estimator maths checked: Half/Large/5/weekly = £19.99 · £99.95 · £433).
- **Owner decisions baked in:** acceptance-gated CTA (enquiry for new + Acuity for regulars); membership
  teaser→`/membership-plans`; boarding moved OUT to Board & Train (`/boarding-information`→`/dog-boarding-school`);
  **PM half-day removed**; "teaching basic commands" dropped; **£12.50 taster** assessment; vaccinations
  **DHP/Lepto/Kennel-Cough** + **females-in-season excluded**; warm-framed criteria; kit list unchanged;
  contact = main line 01424 300668; approved SEO title/description.
- **Media (harvested, graded via `ffmpeg-static`):** hero loop `public/media/day-school-hero.mp4` (1.7 MB,
  from the "arrivals" clip) + poster; proof clip `day-school-promo.mp4` (3.2 MB) + poster. Photos in
  `src/assets/pages/dog-day-school/` (AI ChatGPT image + vegetable stock photo dropped).
- **Data/config:** `pricing.json`, `astro.config.mjs` (boarding redirect), `verify-urls.mjs`
  (`/dog-day-school`→built), `Header.astro` (nav link added), `WEBSITE-PLAN.md` (tracker ticked).
  `npm run build && verify-urls --dist` → **0 failures**.
- **LIVE on the preview** — committed `c59ca9f` + pushed to `main` 2026-06-29; Pages deploy succeeded,
  verified `https://fairytails123.github.io/dog-day-school` → 200 (timeline + estimator present).
- **Site-wide contact fix shipped (2026-06-29):** the dead **`07842 116216`** line was removed
  everywhere (business.ts `textLine` deleted; Header/Footer/EnquiryForm/Board & Train repointed) — the
  only public number is now **`01424 300668`** (carries WhatsApp). Verified live: 0× `07842` on home,
  Board & Train and Day School. **Design elevation also shipped:** dawn→dusk gradient timeline with a
  rising/setting **sun** marker, estimator number count-up, why-us icon hover.
- **Open before sign-off:** owner bug-check on the preview; parent testimonials; any fresh footage; then
  the polish pass (Lighthouse ≥ 90 / reduced-motion / SEO+JSON-LD) and the enquiry-form live n8n test.

## 📋 Outstanding / pending work — all pages (snapshot 2026-06-29)

**Page 1 — Board & Train** (`/dog-boarding-school`, LIVE, passes a–c):
- 3 media slots still placeholder — **body-cam clips · testimonials · before/after pairs** (owner supplies; wiring steps in "▶ START HERE NEXT SESSION" below).
- Owner review of design/animation feel.
- Polish pass (d): Lighthouse ≥ 90 · reduced-motion · SEO/JSON-LD → then sign-off + tick tracker.

**Page 3 — Dog Day School** (`/dog-day-school`, BUILT + LIVE 2026-06-29):
- Owner **bug-check on the preview** (desktop + phone).
- **Parent testimonials** (currently a graceful placeholder card) + any **fresh hero/day-school photos or footage** to swap for the harvested set.
- **Polish pass:** Lighthouse ≥ 90 · reduced-motion audit · a11y · per-page SEO + JSON-LD (Service/LocalBusiness).
- **Enquiry-form live end-to-end n8n test** (service = "Dog Day School"; CORS from a real browser; read the execution).
- Optional later: a dedicated day-school **Acuity appointment type** (the "Book your days" regulars link currently uses `acuity.main`).
- Then tick **Built + Signed off** for row 3 in `WEBSITE-PLAN.md`.

**Page 2 — Intensive Dog Training** (`/intensive-dog-training`, BUILT + on preview 2026-06-30):
- Owner **bug-check on the preview** (desktop + phone).
- **Real week-by-week (8-week) content** — §5 scroll-story is currently a sensible skeleton.
- **Case study + written testimonial** (graceful placeholders now) + **custom intensive/TAR hero footage** (interim = legacy parkland clip).
- Parent-training (wk5+) cadence/location/duration + weekly-summary format; optional data rename "Comprehensive Puppy Training" → "Intensive Puppy Training".
- **Polish pass:** Lighthouse ≥ 90 · reduced-motion · a11y · per-page SEO + **Service JSON-LD** (no page carries it yet — establish here, retrofit B&T/Day School).
- **Enquiry-form live end-to-end n8n test** (service = "Intensive Dog Training"). Then tick **Built + Signed off** for row 2.

**Remaining pages to build** (tracker order, inside-out): **4** `/puppy-training-classes` (NEXT) · **5** `/training-plans` · **6** `/membership-plans` (Day School's + homepage teasers link here) · **7** `/puppycourse` · **8** `/blog` + 19 posts · **10** `/contact` (needs team names/roles/photos) · **11** `/terms-and-conditions`. **BUILT out of inside-out order:** **9** `/gallery` — **BUILT + PUSHED + LIVE 2026-07-01** (review + polish pending) · **12** `/` **HOMEPAGE — BUILT + PUSHED + LIVE 2026-07-02** (initial version; content+design+motion+WebGL + inline Breed Matcher; commit `57d9a99`, deploy verified 200; soul content + polish pending — see top section). *(So every "core" page and the flagship are built; only the content/utility pages 4–8, 10–11 remain.)*

**Site-wide / deferred:**
- **Telegram** destination for enquiry alerts — n8n workflow ready for the node; owner to choose a destination.
- **GTM:** add a History-Change trigger so `page_view` fires on ClientRouter (view-transition) navigations (Stage 4).
- **Stage 4:** GA4/GTM login session (GA4 id still empty in `business.ts`).
- **Stage 5 cutover:** add `public/CNAME`, flip `robots.txt` to allow, run `verify-urls --live`; only then can the repo be renamed.
- **Breed Matcher** (LIVE at `/breed-matcher/`): repoint its `FT={…}` service links from the old domain to new-site paths as pages ship; Phase-1 dataset expansion (roadmap in `tools/breed-matcher/CLAUDE.md`).

**⚠️ Contact-data note (2026-06-29):** `business.ts` no longer has a `phones.textLine` key — the dead **07842 116216** line was deleted site-wide. The **only public number is `business.phones.main` = 01424 300668** (carries WhatsApp). Use `business.phones.main` for any call/WhatsApp link on future pages; never reintroduce 07842.

**Last updated:** 2026-07-04 (header Book Appointment CTA + scrolled-mobile-menu backdrop-filter fix, **UNCOMMITTED — see top section**; earlier same day: Stage 5 cutover LIVE on Hostinger). Earlier: 2026-07-02 (Page 12 HOMEPAGE BUILT — initial version: content+design+motion + a real Three.js WebGL "settling storm" hero + inline Breed Matcher + two tracks; **two site-wide fact fixes shipped** [dog walking £5 not £2; pick-ups £1/journey for everyone, no "free"]; header CTA → enquiry-first; build 0 errors, verify-urls 0 failures; 7-agent adversarial review 12/14 fixed; **COMMITTED `57d9a99` + PUSHED + LIVE** (Pages deploy verified 200 at https://fairytails123.github.io/) — see top section. Earlier: 2026-07-01 Page 9 Gallery BUILT + PUSHED + LIVE — 50 photos, consent-confirmed, commits b07f747 + d7443df. Earlier: Page 2 Intensive + Page 3 Day School BUILT on preview; site-wide contact fix; Breed Matcher 2026-06-20 below) · **Status: Page 12 (Homepage) BUILT + PUSHED + LIVE (soul content + polish + owner review pending); Page 9 (Gallery) LIVE (review pending); Page 2 (Intensive Dog Training) BUILT + on preview (review + polish pending); Page 3 (Dog Day School) BUILT + LIVE (review + polish pending); Page 1 (Board & Train) passes a–c LIVE, paused for 3 owner media slots + polish. Stage 0 + Stage 1 done. 2026-06-18: the owner's real HERO video is BUILT, graded, compressed, installed, committed (70ee6fc), pushed, and **DEPLOYED LIVE** — Pages deploy succeeded and verified serving on the preview (`/media/board-train-hero.mp4` = 1,913,946 B, poster = 254,931 B, page 200 at https://fairytails123.github.io/dog-boarding-school). The other 3 media slots (body-cam, testimonials, before/after) still pending. Then refinements + polish pass (d).**

> **2026-06-18 — Hero video produced (see "▶ START HERE" §, "Hero DONE" note).** The owner had dropped a **405 MB / 3:57 raw** `board-train-hero.mp4` straight into `public/media` (over GitHub's 100 MB file limit → would break the push). It was a concat of the same training session as the 25 raw HLG clips in `Videos\`. Replaced with a polished 12 s cut; the owner's oversized raws are **preserved** in `Videos\_owner-dropins\`.

> **2026-06-12 incident (resolved):** the deploy repo was renamed away from `Fairytails123.github.io`, which broke all CSS/animation on the preview (Pages moved to a subpath, root-absolute assets 404'd). Renamed back; live preview verified 200 again. See the ⚠️ note under **Quick reference → Repo/deploy** — do not rename this repo before Stage 5.

## ▶ START HERE NEXT SESSION — owner is adding photos/videos to Board & Train

**On 2026-06-17 the owner paused to add their OWN media into Page 1's four placeholder slots.**
**UPDATE 2026-06-18 — the HERO video is now DONE + DEPLOYED LIVE** (built from the owner's own raw
clips; see the ✅ section just below). The remaining THREE slots (body-cam clips, testimonials,
before/after pairs) are still to come — the media drop-in steps further below apply to those; when
the owner sends files, do the wiring (step 6). NOTE: the owner had already dropped a **405 MB raw**
`board-train-hero.mp4` straight into `public/media` (over GitHub's 100 MB file limit — would break the
push); it's been replaced by the edited hero and the raws are preserved in `Videos\_owner-dropins\`.

### ✅ HERO video — DONE + DEPLOYED LIVE 2026-06-18

Built the real hero from the owner's **25 raw iPhone clips in `Videos\` (HEVC 10-bit, HLG HDR
bt2020, 1080p30, Cinematic mode; 19/25 carry −180° rotation → ffmpeg autorotate)**. Pipeline (all
via the bundled **`node_modules\ffmpeg-static\ffmpeg.exe`** — no system ffmpeg/ffprobe; the gyan
build has zscale/tonemap/vidstab/xfade):
- **HLG→SDR tonemap** (mandatory, else washed-out grey): `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`
- **Warm "countryside-editorial" grade**: `eq=contrast=1.06:saturation=1.12:gamma=0.99,colorbalance=rm=0.02:bm=-0.03:rh=0.04:bh=-0.05:bs=0.02,vignette=angle=PI/6`
- Selection via a 27-agent analysis workflow (frame-by-frame score + adversarial verify). **5-shot,
  ~12.3 s cut, 0.4 s crossfades**: seafront wide (opener) → Weimaraner sit on George St (hero,
  branded "BOARDERS AT WORK" vest) → beagle trot → tan dog Old Town → seafront wide (closer). The
  closer's last frame = the opener's first frame (same clip 123017) → **seamless HTML `loop`**.
- Encode: 1280×720, H.264 High, 2-pass 1200k, BT.709-tagged, `+faststart`, no audio → **1.91 MB**.
- **Poster** = the Weimaraner-sit frame (1600×900, ~255 KB) — strong static/reduced-motion fallback;
  survives mobile centre-crop. (Video opens on the seafront; the Weimaraner returns ~3 s in.)
- Working files in `Videos\_work\` (segments/out/frames); final masters in `Videos\_work\out\`.
- Installed to `public/media\` (exact drop-in names); `npm run build` + `verify-urls` → 0 failures.
- **Committed (70ee6fc) + pushed to `main` 2026-06-18; Pages deploy succeeded; verified live** —
  hero mp4 (1,913,946 B) + poster (254,931 B) serve 200 at https://fairytails123.github.io/media/.
- **Reusable runbook:** `docs/video-hero-pipeline.md` (FFmpeg via bundled `ffmpeg-static`).

**Where media lives — the two folders (this is the durable rule):**
- **Photos** → `src/assets/pages/dog-boarding-school/` — any format (jpg/png/webp); the build
  optimises + resizes. Imported at the top of the `.astro` file and rendered with astro:assets `<Image>`.
- **Videos (+ a poster .jpg)** → `public/media/` — served verbatim, referenced as `/media/<name>`.

**The four slots awaiting media** (file:line in `src/pages/dog-boarding-school.astro`):
1. **Hero video** (`<video>` ≈ lines 137–148) — ✅ **DONE + LIVE 2026-06-18**: `board-train-hero.mp4`
   (12.3 s / 720p / 1.9 MB) + `board-train-poster.jpg` (Weimaraner-sit, 255 KB), edited from the owner's
   own clips. Drop-in mechanics for any future swap still apply: replace the two files (same names) and
   it just works (else update the one `<source>` line). Recipe: `docs/video-hero-pipeline.md`.
2. **Body-cam clips** — "Watch us work" dashed placeholder (≈ lines 316–324). Empty box → needs wiring;
   clips go in `public/media/`.
3. **Testimonials** — "What our families say" dashed placeholder (≈ lines 363–367). Text (+ optional
   family/dog photo → `src/assets/...`).
4. **Before/after pairs** — "Before & after" dashed placeholder (≈ lines 368–373). Photo pairs →
   `src/assets/...` (similar framing per pair).

**The step-by-step to repeat to the owner:**
1. Gather the media — send any format; Claude converts + compresses (don't pre-shrink the videos).
2. **Photos:** Win+E → paste `C:\Users\FT Manager\OneDrive\Business\CODING\Main Website\src\assets\pages\dog-boarding-school`
   into the address bar → copy files in. Lowercase-hyphen names, no spaces (e.g. `before-after-1-before.jpg`).
3. **Videos:** paste `C:\Users\FT Manager\OneDrive\Business\CODING\Main Website\public\media` → copy files in.
   Hero keeps the exact names `board-train-hero.mp4` / `board-train-poster.jpg` to drop straight in.
4. ⚠️ **OneDrive:** after copying, each file must show a **green tick** (right-click → *Always keep on this
   device*), not a cloud icon — otherwise the build can't read it.
5. Owner tells Claude the file→slot mapping + the testimonial wording.
6. **Claude (me):** compress/convert the videos, auto-generate a poster frame per clip, replace the three
   placeholder boxes with real `<Image>` / lazy + reduced-motion-gated `<video>` (matching page conventions),
   then `npm run build` + `npm run verify-urls` (expect 0 failures).
7. Owner reviews on https://fairytails123.github.io/dog-boarding-school (desktop + phone).
8. Sign-off → commit + push to `main` → Pages redeploys (~1–2 min). (Won't hit the real domain until the
   Stage 5 cutover — the preview is where it's approved.)

**Caveat to set with the owner:** only the **hero** is a visible drop-in. Dropping files into the
body-cam / testimonial / before-after folders shows **no change until step 6 wiring** — that's expected,
not a failure. Local preview alternative: `npm run dev` → http://localhost:4321/dog-boarding-school.

## 2026-06-20 — Breed Matcher value-added tool integrated (NOT yet on homepage, by design)

The owner supplied a finished **Breed Matcher** tool (standalone `index.html` — vanilla HTML/CSS/JS,
no build step; an honest breed-matching quiz that keeps the user's chosen breed the hero and lifts the
fit score as Fairy Tails services bridge the gaps). It's now integrated into the repo so it ships with
the site **and** can be worked on in isolation.

**What was done (committed work, all verified):**
- **Tool (single source of truth):** `public/breed-matcher/index.html` — the owner's tested v1, byte-for-byte
  (engine/data/copy unchanged). Astro copies `public/` verbatim → it ships with **zero build wiring** and
  serves at **`/breed-matcher/`**. Confirmed in `dist/breed-matcher/index.html` (48,209 B, identical).
- **Isolation/dev kit (not served):** `tools/breed-matcher/` — `CLAUDE.md` (the full authoritative brief;
  auto-loads when working there), `README.md`, `test/engine.test.mjs`, gitignored `backups/`.
- **Regression harness:** `npm run test:breed-matcher` — 17/17 checks pass (the §6.6 verified behaviours
  + honesty invariants across all 96 breeds). Also ran a render smoke-test: intro / lifted result /
  hard-no / toddler-steer / no-choice paths all render correctly.
- **URL gate:** added `/breed-matcher/` (built) to `scripts/verify-urls.mjs` and taught `distFile()` to
  resolve directory-index URLs. `npm run build && npm run verify-urls` → **0 failures**, `OK /breed-matcher/`.
- **Docs:** project `CLAUDE.md` ("Value-added tools" section + the test command); `WEBSITE-PLAN.md`
  (homepage spec now **requires** featuring the matcher; tool added to the URL manifest + a Value-added
  tools section).

**Homepage:** deliberately **NOT** wired in yet — the site is built inside-out and the **homepage is LAST**
(owner confirmed 2026-06-20: "keep it in plans for building homepage later"). `WEBSITE-PLAN.md` page 12 now
mandates a prominent entry point to `/breed-matcher/` (decide link vs iframe-embed in the homepage interview).

**Known follow-ups (in the tool's brief `tools/breed-matcher/CLAUDE.md`):** repoint `FT = {…}` service links
from the old live domain to new-site paths once those pages exist; Phase 1 = extend dataset to 150+ and
review the `kids`/`guard`/`aloneTol`/`novice` values with Kam; then richer score visual + more quizzes.

**To deploy it now (optional, owner's call):** it's preview-only until the Stage 5 cutover like everything
else; pushing to `main` would serve it at `https://fairytails123.github.io/breed-matcher/`.

### STATUS AT PAUSE (2026-06-20, owner paused here)
- **Breed Matcher integration = DONE and verified** (engine 17/17, render smoke OK, ships byte-identical,
  `verify-urls` 0 failures). Nothing left to do to make it ship.
- **Git: NOT committed, NOT pushed.** All work is on disk (OneDrive-synced, so it travels to the next
  machine). New/changed files: `public/breed-matcher/index.html`, `tools/breed-matcher/**`, `.gitignore`,
  `package.json`, `scripts/verify-urls.mjs`, `CLAUDE.md`, `WEBSITE-PLAN.md`, `HANDOVER.md`. **Owner has not
  authorised commit/push** (push = live deploy to the preview) — do it next session only if asked.
- **Adversarial-review / improvement-backlog workflow:** was started then **stopped for the pause** before
  it produced output (no backlog file written). Re-running it is OPTIONAL — the tool's roadmap already lives
  in `tools/breed-matcher/CLAUDE.md` §12 (Phase 1 = extend dataset to 150+ and review kids/guard/aloneTol/
  novice with Kam; then richer score visual; more quizzes). Improvement work happens **in isolation** in the
  `tools/breed-matcher/` folder.
- **Pick-up priority is unchanged:** the main paused work is still **Board & Train (Page 1)** — owner's own
  media into the 3 remaining slots + refinement → polish (see "▶ START HERE NEXT SESSION" above). The Breed
  Matcher is a self-contained finished side-task; pick it up whenever the owner wants to grow it.

## Pick-up point for the next session

1. **Hero video is DONE + LIVE** (▶ START HERE). Ask the owner to review it on
   https://fairytails123.github.io/dog-boarding-school (desktop + phone) alongside animation
   intensity, palette/typography (Fraunces/Karla), plus the standing content checks below. Then the
   remaining THREE media slots (body-cam clips, testimonials, before/after pairs) once the owner sends
   files. They paused specifically **to refine this page**.
2. Apply refinements → then the polish pass (d): Lighthouse ≥ 90, reduced-motion audit, mobile
   review, per-page SEO/JSON-LD → owner sign-off → tick tracker → page 2 pre-build interview.
3. Owner feedback already incorporated this session: the bare content pass "didn't feel premium" —
   design + GSAP animation layers were added in response (see §5). Future pages: **never present
   a bare structure pass for review; fold design + motion in before showing, or set expectations
   explicitly.**

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
   - Hero clip: ✅ DONE + LIVE (2026-06-18). Placeholder slots still marked for: body-cam clips,
     testimonials, before/after pairs.

## Next actions (detail)

1. **Owner review checks** for the preview: animation feel/intensity · Fraunces/Karla typography ·
   moss/pine/honey palette · **the new hero video (DONE + LIVE — owner's own clips)** · drafted
   week-by-week regime copy (incl. mid-course home-break wording) · the Archie "proof, not promises"
   framing · the three remaining placeholder slots (body-cam clips, testimonials, before/after pairs).
2. **Polish pass (d)** — Lighthouse ≥ 90 (hero now 1.9 MB / 720p; watch the 114 KB GSAP chunk),
   reduced-motion check, mobile review, per-page SEO/JSON-LD, then owner sign-off + tick tracker.
   Note: GTM page_view fires once per full load — add a History Change trigger in GTM at Stage 4
   for ClientRouter navigations.
3. Page 2 (`/intensive-dog-training`): run its pre-build interview first.

## Owner inputs still open

- Page 1 (before sign-off): regime-timeline corrections · testimonial picks · before/after photos +
  body-cam clips. (Hero video clip: ✅ DONE + LIVE 2026-06-18 — edited from the owner's own clips.)
- Deferred: Telegram destination for enquiry alerts (workflow ready for the node).
- Page 9 (gallery): ImgBB + Jotform photo access **received + used 2026-07-01** (owner's
  marketing-automation sheet session_photos tab → 24; Jotform "Training Report" form
  240177109303044 → 16; consent confirmed for all used). · Page 10: team names/roles ·
  Stage 4: GA4/GTM login session · Stage 5: IONOS DNS login.

## Quick reference

- **Repo/deploy:** `Fairytails123/Fairytails123.github.io` (user site → serves at root, no base
  path; `public/CNAME` deliberately ABSENT until DNS cutover, robots.txt Disallow-all until then).
  Push to `main` → Actions → Pages.
  - ⚠️ **DO NOT RENAME this repo.** A GitHub Pages **user site must be named exactly
    `<user>.github.io`** to serve at the root. 2026-06-12 it was renamed to
    `dog-boarding-school-webpage` "to organise the repo list" → Pages flipped to the subpath
    `…/dog-boarding-school-webpage/` and **every** root-absolute asset (`/_astro/*.css|js`)
    404'd → site loaded as unstyled, animation-dead HTML. Fix = rename back to
    `Fairytails123.github.io` (Pages re-publishes at root in ~1–2 min; `git remote set-url` to
    match). The repo name only stops mattering AFTER the Stage 5 custom-domain cutover (a custom
    domain serves at root regardless of repo name). Until then, organise via repo description/topics,
    not the name.
- **Commands:** `npm run dev` / `npm run build` / `npm run verify-urls`.
- **Stack rules, URL rules, locked decisions:** see `CLAUDE.md` + `WEBSITE-PLAN.md` (unchanged).
- **Test enquiry rows:** the live test wrote one row to the `website_enquiries` data table
  (deleted after verification; executions 14236/14237 remain as evidence).
