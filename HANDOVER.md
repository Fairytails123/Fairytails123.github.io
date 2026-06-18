# HANDOVER — Fairy Tails main-website rebuild

**Last updated:** 2026-06-18 · **Status: PAUSED mid-Page-1, per owner. Stage 0 + Stage 1 done; Page 1 (Board & Train) passes a–c LIVE. 2026-06-18: the owner's real HERO video is now BUILT, graded, compressed & installed (`public/media/board-train-hero.mp4` 1.9 MB + new poster) from their own raw clips, build + verify-urls green locally — AWAITING OWNER REVIEW/sign-off before commit+push (not yet pushed). The other 3 media slots (body-cam, testimonials, before/after) still pending. Then refinements + polish pass (d).**

> **2026-06-18 — Hero video produced (see "▶ START HERE" §, "Hero DONE" note).** The owner had dropped a **405 MB / 3:57 raw** `board-train-hero.mp4` straight into `public/media` (over GitHub's 100 MB file limit → would break the push). It was a concat of the same training session as the 25 raw HLG clips in `Videos\`. Replaced with a polished 12 s cut; the owner's oversized raws are **preserved** in `Videos\_owner-dropins\`.

> **2026-06-12 incident (resolved):** the deploy repo was renamed away from `Fairytails123.github.io`, which broke all CSS/animation on the preview (Pages moved to a subpath, root-absolute assets 404'd). Renamed back; live preview verified 200 again. See the ⚠️ note under **Quick reference → Repo/deploy** — do not rename this repo before Stage 5.

## ▶ START HERE NEXT SESSION — owner is adding photos/videos to Board & Train

**On 2026-06-17 the owner paused to add their OWN media into Page 1's four placeholder slots, and
asked to be re-walked through these exact steps first thing.** Re-explain them to the owner, then do
the wiring (step 6) once the files are in. The owner said "let me try and see what happens" — so they
may already have dropped some files in; check the two folders below before re-explaining.

### ✅ HERO video — DONE 2026-06-18 (awaiting owner review)

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
- **NOT committed/pushed** — owner reviews first (`npm run dev` locally, or push to preview on request).

**Where media lives — the two folders (this is the durable rule):**
- **Photos** → `src/assets/pages/dog-boarding-school/` — any format (jpg/png/webp); the build
  optimises + resizes. Imported at the top of the `.astro` file and rendered with astro:assets `<Image>`.
- **Videos (+ a poster .jpg)** → `public/media/` — served verbatim, referenced as `/media/<name>`.

**The four slots awaiting media** (file:line in `src/pages/dog-boarding-school.astro`):
1. **Hero video** (`<video>` ≈ lines 137–148) — *true drop-in*: replace `public/media/board-train-hero.mp4`
   + `public/media/board-train-poster.jpg` with the same filenames and it just works (else update the
   one `<source>` line). ⚠️ Compress first — current clip is 2.45 MB (Lighthouse watch item;
   `ffmpeg-static` is already installed for this).
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

## Pick-up point for the next session

1. **First:** the media drop-in above (▶ START HERE). After that media pass, ask the owner for their
   review of https://fairytails123.github.io/dog-boarding-school (desktop
   + phone): animation intensity, palette/typography (Fraunces/Karla), hero clip choice, plus the
   standing content checks below. They paused specifically **to refine this page next session**.
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
   - Placeholder slots still marked for: owner's final hero clip, body-cam clips, testimonials,
     before/after pairs.

## Next actions (detail)

1. **Owner review checks** for the preview: animation feel/intensity · Fraunces/Karla typography ·
   moss/pine/honey palette · hero clip (current = 10 s cut of the live site's own film; owner may
   supply a better one) · drafted week-by-week regime copy (incl. mid-course home-break wording) ·
   the Archie "proof, not promises" framing · the four placeholder slots (body-cam clips,
   testimonials, before/after pairs, final hero video).
2. **Polish pass (d)** — Lighthouse ≥ 90 (watch the 2.45 MB hero video + 114 KB GSAP chunk),
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
