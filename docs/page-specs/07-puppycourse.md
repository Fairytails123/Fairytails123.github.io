# Page 7 — `/puppycourse` — FINAL spec (pre-build interview 2026-07-12)

The immersive **free DIY Puppy Course hub**, absorbing the old site's `/puppycourse` page,
its 5 hidden popup subpages (`/puppy-week-1`, `/week-2-puppy`, `/puppy-week-3`,
`/puppy-week-4`, `/puppy-toilet-schdule`) and the non-duplicate copy from
`/resources-collection`. Content source = the harvest `copy.md` files (verbatim baseline).

## Locked interview decisions (owner, 2026-07-12 — all "recommended" options)

| Decision | Locked answer |
| --- | --- |
| Copy treatment | **Light tidy-up**: voice + jokes kept verbatim, typos/time formats fixed ("7.3" → 7:30am, "instill" → instil, backyard → garden, leash → lead, acclimate → acclimatise), the duplicated resources-collection 4-step block merged into ONE; zero fact changes |
| Signatures | **All three**: (1) Weeks 1–4 as scroll chapters with a filling trail + travelling paw (sibling of the B&T regime walk); (2) the 5am–8pm daily schedule as a sunrise→evening arc with a travelling sun (sibling of day-school's dawn→dusk), 27 rows grouped into 4 phase steps; (3) an interactive toilet-schedule tool (age 8/12/16 weeks → day/night hold times from the old table, animated bars) |
| Business job | **Soft upsell**: 2 inline chapter nudges (after W2 → Day School socialisation; after W3 → Puppy Classes, since W3 literally says "attend a puppy class") + a closing "Get a head start" 4-step bridge + 3-card pathway band (Puppy Classes £175 · ~~Comprehensive Puppy Training~~ **the residential puppy course** £1,200 · Day School) + EnquiryForm. Free and open — NO email gate |
| **Pathway band — 2026-07-21 correction** | The middle card's product `puppy-intensive` **was deleted** when the owner confirmed the two £1,200 puppy programmes are **one** (*"they're one product"*). The card was **repointed to `board-train-puppy`** (same price, same 4 weeks) and its CTA reads **"Explore Puppy School" → `/comprehensive-puppy-training`**. ⚠️ **Two residual mismatches to fix at the next touch of this page (code, not spec):** (a) the card's **heading renders `name`** = *"Boarding School for Puppies"* while its button says *"Explore Puppy School"* — it should render **`publicName ?? name`** like `/training-plans` and `/puppy-training-classes` do; (b) its blurb still reads *"full days with **overnight stays**, then hand it over with coaching"* — that is the **pre-2026-07-18 framing** the owner killed (*"boards with us full stop"*, and since 07-21: travelling puppies board the whole four weeks, local families flexible). **Neither is a spec change — both are live copy that should be brought onto the `arrangements` data (SEO.md locked #13).** |
| Discoverability | **Footer "Free Puppy Course" link + both TEMP DIY pathway cards flipped + blog Puppies-category CTA repointed.** Nav untouched (6 items, owner-locked) |

## Section map (colour flow / dividers per house pattern)

1. **Hero** (pine-950) — full-bleed photo (`Puppy-Training-1920w.webp`, the sunny-lane puppy sit; owner may swap on review) · eyebrow "Free course · Do it yourself at home" · H1 "The DIY Puppy Course" · CTAs "Start the course ↓" (#start) + free phone consult · trust strip overlap (free/no sign-up · force-free · four weeks · by our trainers)
2. **Aims** `#start` (cream-50) — the 8 aims as chips + golden-puppy polaroid
3. **Methods** (cream-100) — positive reinforcement copy (money joke kept), rewards list, 3 management cards (crate/gate/lead), **punishment straight-talk panel** (pine-900 card)
4. **Daily rhythm** (pine-950) — 6 training touchpoints + food-as-treats note + the **sun-arc timeline**: 4 phase steps (Early morning / Mid-morning to lunch / Afternoon / Evening & wind-down) containing all 27 tidied schedule rows with kind-coloured dots (train/toilet/meal/nap)
5. **Toilet training** `#toilet-training` (cream-50) — verbatim intro (15-minute breaks) + the **age tool** (radio segments 8/12/16 wks → "in the day"/"overnight" hold results + animated bars; SSR default 8 wks; full verbatim table in an accordion below; tool wired BEFORE the reduced-motion return so it works for everyone)
6. **The four weeks** `#week-1..4` (cream-100) — chapter trail + paw; each week = 3 cards (Socialisation exercises / Life skills training / Husbandry tasks) with the popup copy parsed into labelled rows (Daily / Twice this week / Weekend …); golden-pup video-loop polaroid (reuses `/media/puppy-walk-loop.mp4`); nudges after W2 + W3
7. **Education** (cream-50) — resources-collection "Empowering dog owners" intro + 6 mini-section cards
8. **CER science** (pine-900) — **id `ConditionedEmotionalResponse` EXACT CASE (preserved anchor)** — full CER copy incl. Neuronal/Amygdala blocks
9. **Head start + pathways** (cream-50) — merged 4-step block → 3 pathway cards from `pricing.json` + free-consult link
10. **Enquiry** (pine-900) — `EnquiryForm service="General enquiry" page="/puppycourse"`

## Tech
- Meta: title "Free DIY Puppy Training Course | The Fairy Tails K9 Centre"; description carries free/four-week/force-free/toilet-training keywords. **Course JSON-LD** (`isAccessibleForFree: true`).
- GSAP contract: standard (`data-gsapInit`, matchMedia, before-swap kill + `mm.revert()`, reduced-motion = fully-visible static). **Step dims use x-only entrances so the CSS `.pc-step` dim actually engages** (the classes-page fix — do NOT add autoAlpha to step entrances).
- Redirect stubs flip WITH deep links: `/puppy-week-1` → `/puppycourse#week-1`, `/week-2-puppy` → `#week-2`, `/puppy-week-3` → `#week-3`, `/puppy-week-4` → `#week-4`, `/puppy-toilet-schdule` → `#toilet-training`, `/resources-collection` → `/puppycourse`.
- verify-urls: puppycourse planned → **built**.

## Owner review queue (drafts on the live page)
1. Hero photo (reused from B&T's polaroid — say the word for a different shot or a video hero / fresh pipeline pull).
2. The phase grouping + invented row labels in weeks (e.g. "Outings", "Play dates") — the underlying sentences are verbatim-tidied.
3. The 2 nudge cards' wording; the pathway band copy.
4. Golden-pup loop reuse (also on puppy-training-classes).
5. All light-tidy calls (backyard→garden, leash→lead, etc.) — revert any you don't want.

## BUILD STATE
- **2026-07-12: interviewed → spec locked → BUILT + DEPLOYED + LIVE-VERIFIED same session** (commit `acf4361`, Hostinger deploy green first try; `verify-urls --live` 48/0/0 — with this page, EVERY manifest URL is built). All wiring flips landed (six deep-linking stubs, both pathway cards, footer link, blog Puppies CTA, verify-urls built, WEBSITE-PLAN row 7).
- **QA:** build 34 pages 0 errors · toilet tool functionally verified (age switch → values + bar widths; SSR default correct) · all anchors incl. `ConditionedEmotionalResponse` exact-case · desktop screenshots of every section · mobile 375px whole-document `overflowX = 0` + hero/weeks/nudges screenshots · zero console errors. ⚠️ The daily-rhythm rows + toilet-tool card at phone width were verified by overflow-probe + pattern-parity only (backgrounded-tab harness limits) — **on the owner's real-phone list**.
- **Lighthouse (first audit, same day):** desktop perf 100 (LCP 0.8s) · a11y 94 · BP 100 · SEO 100 — gate met. Throttled-mobile perf 84 (full-bleed hero LCP — shared by all hero pages; logged follow-up). The two a11y flags are scroll-reveal audit-state artifacts (see HANDOVER 2026-07-12 polish bullet).
- **Same-day polish pass touched this page too:** both trail tracks moved to `left-[15px]` (marker clip fix).
- **Owner review queue:** see the spec section above + HANDOVER 2026-07-12 — hero photo, light-tidy calls, nudge/pathway copy, golden-pup loop reuse, real-phone pass.
