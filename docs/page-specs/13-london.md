# Page 13 — London — FINAL SPEC (pre-build interview 2026-07-14)

**Slug:** `/london` (**NEW page — no old-site equivalent, no preserved anchors**). Not part of the original URL manifest: it is the first **D-track catchment page**, created by the SEO programme (SEO.md §1 locked decision #3, owner-signed 2026-07-13). Supersedes nothing — it is additive.
**Source data:** `src/data/pricing.json` (`transport`, `category: "board-train"`), `src/data/business.ts` — the single source of truth. Never hard-code money — render from data with `gbp()`.
**Reference implementation:** `src/pages/dog-boarding-school.astro` conventions throughout (hero skeleton, GSAP contract, HillDivider rhythm, data-driven pricing cards, drag-track rail).

## Why this page exists (the SEO case)

- **Primary term:** `residential dog training london` — 100/mo, KD 15, CPC $1.30 (Ahrefs GB, 2026-07-13). We currently rank **#9** for it with no dedicated page.
- **Track D** (destination): Board & Train is sold to the whole South of England with **London as the main market**. The map pack will never show a Hastings business to a London searcher — this is an **organic blue-link + content-authority** play (SEO.md §1).
- **Cluster role:** supporting page to the `/dog-boarding-school` pillar; interlinked pillar ↔ /london ↔ the London-parks blog post (our biggest traffic asset: `dog parks near me`, 4,000/mo, **#5**).

## The doorway test (SEO.md §1 — a hard gate; this page passes on 5 of 3 required)

A location page ships ONLY if ≥3 sections could **not** be find-replaced to another town. Swap "London" for "Manchester" and these break:

| # | Section | Why it cannot be find-replaced |
|---|---------|-------------------------------|
| 1 | **The city dog** | Ten realities of *city* dog life (no garden, lifts, communal doors, the tube, pavements with no escape route). Generic-town copy would be nonsense. |
| 2 | **"Will countryside training hold up on a London street?"** | The specific objection a London buyer has to a countryside trainer — answered with our real-world training locations. |
| 3 | **How collection works** | Real mileage/logistics from `pricing.json` `transport`: £2/mile one-way from **TN35 5DT**, central London ≈ 65 miles ≈ £130 per journey. Arithmetic, not adjectives. |
| 4 | **The week off, and the Fridays** | The two course mechanics that assume you live locally — solved specifically for a family two hours away (decisions #1 and #2 below). Nobody else explains this. |
| 5 | **Closer than it feels** | Distance/visit reassurance that only makes sense for a *distant* client. |

## Locked interview decisions (owner, 2026-07-14)

| # | Topic | Decision |
|---|-------|----------|
| 1 | **Mid-course week off (every B&T dog goes home for a rest week)** | **Both options, parent's choice** — "it depends on parents how they want it". Either **we drive** the dog home and back (same £2/mile, counted one way, per journey) **or the family collects**. The page must present both and assume neither. |
| 2 | **Parent-training Fridays (from week 4) for a London family** | **Remote first**, then a three-stage ladder: (1) first sessions **by video**; (2) ideally the family **comes to Hastings for the mid-course break** — one trip does two jobs: a Friday parent session in person **plus** collecting the dog for the week off; (3) if travel is impossible, **we send a trainer to London at £2/mile** to deliver the dog and train the family at home. |
| 3 | **London/SE client proof** | **Consented stories exist.** Owner to name 1–3 London/SE client dogs → a case-study panel is added later (TODO in the page). Until then the page uses the consent-confirmed real-world training photos and states the London/SE fact in prose only — **it must not imply any pictured dog is a London dog**. |
| 4 | **The £130 worked example** | **Correct — keep it.** Central London ≈ 65 road miles × £2/mile. Derived at build from `pricing.json` `transport`; never retyped. |

## The offer (from `pricing.json` — render, don't retype)

| Programme (`id`) | Price | Unit | Large-dog | Eligibility |
|---|---|---|---|---|
| `board-train-puppy` | £1,200 | for 4 weeks | — | Puppies 12–16 weeks |
| `board-train-adult` **(flagship, honey ring)** | £2,500 | for 8–10 weeks | +£300 | Adult dogs 16 wks+; rescues case-by-case |
| `board-train-holiday` | £1,500 | for 4 weeks | +£300 | Dogs boarding while you're away |

**Travel is charged separately and never bundled into a programme price** — `transport.longDistancePerMile` (£2) × one-way miles, per journey.

## Derived-figure formula (decision #4 — derive at build, from data only)

```
perMile       = pricing.transport.longDistancePerMile          // 2
londonMiles   = pricing.transport.exampleMilesCentralLondon    // 65
londonJourney = perMile * londonMiles                          // 130  → gbp() → "£130"
```
⚠️ **Never confuse this with the £1-per-journey LOCAL school bus (`pricing.json` `addOns`)** — different service. The page never mentions the bus except as a *training environment* ("our own school bus is a moving, rattling, unfamiliar box").

## Section map (draft — copy is Claude-drafted, owner corrects on the live page)

1. **Hero** — `bt-town-training.mp4` (real town/urban training footage — the only asset that shows a dog working on a *street*). H1 "Residential dog training / for **London dogs**". CTAs: `#enquire` + `#collection`.
2. **Trust strip** — £2/mile door to door · 5-star council licence · visit any time · daily reports + body-cam.
3. **The city dog** — the problem, in the reader's own life. 10 city-reality chips + a town polaroid (Rigsby).
4. **"Will countryside training hold up on a London street?"** — **the honest objection, answered.** 4 real-world training places (high street / cafés / promenade / public transport) + a 4-up photo grid + a pine-900 panel admitting what we *cannot* replicate (your street, your stairwell, your neighbours).
5. **SIGNATURE: How collection works (`#collection`)** — 3 numbered steps + the cream price card (£2/mile, the £130 worked example, "it is a sum, not a quote that grows").
6. **The bits nobody else explains** — the week off (decision #1) and parent-training Fridays (decision #2), as two cards.
7. **Closer than it feels** — open visits, ~90 min by train, daily video, no kennels + the CouncilRating licence panel.
8. **Pricing** — the three `board-train` cards from `pricing.json` + a link back to the pillar.
9. **Proof** — 8-card draggable polaroid rail (real client dogs, first names only) + the London-parks blog cross-link. **TODO(owner): named London/SE case studies (decision #3).**
10. **FAQ** — 7 London-specific questions (cost, distance, flat-living, does it transfer, the week off, Fridays from London, "do you only take London dogs?").
11. **Enquire (`#enquire`)** — `EnquiryForm service="Board & Train" page="/london"`.

## Animation contract

Standard: hero timeline (`data-hero-*`), `data-reveal` fade-ups, `data-stagger` groups, hero parallax, mouse drag-rail. Idempotent `initLondon()` on the `data-gsapInit` flag; module-level `mm` + `mm.revert()` on `astro:before-swap`; `ScrollTrigger.kill()` on swap; reduced-motion returns early (page fully visible, static). **No `pin`.** Hero video `preload="none"`, lazy-started, skipped under reduced-motion/`saveData`; poster is the fallback.

## Wiring shipped with this page (🔔 checklist — all DONE at build)

- `scripts/verify-urls.mjs` — `/london` added as **built** (manifest now 49 URLs).
- `Footer.astro` — "London Collection" added to Explore (10 links — `grid-rows-5` still fits; an 11th needs `grid-rows-6`).
- `index.astro` — the Track-1 "Coming from London?" aside CTA repointed `/dog-boarding-school#london-pickup` → **`/london`**.
- `dog-boarding-school.astro` — the `#london-pickup` price card gains a descriptive link into `/london`.
- `dog-parks-in-london-…md` — closing paragraph gains an internal link to `/london` (anchor: "residential dog training for London dogs").
- **Nav: deliberately NOT added** — the nav is one-line-locked at 6 items (owner, 2026-07-04). /london is reached from the footer, the homepage aside, the pillar and the blog post.

## Quality gates

`npm run build` (35 pages, 0 errors) · `npm run verify-urls` 49/0/0 · SEO gate (SEO.md §4) · desktop 1440 + true-390px visual · Lighthouse ≥90 · reduced-motion/no-JS static pass · adversarial review before push · owner sign-off on the live page.

## BUILD STATE (2026-07-14) — BUILT + adversarially reviewed + DEPLOYED + LIVE

**Adversarial review: 6 dimensions × 3 refuters, 141 agents → 45 findings raised, 27 refuted, 18 CONFIRMED and ALL FIXED.** The two blockers were both real and would have shipped:

1. **🚨 The hero was pointing at the 27 MB click-to-play film.** `bt-town-training.mp4` is the long documentary the B&T page deliberately serves `controls preload="none"` *because* of its size; wiring it as an autoplaying background loop fired an unconditional 27 MB download 350 ms after every page load — on a page whose entire audience is London phone users. **Fixed by cutting a proper hero per `docs/video-hero-pipeline.md`: `public/media/london-hero.mp4` (12.4 s · 1280×720 · H.264 High · BT.709 · +faststart · muted · **1.85 MB**) + `london-poster.jpg`** — three 4.4 s segments of a trainer walking a dog down a wet Hastings shopping street, 0.4 s crossfades, composed to loop. Page total byte weight is now **2.4 MB**. ⚠️ **NEVER point a background `<video>` at `bt-town-training.mp4`** (a non-rendering guard comment sits above the hero).
2. **🚨 "Every dog gets a week at home" was false** for two of the three programmes the page itself renders — the mid-course week off belongs to the **8–10 week adult course only**; the 4-week puppy course has a transition week *after*, and Holiday Board & Train boards dogs *while the family is away*. Scoped in both the card and the FAQ (decision #1 still holds — the *choice* of who drives is the owner's, but only for the course that has a week off).

**The other 16, all fixed:** parent training said "from week one" (contradicting `pricing.json`'s **week 4** and the page's own card) · "the people who collect your dog are the people who will train them" was an unevidenced staffing guarantee (downgraded to the sourced claim) · **three invented customer statistics** ("most families come down at least once", "most/plenty of London families combine the trip") — deleted, converted to offers · **photo alt text and captions described scenes the photographs do not contain** (Max is on the *seafront*, not a town pavement; Neo is *sitting*, not walking; Rocco is in a *down-stay*, not "focus in traffic"; Diego's head is turned *away*) — every one of the 13 images was opened and re-captioned from the actual frame, which matters doubly because they sit under a "no stock, no staging" claim · the "Public transport" card actually described our own school bus → retitled "Loading up and travelling", and **"the Tube" was added to the honest can't-replicate panel** ("Hastings has no Underground, and we will not pretend otherwise") · the proof section's `pb-20` was stranded on an inner div, so the closing CTA butted into the next hill divider · `text-bark-400` fails AA on cream (3.84:1) → `bark-500` · the polaroid rail was an unfocusable scroll region (WCAG 2.1.1) → `tabindex`/`role`/`aria-label` + focus ring · the hero squiggle fragmented below 360 px → `whitespace-nowrap` · two H2s now carry the target term naturally.

**QA:** build 35 pages 0 errors · `verify-urls` **49/0/0** · Lighthouse **desktop 99 / a11y 98 / BP 100 / SEO 100**; throttled-mobile perf 87 (the *known site-wide hero-LCP debt* — every hero page sits at 84, this one is better; tracked separately) · desktop 1440 + true-390 px both verified: no horizontal overflow, H1 2/3 lines, squiggle a single unbroken rect · all 8 HillDivider colour pairs checked against the computed section backgrounds. **a11y 98 beats the reference page's 94** — the remaining 2 points are the site-wide header-nav contrast issue, logged separately.

**Owner still owes:** (1) **1–3 named London/SE client dogs** for the case-study panel (decision #3); (2) all page copy is **DRAFT** — especially the city-realities chips, the "honest objection" section and the 7 FAQ answers; (3) the **"about an hour and a half from London by train"** claim — sanity-check; (4) real-phone layout check; (5) confirm whether the trainer who collects is genuinely the trainer who trains — if so, the stronger promise can be restored.
