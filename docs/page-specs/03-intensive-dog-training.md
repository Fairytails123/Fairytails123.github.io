# FINAL page spec — `/intensive-dog-training` (Intensive Dog Training)

> Produced by the pre-build interview on **2026-06-29**. This is the **final word** for page 2,
> superseding the baseline in `WEBSITE-PLAN.md` where they differ. Locked site-wide decisions
> (enquiry form = primary CTA, prices live in `pricing.json`, Acuity links byte-for-byte, warm
> parent-to-parent voice, "countryside editorial" design system) still apply. Reference
> implementation to mirror: `src/pages/dog-boarding-school.astro`.
>
> **One-line identity:** Intensive is the **day-only sibling of Board & Train** — the same
> structured behaviour-change programme (TAR method) **minus overnight boarding**: the dog
> attends **full day school by day and goes home every night**, with parent training from week 5.
> It sits one rung **above** Dog Day School (daycare/enrichment) in intensity.

## Interview outcomes (2026-06-29)

| Topic | Decision |
|---|---|
| Where it fits | **Page 2** (next service page). Slug **`/intensive-dog-training`** preserved (the SEO migration); extensionless, `trailingSlash:'never'`; already in the `verify-urls` manifest as `planned` → flip to `built` at sign-off. No legacy redirects point to/from it. Nav: insert **between** Board & Train and Dog Day School when it goes live on preview. |
| How it fits | **Near-clone of Board & Train with boarding removed.** Same guided sales arc, same components, same GSAP contract; recategorised to `training`; reframed around *home every night + full day school by day*. Links **down** to `/dog-day-school` for the day detail (don't duplicate it); Board & Train links **across** to it as the "no-boarding alternative." |
| Programme arc (Q1) | **Week-by-week scroll-story** — reuse Board & Train's signature scrolling timeline, day-school-framed (~8 weeks), **no mid-course home break** (dog is already home nightly), **parent training from week 5**. Lowest build risk + signature consistency. *Owner to supply the actual week-by-week content.* |
| Price / inclusions (Q2) | **£2,000 / 2 months is all-inclusive of daily full day school**; the 3-session day-school taster (£37.50) is **folded into intensive intake — no extra charge**. The page **links to `/dog-day-school`** for "what the day looks like" rather than restating hours/activities. (+£300 large dog, from data.) |
| Puppy tier (Q3) | **Day-only — keep on page as the puppy tier** alongside the £2,000 adult programme. Data fixed: removed false `"Boarding included"`; **full day school** confirmed (a half-day only at the very start, if needed, to settle the pup in); eligibility set to **"Local puppies up to 18 weeks"**. **Puppy Intensive = puppy Board & Train** — the same £1,200 / 1-month programme, differing only by home-each-evening (Intensive) vs overnight boarding (Board & Train). (confirmed 2026-06-30) |
| Updates / involvement (Q4) | **Daily verbal handover at pick-up + a weekly written/video summary + structured parent-training sessions from week 5.** This **replaces** Board & Train's boarding-only trust promises (body-cam daily reports, visit-anytime, Friday parent sessions). |
| Eligibility / kit (Q5) | **Reuse Board & Train's warm-framed behavioural-issue criteria minus residential**, ADD: daily attendance, **local catchment** ("available to local dogs/puppies" — verbatim), and vaccinations **DHP / Lepto / Kennel Cough** (as Day School). Day-only **kit list** = harness, water, treats (no overnight kit). Carry the honest **"TAR is effective against no more than two issues at a time"** caveat. |
| Proof (Q6) | **New Intensive-specific case study** (owner to supply) + reuse the **4 native legacy gallery cards** (New experiences · Learning development · Developing skill set · Keeping focused) + **at least one written Intensive testimonial** (owner to supply). Graceful placeholders meanwhile (Board & Train / Day School pattern). |
| Hero (Q7) | **Custom intensive video edited from owner's clips** (like Board & Train). Interim: the harvested `Intensive_Training` / `Parklandscape_V4` clips as a placeholder loop + poster, swapped for fresh footage later. |
| Booking flow | Primary (and only) CTA = **enquiry form**. The legacy external Acuity "Book Appointment" CTA is **dropped** (`intensive-dog-training.acuityUrl` is `null` in data). 4-step "how it works" mirrors the legacy: Contact us → Approve estimate → Training begins → Training ends. |
| Price correction | Legacy shows **£1,800** (and £1,200 puppy) — **£1,800 is stale; render £2,000 from data** (locked interview decision). |
| CER science | The **Conditioned Emotional Response** essay is **canonical on this page** under anchor **`id="ConditionedEmotionalResponse"`** (exact case — preserved). It absorbs the duplicate copy from `/resources-collection` (which redirects to `/puppycourse`). The later `/puppycourse` build must **not** reintroduce the identical CER block (SEO duplicate-content). |
| Voice / design | Locked site-wide — warm parent-to-parent; countryside-editorial palette/type; reuse existing component classes. |
| SEO (proposed) | Title: `Intensive Dog Training in Hastings \| The Fairy Tails K9 Centre`. Description: `Structured 1-to-1 behaviour training (TAR method) for adult dogs & puppies near Hastings — five days a week, full day school included, your dog home every night. From £2,000 / 2 months.` *(Owner to approve.)* |

## Page structure (build order top → bottom)

1. **Hero** — looping muted bg video (custom owner footage; interim harvested `Intensive_Training`/`Parklandscape_V4`; poster fallback). Eyebrow "Intensive Dog Training · Hastings"; headline around structured behaviour change / *"Real change, one repetition at a time"*; sub-line: 1-to-1 structured training, **five days a week**, dog home every night. Primary CTA **"Send an enquiry"** (anchors to form). Trust strip (3 `.paw-bullet`): TAR method — done properly, max 2 issues at a time · full day school included · home every night + parent training from week 5.
2. **The problem — what we tackle** — the behavioural issues TAR targets (verbatim seed: lead walking, recall, pull training, limited anxiety-related issues), reframed from Board & Train's problem section. State the honest scope: **TAR works on no more than two issues at a time**, adult dogs **and** puppies.
3. **The TAR method — Train · Adjust · Repeat** (signature method section) — verbatim TAR copy: success is in the **repetition** (protocols at a suitable distance, timed duration, below-threshold distractions); *Repeat – treat – Repeat – treat – Adjust – Repeat*; "sometimes known as creating a conditioned emotional response" → in-page link to §10 CER. Well-planned, structured sessions **five days a week**, led by staff.
4. **How does it help?** — the 4 cards **verbatim**: **Knowing when to stop** (short focused sessions, one behaviour at a time) · **Consistency** (every handler uses the same cues/gestures/timing/tones; trainers rotate so the dog responds to all) · **Exposure to places** (train in different environments) · **Working our way up** (gradually increase distractions; high-value treats).
5. **The programme week by week — SIGNATURE SCROLL STORY** — ~8-week day-school-framed timeline as the scroll-driven centrepiece (reuses Board & Train's trail + scrubbed paw-marker mechanic; reduced-motion → static stacked timeline). **No mid-course home break** (dog home nightly). **Parent training woven in from week 5.** *Content owner-supplied; build with a clear placeholder skeleton if not yet provided.*
6. **Day school included** — short section: by day the dog attends **full day school** (settle, walks, enrichment, rest), home every evening. **Link down to `/dog-day-school`** for the full day detail rather than duplicating it. State plainly: **the £2,000 covers all day-school days for the 2 months**; the introductory taster assessment is **part of intake** (no separate £37.50).
7. **Staying involved — updates & feedback (day-only)** — **daily verbal handover at pick-up**, a **weekly written/video summary**, and **parent-training sessions from week 5**. (This section replaces Board & Train's body-cam daily reports / visit-anytime / Friday parent sessions — all boarding-premised.)
8. **Proof — some of our doggy clients in training** — (a) **new Intensive case study** (owner-supplied; graceful placeholder); (b) the **4 legacy gallery cards** as polaroids/rail (New experiences · Learning development · Developing skill set · Keeping focused — native to this page); (c) **written testimonial** (owner-supplied placeholder).
9. **Pricing** (renders from `pricing.json`, **filter `category==='training'` AND `id.includes('intensive')`**, sort by `order`, money via local `gbp()`): **Intensive Dog Training £2,000 / 2 months** (+£300 large; counter-conditioning, full day school included, parent training from week 5) · **Intensive Puppy Training £1,200 / 1 month** (puppy tier; day-school inclusion per owner confirmation — see open items). Do **NOT** render one-to-one / classes / social-walks / free-consult (those belong on `/training-plans`).
10. **The science — Conditioned Emotional Response (CER)** — `id="ConditionedEmotionalResponse"` (exact case). Absorb the verbatim CER essay (classical conditioning, amygdala "smoke detector", counter-conditioning rewiring). The in-page "conditioned emotional response" link from §3 targets this anchor.
11. **Is it right for your dog? — eligibility & kit** — honest-but-warm accordion/checklist: behavioural-issue suitability (reuse Board & Train minus residential), **max 2 issues at a time**, **available to local dogs/puppies** (catchment), daily attendance, vaccinations **DHP / Lepto / Kennel Cough**; intact-male/females-in-season rules consistent with Day School; **day-only kit** (harness, water, treats). Not a substitute for veterinary behavioural referral where needed.
12. **How it works — 4 steps** — verbatim: 1. **Contact us** (phone/email/form — describe your dog's struggles + your aim) · 2. **Approve estimate** (we prepare a plan to review) · 3. **Training begins** · 4. **Training ends** (on time, when you're satisfied to take over). Leads into the enquiry form.
13. **Enquiry form** (primary CTA target) — `<EnquiryForm service="Intensive Dog Training" page="/intensive-dog-training" />`; locked field set; honeypot `website` + `elapsedMs<4000` fake-success; POSTs to the live n8n webhook. Closing line: main line 01424 300668 + WhatsApp.

## Built alongside this page (data, config & nav changes)

- **`src/data/pricing.json`** — **DONE:** removed the false `"Boarding included"` feature from `puppy-intensive`; set its eligibility to **"Local puppies up to 18 weeks"** (owner-confirmed 2026-06-30, full day school correct). The adult `intensive-dog-training` (£2,000/2mo, +£300, `acuityUrl:null`) is correct as-is. *Optional (not blocking): rename data `"Comprehensive Puppy Training"` → `"Intensive Puppy Training"` for on-page consistency — owner has not asked, so left as-is.*
- **`src/components/Header.astro`** — add `{ label: 'Intensive Dog Training', href: '/intensive-dog-training' }` **between** Board & Train and Dog Day School (nav grows inside-out, on ship).
- **`scripts/verify-urls.mjs`** — flip `/intensive-dog-training` `planned` → `built` on ship.
- **`astro.config.mjs`** — **no redirect change needed** (the slug is a preserved real page; nothing consolidates into it).
- **Cross-links** — add a one-line "Not the right fit? Consider **Intensive Dog Training**" callout on `dog-boarding-school.astro` (near pricing/limitations); optionally a "need deeper training? → Intensive" note on `dog-day-school.astro`. Intensive §6 links to `/dog-day-school`.
- **Assets** — page photos → `src/assets/pages/intensive-dog-training/` (from harvest, full-res, via astro:assets `<Image>`): `Intensive-Training-in-the-Country-Park`, `Puppy-Training-in-Town`, `Training-in-park`, + the 4 gallery webps (`New-Experiences`, `Learning-Development`, `Developing-skill-set`, `Keep-focused`). **Drop** the ChatGPT AI image (`ChatGPT+Image+Oct+21…`) and the stray WhatsApp image unless owner wants them. Hero video → `public/media/intensive-hero.mp4` + `public/media/intensive-poster.jpg` (cut via `ffmpeg-static`; HLG→SDR if any source is HDR — see `docs/video-hero-pipeline.md`).
- **Service JSON-LD** — author a `Service` schema block on this page (no page carries it yet); plan to retrofit Board & Train / Day School, ideally as a reusable component. Scope, not a blocker.
- **`WEBSITE-PLAN.md`** — tracker row 2 pre-build ticked; baseline #2 points here.
- **Defects auto-fixed** (site-wide rule): malformed `wa.me` links, `mailto:mymail@…` "Book Appointment" button, dead `07842 116216`, "→ `/`" empty links, no Employee Login in the public footer.

## Animation contract (mirror `dog-boarding-school.astro`)

`data-page="intensive"` root; idempotent `init()` guarded by **`data-gsapInit`** (the canonical flag — do not invent a per-page variant); all motion inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; initial hidden states in JS only (no-JS shows everything); ClientRouter lifecycle (re-init on `astro:page-load`, kill all ScrollTriggers on `astro:before-swap`); hero video `preload="none"`, lazy `.load()/.play()` after first paint, skipped for reduced-motion / `saveData`. Signature = the §5 week-by-week timeline trail (reuses the Board & Train mechanic).

## Owner inputs still open for this page (needed before sign-off; some needed before build)

- [ ] **Week-by-week (≈8-week) programme content** for the §5 scroll-story (the page's centrepiece). *Needed to build §5 fully; a placeholder skeleton can ship first.*
- [x] **Puppy tier data confirmed (2026-06-30):** full day school (half-day only at the start to settle in if needed); 18-week age cut-off (data updated); puppy Intensive = puppy Board & Train, differing only by home-each-evening vs overnight boarding. *(Optional, deferred: data name "Comprehensive Puppy Training" → "Intensive Puppy Training".)*
- [ ] **New Intensive case study** (which dog, the before→after story) + **at least one written testimonial**. *Placeholders ship meanwhile.*
- [ ] **Custom intensive/TAR hero footage** (interim = harvested clip).
- [ ] **Parent-training sessions (week 5+):** cadence, location, duration; and the **weekly summary** format (written vs video).
- [ ] **SEO title/description** approval (proposed above).

## Sign-off gates (from WEBSITE-PLAN.md)

Owner sign-off on the live preview · `npm run verify-urls` (checks `dist/`) · Lighthouse ≥ 90 (perf/SEO/a11y) · reduced-motion check · enquiry form live-tested end-to-end with the n8n execution read (CORS from a real browser).

---

## BUILD STATE (2026-06-30 — content + design + motion BUILT, builds clean + verify-urls green, awaiting owner review + polish)

**Source:** `src/pages/intensive-dog-training.astro` (mirrors the Board & Train reference, line-for-line on conventions: components, content-array frontmatter, `data-page="intensive"`, idempotent `data-gsapInit` guard, matchMedia gate, ClientRouter lifecycle, hero video lazy + reduced-motion/saveData skip).

**What's implemented vs this spec (13-section arc):** Hero (interim video) → trust strip → problem (focused issues + "max 2 at a time" caveat) → **TAR method** (verbatim) → **how it helps** (4 verbatim cards) → **week-by-week SIGNATURE scroll-story** (8-step skeleton, reuses the Board & Train trail/paw mechanic; reduced-motion → static) → day-school-included (links to `/dog-day-school`) → staying-involved (daily handover + weekly summary + wk-5 parent training) → pricing (2 cards from `pricing.json`, `category==='training' && id.includes('intensive')`) → **CER science** under `id="ConditionedEmotionalResponse"` (verbatim, exact-case anchor) → eligibility & day-only kit → proof (4 legacy gallery cards + dashed placeholders for case study + testimonial) → 4-step "how it works" (verbatim) → enquiry form (`service="Intensive Dog Training"`).

**Media (interim, graded via `ffmpeg-static`):** hero `public/media/intensive-hero.mp4` (1.6 MB, 1280×720, from the legacy `Parklandscape_V4` countryside clip — SDR, no tonemap needed) + `intensive-poster.jpg`. Page photos in `src/assets/pages/intensive-dog-training/` (8 harvested webp; ChatGPT AI image + WhatsApp image dropped). **Owner to swap in custom intensive/TAR footage (Q7).**

**Data/config/nav:** `pricing.json` (puppy boarding claim removed, eligibility → 18 weeks); `Header.astro` (Intensive nav link between Board & Train and Dog Day School); `verify-urls.mjs` (`/intensive-dog-training` planned → built); cross-link added on `dog-boarding-school.astro` (pricing section → Intensive). `npm run build` → 0 errors; `npm run verify-urls` → 0 failures.

**Env note:** local build needed `@rollup/rollup-win32-arm64-msvc@4.61.1` installed `--no-save` (this machine is arm64; the shared junction `node_modules` only had x64 binaries). CI (Linux) is unaffected; `package.json`/lockfile untouched.

**Still open before sign-off:** owner bug-check on the preview · the real **week-by-week content** (currently a sensible skeleton) · a real **case study + testimonial** · **custom hero footage** · parent-training/weekly-summary specifics · SEO approval · then the **polish pass** (Lighthouse / reduced-motion / **Service JSON-LD**) + enquiry-form live n8n test.
