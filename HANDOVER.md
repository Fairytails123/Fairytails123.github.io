# HANDOVER — Fairy Tails main-website rebuild

## ▶ 2026-06-29 — Page 3 (Dog Day School) BUILT (content + design + motion; awaiting owner review + polish)

Pre-build interview done → **`docs/page-specs/02-dog-day-school.md`** (final spec + BUILD STATE log).
Page built at **`src/pages/dog-day-school.astro`**, mirroring the Board & Train reference, with the
`frontend-design` skill's craft applied inside the locked countryside-editorial system.

- **Signature interaction:** scroll-driven **"a day in the life" timeline** (honey trail + paw marker,
  owner's updated timetable). **Plus an interactive cost estimator** (full/half × size × days/week ×
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
- **NOT committed/pushed** (owner authorises deploys). To let the owner review on the GH Pages preview
  (`fairytails123.github.io/dog-day-school`), commit + push to `main` when asked.
- **Open before sign-off:** owner review of feel; parent testimonials; any fresh footage; then the polish
  pass (Lighthouse ≥ 90 / reduced-motion / SEO+JSON-LD) and the enquiry-form live n8n test.

**Last updated:** 2026-06-29 (Page 3 Dog Day School BUILT — see the section above; Breed Matcher 2026-06-20 below) · **Status: PAUSED mid-Page-1, per owner. Stage 0 + Stage 1 done; Page 1 (Board & Train) passes a–c LIVE. 2026-06-18: the owner's real HERO video is BUILT, graded, compressed, installed, committed (70ee6fc), pushed, and **DEPLOYED LIVE** — Pages deploy succeeded and verified serving on the preview (`/media/board-train-hero.mp4` = 1,913,946 B, poster = 254,931 B, page 200 at https://fairytails123.github.io/dog-boarding-school). The other 3 media slots (body-cam, testimonials, before/after) still pending. Then refinements + polish pass (d).**

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
- Page 9: ImgBB access · Page 10: team names/roles · Stage 4: GA4/GTM login session ·
  Stage 5: IONOS DNS login.

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
