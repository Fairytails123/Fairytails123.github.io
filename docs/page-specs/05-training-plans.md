# Page 5 — Training Plans — FINAL SPEC (pre-build interview 2026-07-06)

**Slug:** `/training-plans` (NEW page — no old-site equivalent; anchor `#Trainingplans` kept on the homepage so legacy links still land). Supersedes the WEBSITE-PLAN baseline for this page.
**Source data:** `src/data/pricing.json` (prices/facts = truth; never hard-code money). No harvest copy — all prose is Claude-drafted, owner corrects on preview.
**Reference implementation:** `src/pages/dog-boarding-school.astro` conventions; filter/grid interaction is a new mechanic for the site.

## Locked interview decisions (owner, 2026-07-06)

| # | Topic | Decision |
|---|-------|----------|
| 1 | **Page scope** | **Training + Board & Train = 9 plans.** The 6 `training`-category offerings (Intensive, Comprehensive Puppy, Puppy Classes, One-to-One, Social Walks, Free Consult) **+** the 3 `board-train` offerings (Boarding School for Puppies, Boarding School for Dogs, Holiday Board & Train). **Day-school daycare and memberships are NOT on this page** — they keep their own pages. |
| 2 | **Signature interaction** | **Instant filter chips** (no quiz, no "result" screen). Tappable chips live-filter the 9 cards. |
| 3 | **Filter axes** | **ALL FOUR:** Dog age · Goal/issue · Format · Budget band. |
| 4 | **Filter logic** | **Narrow (AND) + soft dim.** Selecting across axes shows only plans matching ALL selected chips; non-matches **fade/shrink, not vanish** (calm layout, minimal reflow — matters on mobile). |
| 5 | **Empty state** | If nothing matches, surface a friendly **"Not sure? Book a free consult"** card (Acuity `56694430`). |
| 6 | **Card layout** | **One flat responsive grid** of all 9 (no grouping bands). Chips do the organising. |
| 7 | **Comparison table** | **None.** Cards only (cleaner, better on phones; chips handle the "compare" job). |
| 8 | **Cross-sell** | **NONE.** No bottom cross-sell strip to Day School / Memberships / DIY course / Blog. Page ends on the free-consult CTA — deliberately focused. |
| 9 | **Card CTA rule** | **Detail page if one exists, else the plan's Acuity link, else the free consult.** (Per-plan map below.) |
| 10 | **Primary page CTA** | **Book the FREE phone consult** (Acuity `56694430`) — the low-friction "not sure which plan?" action, repeated in hero + empty state + closing band. EnquiryForm is secondary. |
| 11 | **Hero media** | **Video loop hero** (lazy `data-hero-video` pattern) cut from the March reserve clips via the FFmpeg tonemap pipeline. **Owner picks the clip** — Claude extracts candidate stills from the reserves and presents them at the hero/animation pass (needs frame extraction, so deferred out of the interview). Prefer a clip that reads as "a range of training." |
| 12 | **Copy** | **Claude drafts, owner corrects on preview** — headline, intro, and each card's one-line "best for", written from the existing site voice + pricing data; flagged as drafts. |
| 13 | **Puppy-product positioning** (owner, 2026-07-06) | **Comprehensive Puppy Training** = *trainer-led, labour-intensive* (our trainers do the heavy lifting; puppy is with us full-day). **Puppy Training Classes** = *instructional, parent-led* (we teach you; you put in the work at home). Use this to write the two puppy cards' "best for" lines and keep them clearly distinct. |
| 14 | **Comprehensive Puppy = its own page** (owner, 2026-07-06) | Comprehensive Puppy Training gets a **dedicated page, kept OUT of the nav** (nav-weight), surfaced from **homepage options** + this grid card + the puppy-classes cross-sell. So its grid-card CTA → the new page (slug TBD, likely `/comprehensive-puppy-training`), NOT the free consult and NOT `/intensive-dog-training`. |
| 15 | **Budget bands = TWO only** (owner, 2026-07-06) | `pay-as-you-go` (£0–£175) / `programme` (£1,200+). Natural price gap; no middle band. |

## The 9 plans + per-card CTA (from `pricing.json`)

| Plan (`id`) | Price | Card CTA target |
|---|---|---|
| Boarding School for Puppies (`board-train-puppy`) | £1,200 / 4wk | `/dog-boarding-school` |
| Boarding School for Dogs (`board-train-adult`) | £2,500 / 8–10wk (+£300 large) | `/dog-boarding-school` |
| Holiday Board & Train (`board-train-holiday`) | £1,500 / 4wk (+£300 large) | `/dog-boarding-school` |
| Intensive Dog Training (`intensive-dog-training`) | £2,000 / 2mo (+£300 large) | `/intensive-dog-training` |
| Comprehensive Puppy Training (`puppy-intensive`) | £1,200 / 1mo | **New dedicated page** (owner 2026-07-06) — its own off-nav Comprehensive Puppy Training page (slug TBD, likely `/comprehensive-puppy-training`); this card links there |
| Puppy Training Classes (`puppy-classes`) | £175 / course | `/puppy-training-classes` |
| One to One Dog Training (`one-to-one`) | £49.99 / session | Acuity `appointmentType=51989230` (byte-for-byte) |
| Dog Social Walks (`social-walks`) | £20 / walk | **Free consult** (existing-clients-only; no Acuity) |
| Free Phone Consultation (`free-consult`) | Free | Acuity `56694430` (this card **is** the primary CTA) |

## Filter tagging matrix (DRAFT — drives the chips; refine at build)

**Age:** `puppy` / `adult` / `any`  ·  **Goal:** `obedience` / `behaviour` / `socialisation` / `enrichment`  ·  **Format:** `residential` / `day-based` / `group-class` / `one-to-one` / `walk`  ·  **Budget:** TWO bands (owner 2026-07-06) — `pay-as-you-go` (£0–£175) / `programme` (£1,200+)

| Plan | Age | Goal | Format | Budget |
|---|---|---|---|---|
| Boarding School for Puppies | puppy | obedience, socialisation | residential | programme |
| Boarding School for Dogs | adult | behaviour, obedience | residential | programme |
| Holiday Board & Train | any | obedience, socialisation | residential | programme |
| Intensive Dog Training | adult | behaviour | day-based | programme |
| Comprehensive Puppy Training | puppy | socialisation, obedience | day-based | programme |
| Puppy Training Classes | puppy | obedience, socialisation | group-class | pay-as-you-go |
| One to One Dog Training | any | behaviour, obedience | one-to-one | pay-as-you-go |
| Dog Social Walks | any | socialisation, enrichment | walk | pay-as-you-go |
| Free Phone Consultation | any | (always shown) | — | pay-as-you-go |

*Free Consult is never filtered out (it's the universal fallback). Budget = TWO bands only (owner 2026-07-06): `pay-as-you-go` (£0–£175) and `programme` (£1,200+). The Comprehensive Puppy card links to its own new dedicated page (decision #14), not the free consult.*

## Section map (draft)

1. **Hero** — video loop + poster; headline (drafted, e.g. "Every dog, every budget — find the right way to train"); **primary CTA "Book a free consult"** (honey → Acuity `56694430`) + a "jump to the plans" scroll cue.
2. **Intro** — one short honest paragraph: 9 ways to train with us, from a £20 social walk to a live-in Board & Train; the chips help you narrow, the free call de-risks it.
3. **SIGNATURE: filter + grid** — the four chip rows (Age / Goal / Format / Budget) above a flat responsive grid of the 9 plan cards. AND logic, soft-dim non-matches, GSAP for the dim/scale transitions; empty state = free-consult card. Each card: name · price (from `pricing.json`, `gbp()`) · large-dog surcharge where set · "best for" line · 2–3 features · CTA per the map above.
4. **Closing band** — restate the free phone consult as the safety net ("Still not sure? A free 15-minute call and we'll point you to the honest best fit"). Acuity `56694430`.
5. **EnquiryForm** — `service="Training enquiry"`, `page="training-plans"` (secondary CTA).

## Animation contract
- Standard `data-gsapInit` idempotent init, `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, initial states in JS not CSS.
- **Reduced-motion / no-JS:** all 9 cards fully visible and un-dimmed; chips still work as plain filters (or the whole grid just shows everything). Never hide a card behind opacity a CSS rule must later own — dim state driven by a class toggle, not a leftover inline `opacity` (2026-07-05 autoAlpha lesson).
- Kill all ScrollTriggers on `astro:before-swap`; re-init on `astro:page-load`.

## Wiring / flip-backs to ship with this page (verify each at build)
- `Header.astro` — add nav link (inside-out rule); label short, one-line rule. **Check whether the nav currently points "Training Plans" at `/#Trainingplans`** and flip to `/training-plans`. **Verify one-line desktop nav at 1440px AND the 768–1023 hamburger band** (owner mobile rule).
- `scripts/verify-urls.mjs` — `/training-plans` planned → built.
- `astro.config.mjs` — check the absorbed `/training-stages` (and any other) redirect stub target; point at `/training-plans` if appropriate.
- `src/pages/index.astro` — the `#Trainingplans` summary section: check for any TEMP button targets that should now resolve to `/training-plans`.
- Confirm the day-school / other pages' "see all training plans"-type links (if any) now land on `/training-plans`.
- **No new TEMP targets created by this page** (it cross-sells to nothing unbuilt).

## Quality gates
- `npm run build && npm run verify-urls` green; Lighthouse ≥90; reduced-motion pass; **desktop AND mobile visual check** before ship; live preview owner sign-off.
