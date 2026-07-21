# Page 5 — Training Plans — FINAL SPEC (pre-build interview 2026-07-06)

**Slug:** `/training-plans` (NEW page — no old-site equivalent; anchor `#Trainingplans` kept on the homepage so legacy links still land). Supersedes the WEBSITE-PLAN baseline for this page.
**Source data:** `src/data/pricing.json` (prices/facts = truth; never hard-code money). No harvest copy — all prose is Claude-drafted, owner corrects on preview.
**Reference implementation:** `src/pages/dog-boarding-school.astro` conventions; filter/grid interaction is a new mechanic for the site.

> **🔴 COUNT CHANGE 2026-07-21 — THIS PAGE IS NOW **8** PLANS, NOT 9.** The owner confirmed the two £1,200 puppy programmes are **one product** (*"they're one product"*), so **`puppy-intensive` ("Comprehensive Puppy Training") was DELETED from `pricing.json`** and absorbed into **`board-train-puppy`**, which gained `publicName: "Puppy School"`. On this page that means: **one puppy programme card, not two**; its **title renders `publicName ?? name`** → "Puppy School"; its **CTA is "Explore Puppy School" → `/comprehensive-puppy-training`** (previously `/dog-boarding-school`, because the pillar presents the same course as one tier of the Board & Train **range**). Every "9" below is struck to **8**. **Do not re-split the card, do not re-create the SKU.** Deployed `ffb4486` (run 29861971032), LIVE.

## Locked interview decisions (owner, 2026-07-06)

| # | Topic | Decision |
|---|-------|----------|
| 1 | **Page scope** | **Training + Board & Train = ~~9~~ 8 plans** (2026-07-21). The ~~6~~ **5** `training`-category offerings (Intensive, ~~Comprehensive Puppy,~~ Puppy Classes, One-to-One, Social Walks, Free Consult) **+** the 3 `board-train` offerings (Boarding School for Puppies → rendered as **"Puppy School"**, Boarding School for Dogs, Holiday Board & Train). **Day-school daycare and memberships are NOT on this page** — they keep their own pages. |
| 2 | **Signature interaction** | **Instant filter chips** (no quiz, no "result" screen). Tappable chips live-filter the ~~9~~ **8** cards. |
| 3 | **Filter axes** | **ALL FOUR:** Dog age · Goal/issue · Format · Budget band. |
| 4 | **Filter logic** | **Narrow (AND) + soft dim.** Selecting across axes shows only plans matching ALL selected chips; non-matches **fade/shrink, not vanish** (calm layout, minimal reflow — matters on mobile). |
| 5 | **Empty state** | If nothing matches, surface a friendly **"Not sure? Book a free consult"** card (Acuity `56694430`). |
| 6 | **Card layout** | **One flat responsive grid** of all ~~9~~ **8** (no grouping bands). Chips do the organising. |
| 7 | **Comparison table** | **None.** Cards only (cleaner, better on phones; chips handle the "compare" job). |
| 8 | **Cross-sell** | **NONE.** No bottom cross-sell strip to Day School / Memberships / DIY course / Blog. Page ends on the free-consult CTA — deliberately focused. |
| 9 | **Card CTA rule** | **Detail page if one exists, else the plan's Acuity link, else the free consult.** (Per-plan map below.) |
| 10 | **Primary page CTA** | **Book the FREE phone consult** (Acuity `56694430`) — the low-friction "not sure which plan?" action, repeated in hero + empty state + closing band. EnquiryForm is secondary. |
| 11 | **Hero media** | **Video loop hero** (lazy `data-hero-video` pattern) cut from the March reserve clips via the FFmpeg tonemap pipeline. **Owner picks the clip** — Claude extracts candidate stills from the reserves and presents them at the hero/animation pass (needs frame extraction, so deferred out of the interview). Prefer a clip that reads as "a range of training." |
| 12 | **Copy** | **Claude drafts, owner corrects on preview** — headline, intro, and each card's one-line "best for", written from the existing site voice + pricing data; flagged as drafts. |
| 13 | **Puppy-product positioning** (owner, 2026-07-06) | ~~**Comprehensive Puppy Training**~~ **The residential puppy course (now `board-train-puppy`, shown as "Puppy School")** = *trainer-led, labour-intensive* (our trainers do the heavy lifting; ~~puppy is with us full-day~~ **corrected 2026-07-18 (owner): the puppy BOARDS with us** — "boards with us full stop"; open to local **and** non-local). **Puppy Training Classes** = *instructional, parent-led* (we teach you; you put in the work at home). Use this to write the ~~two puppy cards'~~ **puppy cards'** "best for" lines and keep them clearly distinct. ~~⚠️ This contrast (vs Classes) is unaffected — but the contrast vs `board-train-puppy` is now an OPEN QUESTION awaiting the owner (both board); don't write a card line that invents one.~~ **🔴 RESOLVED 2026-07-21: there is no contrast to write, because there is only ONE residential puppy product.** The residential-vs-Classes contrast stands and is the only puppy contrast this page carries. Live "best for" line: *"Puppies 12–16 weeks who board with us and get the deepest possible start."* **Boarding detail (local flexible / travelling mandatory) belongs on `/comprehensive-puppy-training`, rendered from `arrangements` — do not restate it in a card line, and never mix the two groups.** |
| 14 | **Comprehensive Puppy = its own page** (owner, 2026-07-06) | ~~Comprehensive Puppy Training~~ **The residential puppy course** gets a **dedicated page** at `/comprehensive-puppy-training`, **in the main nav as "Puppy School"** (owner update — the primary puppy offer). So its grid-card CTA → the new page, NOT the free consult and NOT `/intensive-dog-training`. **Still true after the 2026-07-21 merge — and it now applies to the `board-train-puppy` card**, which is why that card's CTA points here rather than at `/dog-boarding-school` (the pillar sells the same course as one tier of the **range**). |
| 15 | **Budget bands = TWO only** (owner, 2026-07-06) | `pay-as-you-go` (£0–£175) / `programme` (£1,200+). Natural price gap; no middle band. |

## The ~~9~~ **8** plans + per-card CTA (from `pricing.json`)

| Plan (`id`) | Price | Card CTA target |
|---|---|---|
| **Puppy School** — formal name Boarding School for Puppies (`board-train-puppy`) | £1,200 / 4wk | ~~`/dog-boarding-school`~~ → **`/comprehensive-puppy-training`** ("Explore Puppy School", 2026-07-21) — the card title renders `publicName ?? name` |
| Boarding School for Dogs (`board-train-adult`) | £2,500 / 8–10wk (+£300 large) | `/dog-boarding-school` |
| Holiday Board & Train (`board-train-holiday`) | £1,500 / 4wk (+£300 large) | `/dog-boarding-school` |
| Intensive Dog Training (`intensive-dog-training`) | £2,000 / 2mo (+£300 large) | `/intensive-dog-training` |
| ~~Comprehensive Puppy Training (`puppy-intensive`) | £1,200 / 1mo | New dedicated page (owner 2026-07-06)…~~ | **🔴 ROW DELETED 2026-07-21** | **This SKU no longer exists** — merged into the `board-train-puppy` row above (owner: *"they're one product"*). Its dedicated page survives as that course's page. |
| Puppy Training Classes (`puppy-classes`) | £175 / course | `/puppy-training-classes` |
| One to One Dog Training (`one-to-one`) | £49.99 / session | Acuity `appointmentType=51989230` (byte-for-byte) |
| Dog Social Walks (`social-walks`) | £20 / walk | **Free consult** (existing-clients-only; no Acuity) |
| Free Phone Consultation (`free-consult`) | Free | Acuity `56694430` (this card **is** the primary CTA) |

## Filter tagging matrix (DRAFT — drives the chips; refine at build)

**Age:** `puppy` / `adult` / `any`  ·  **Goal:** `obedience` / `behaviour` / `socialisation` / `enrichment`  ·  **Format:** `residential` / `day-based` / `group-class` / `one-to-one` / `walk`  ·  **Budget:** TWO bands (owner 2026-07-06) — `pay-as-you-go` (£0–£175) / `programme` (£1,200+)

| Plan | Age | Goal | Format | Budget |
|---|---|---|---|---|
| **Puppy School** (`board-train-puppy`) | puppy | obedience, socialisation | residential | programme |
| Boarding School for Dogs | adult | behaviour, obedience | residential | programme |
| Holiday Board & Train | any | obedience, socialisation | residential | programme |
| Intensive Dog Training | adult | behaviour | day-based | programme |
| ~~Comprehensive Puppy Training | puppy | socialisation, obedience | ~~day-based~~ **residential** ¹ | programme~~ **ROW GONE 2026-07-21 — merged into the Puppy School row above** |
| Puppy Training Classes | puppy | obedience, socialisation | group-class | pay-as-you-go |
| One to One Dog Training | any | behaviour, obedience | one-to-one | pay-as-you-go |
| Dog Social Walks | any | socialisation, enrichment | walk | pay-as-you-go |
| Free Phone Consultation | any | (always shown) | — | pay-as-you-go |

¹ **Corrected 2026-07-18 (owner fact correction).** Comprehensive Puppy Training's Format was recorded as `day-based` on the 2026-06-30 understanding that the puppy went home each evening. The owner has confirmed **the puppy boards with us** (local **and** non-local; local families may merely *opt* for more evenings at home), so its Format chip is **`residential`**. **Do not revert it to `day-based`.** **🔴 2026-07-21 — the footnote's SUBJECT no longer exists:** the two rows became one when the SKUs merged, and the surviving `board-train-puppy` row was already `residential`. The `day-based` tagging is **dead in every form** — the honest chip for a residential puppy course is `residential`, full stop.

*Free Consult is never filtered out (it's the universal fallback). Budget = TWO bands only (owner 2026-07-06): `pay-as-you-go` (£0–£175) and `programme` (£1,200+). ~~The Comprehensive Puppy card links to its own new dedicated page (decision #14), not the free consult.~~ **The Puppy School card (`board-train-puppy`) links to `/comprehensive-puppy-training` (decision #14), not the free consult and not the pillar.***

## Section map (draft)

1. **Hero** — video loop + poster; headline (drafted, e.g. "Every dog, every budget — find the right way to train"); **primary CTA "Book a free consult"** (honey → Acuity `56694430`) + a "jump to the plans" scroll cue.
2. **Intro** — one short honest paragraph: ~~9~~ **8** ways to train with us (2026-07-21), from a £20 social walk to a live-in Board & Train; the chips help you narrow, the free call de-risks it. ⚠️ **The count is written in prose here — if the offering list ever changes again, this sentence changes with it.**
3. **SIGNATURE: filter + grid** — the four chip rows (Age / Goal / Format / Budget) above a flat responsive grid of the ~~9~~ **8** plan cards. AND logic, soft-dim non-matches, GSAP for the dim/scale transitions; empty state = free-consult card. Each card: name · price (from `pricing.json`, `gbp()`) · large-dog surcharge where set · "best for" line · 2–3 features · CTA per the map above.
4. **Closing band** — restate the free phone consult as the safety net ("Still not sure? A free 15-minute call and we'll point you to the honest best fit"). Acuity `56694430`.
5. **EnquiryForm** — `service="Training enquiry"`, `page="training-plans"` (secondary CTA).

## Animation contract
- Standard `data-gsapInit` idempotent init, `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, initial states in JS not CSS.
- **Reduced-motion / no-JS:** all ~~9~~ **8** cards fully visible and un-dimmed; chips still work as plain filters (or the whole grid just shows everything). Never hide a card behind opacity a CSS rule must later own — dim state driven by a class toggle, not a leftover inline `opacity` (2026-07-05 autoAlpha lesson).
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

## BUILD STATE (2026-07-08) — BUILT + DEPLOYED + LIVE (commit `d523603`)

Built as `src/pages/training-plans.astro` (mirrors `dog-boarding-school.astro`; frontend-design skill). **Final build decisions (owner 2026-07-08, on top of the locked table above):**
- **Nav:** footer + homepage only — no nav item added (nav stays 6, one-line-locked). `Footer.astro` +Training Plans; `index.astro` #Trainingplans got a "Compare all training plans" honey CTA.
- **Budget chips:** price ranges only (`£0–£175` / `£1,200+`) — no word labels.
- **Grid default order:** flagship programmes first (board-train-puppy, board-train-adult, intensive, ~~puppy-intensive,~~ board-train-holiday, puppy-classes, one-to-one, social-walks, free-consult) — **`puppy-intensive` dropped 2026-07-21 with the merge; the order is otherwise unchanged**. Free Consult last + honey-elevated (ring + "Start here"), `data-always` so it's never dimmed.
- **Hero:** owner picked a **variety montage**; built from the `Training1` reserve clip (`Videos\_owner-dropins\site-videos\…Training1-v.mp4`), center-cropped portrait→16:9, 4 shots (seafront → boxer → husky → podenco) crossfaded, warm graded, 10.8s/1.6MB → `public/media/training-plans-hero.mp4` + `-poster.jpg`. **Interim — owner reviews/approves the cut.** No head collars (screened).
- **Filter mechanic:** multi-select; AND across axes, OR within an axis; soft-dim = class `is-dimmed` (opacity .28 + `saturate(.55)` + `scale(.97)`, CSS-transitioned, no reflow); live count `aria-live`; empty note `role="status"`; `.is-dimmed:focus-within` restores full visibility for keyboard users; chip groups `role="group"`+`aria-labelledby`.
- **Copy:** all DRAFT (headline, intro, each card's "best for", closing band) — owner corrects on preview. Prices in prose derived from data (`socialWalkPrice`), never hard-coded.
- **Adversarial review:** 6-dimension workflow → 5 confirmed findings, all fixed (clearProps transform; focus-within; chip-group labelling; £20-from-data; empty-state announcement/count). Full list in `HANDOVER.md` 2026-07-08.
- **Verified:** build 32 pages 0 errors; verify-urls 0 failures; filter logic + CTAs + soft-dim live-verified in-browser; no desktop overflow. **DEPLOYED + LIVE 2026-07-08** (commit `d523603`, Hostinger deploy `28958184543` green first try; `verify-urls --live` → `/training-plans` 200, 0 failures; hero mp4 + poster 200; homepage CTA + footer link live). **Still owed by owner (on the live page): hero-cut sign-off + DRAFT-copy corrections + a real-phone/tablet layout check** (automation couldn't drive a 390px viewport — documented maximised no-op).

## UPDATE 2026-07-21 — 9 plans → 8 (the puppy SKU merge), LIVE `ffb4486` (run 29861971032)

- `puppy-intensive` **deleted** from `pricing.json` → the grid renders **8** cards; the `meta` map lost its `puppy-intensive` entry and `board-train-puppy` took over the puppy slot.
- The surviving puppy card renders **`publicName ?? name`** → **"Puppy School"**, with CTA **"Explore Puppy School" → `/comprehensive-puppy-training`** (was `/dog-boarding-school`) — title, CTA and destination now all say the same thing.
- `bestFor` line: *"Puppies 12–16 weeks who board with us and get the deepest possible start."*
- **Not changed:** chips, axes, budget bands, dim mechanic, order (minus the removed id), free-consult elevation.
- ⚠️ **The intro's "8 ways to train" is prose** — it does **not** derive from `pricing.json`. Any future offering change must update that sentence too.
