# Page 4b — "Puppy School" (Comprehensive Puppy Training) — FINAL SPEC (pre-build interview 2026-07-06)

> **🎯 SEO TARGETING LOCKED 2026-07-16 (owner + data) — read before touching this page's copy.**
> **Primary term = "puppy school" (150/mo, KD 8), Track L (local).** The `<title>`, H1 area and hero eyebrow lead with **"Puppy School"** — the name the site's nav already used while the title buried the page under "Comprehensive Puppy Training", a phrase with **~0 search demand**. `pricing.json` keeps the formal product name; **that duality is deliberate.** The **slug is unchanged** — term battles are fought in title/H1/copy, never the slug (SEO.md decision #1).
> **⚠️ THIS PAGE IS NOT RESIDENTIAL. Never market it as residential or boarding.** Its `eligibility` is *"**Local** puppies up to 18 weeks"* and its own copy says *"full-day puppy school with overnight stays woven in for the separation-anxiety work, so your pup is home with you"*. The genuinely residential puppy product is **Boarding School for Puppies** (`board-train-puppy`, £1,200/4 weeks, 12–16 weeks) on `/dog-boarding-school`, and **it** owns "residential puppy training" (70/mo).
> **How the decision was reached** (SEO.md §1 standing gates + §6 ledger 2026-07-16): the owner asked whether the slug should say residential / boarding / intensive. **"Residential" and "boarding" were eliminated by the HONESTY GATE before volume was even looked at** — they misdescribe the product and would cannibalise the real residential programme. **"Intensive" survived honesty but died on data: 20/mo.** "puppy socialisation classes" (200/mo, KD 0) was eliminated by the NO-CANNIBALISATION gate — it belongs to `/puppy-training-classes`.
> Also fixed 2026-07-16: a **hard-coded `£175`** in this page's FAQ copy now interpolates from `pricing.json`; the page gained **Service + FAQPage JSON-LD** (see CLAUDE.md "Schema / structured data").

> **📸 Update 2026-07-07 (LIVE):** a real-world photo strip (6 real town/café/seafront/bus/park shots) was appended to the "Into the world" section. The shared stock/AI filler images this page uses (`puppy-lab-sit`, `puppy-life-skills`, `classes-lead-walk`) were **replaced with real photos** and their alt text updated. Source + method: `docs/training-photo-pipeline.md`; head-collar/muzzle screened. See HANDOVER 2026-07-07.

**Slug:** `/comprehensive-puppy-training` (NEW, off-plan page — added 2026-07-06 at owner request). **In the main nav as "Puppy School"** (owner update 2026-07-06 — reversed the initial off-nav plan; this is the primary puppy offer, replacing the "Puppy Classes" nav item). Puppy Training Classes stays reachable via internal links. Product = `pricing.json` id `puppy-intensive` (**Comprehensive Puppy Training, £1,200, "for 1 month", "Local puppies up to 18 weeks"**).
**Reference implementation:** `src/pages/puppy-training-classes.astro` (mirrored conventions — hero, GSAP contract, price-from-pricing.json, enquiry-first CTAs).
**Grounding:** recon workflow `wf_30dfc61b-08f` (9 agents) — differentiation map, SEO targets, section plan.

## Why this page exists
Owner decision (2026-07-06): the £1,200 Comprehensive Puppy Training product gets its **own dedicated page** rather than borrowing `/intensive-dog-training`. **Update same day:** promoted to the **main nav as "Puppy School"** (the primary puppy offer), replacing the "Puppy Classes" nav item; Puppy Training Classes stays reachable via internal links. It is also the destination for the homepage `puppy-intensive` card and the puppy-classes cross-sell card.

## Locked interview decisions (owner, 2026-07-06)

| # | Topic | Decision |
|---|-------|----------|
| 1 | **Positioning spine** | **Trainer-led / labour-intensive** — *we do the hard work, full-time*. The explicit contrast with **Puppy Training Classes** (£175, instructional / **parent-led** — we teach you, you do the homework). This runs through the hero, the "more than obedience" cards, and the FAQ. |
| 2 | **Three net-new angles it owns** (from recon) | (a) the **developmental "start now" thesis** — from the 2nd vaccinations, the socialisation window as a one-time blank canvas; (b) the **named "time on / time off"** socialisation rhythm (Day School has the concept, never names it); (c) **boarding to PREVENT separation anxiety** (Board & Train only treats it remedially). |
| 3 | **Overnight boarding** | **Yes — real overnight stays**, woven into the month. So the page carries the **5-star council-licence** trust signal (`CouncilRating licence`, WK/202503477) on the separation-anxiety section and defers to `/dog-boarding-school` as the licensing explainer; remedial cases handed to Board & Train with the `/archiestory` proof link. |
| 4 | **Signature interaction** | **"Time on / time off" rhythm** scroll story (pine-950 band) — 6 alternating ON/OFF beats, dim-until-active, a warm marker travelling a filling trail. Reuses the proven rail mechanic; **x-only entrance** (CSS owns `.rhythm-step` opacity — the autoAlpha no-op lesson). |
| 5 | **CTAs** | **Enquiry primary** (`#enquire`) + **free phone consult secondary** (`business.acuity.freeConsult`, appt 56694430). No direct Acuity booking (`puppy-intensive.acuityUrl` is null — "bespoke month, we start with a chat"). |
| 6 | **Hero media** | **Reuse a live puppy clip now** (`/media/puppy-classes-hero.mp4` + poster) via the `data-hero-video` lazy pattern. **TODO(owner):** swap in a bespoke full-day / trainer-led clip later (code-commented in the hero). |
| 7 | **Proof** | Graceful **dashed placeholder** (client-dog media consent-gated) until a real puppy-graduate story lands. |
| 8 | **Nav + homepage surfacing** | **In the main nav as "Puppy School"** (owner update 2026-07-06 — replaced the "Puppy Classes" nav item; Header `nav[]` updated). Also repointed: `index.astro` `detailHref['puppy-intensive']` → `/comprehensive-puppy-training`. Puppy Training Classes stays reachable via internal links (homepage grid + cross-sell), not the nav. |
| 9 | **Copy** | Claude-drafted from the brief + site voice; `monthPlan`, `faqs`, `rhythm` copy flagged **DRAFT** for owner correction on the preview. |
| 10 | **Assets** | Reuses real harvest photos cross-folder (puppy-classes / boarding / intensive / day-school sets) — towns/bus/park/loose-lead for the real-world grid. A dedicated `src/assets/pages/comprehensive-puppy-training/` folder can replace them if the owner wants bespoke images. |

## Section map (as built)
1. **Hero** (pine-950) — video loop; H1 "A month that shapes the rest of their life"; enquiry + free-consult CTAs.
2. **Trust strip** — full-day trainers · all breeds/sizes · overnight stays prevent separation anxiety.
3. **Why start now — the window** (cream-50) — developmental thesis: start from 2nd vaccinations; blank canvas; a month now saves months later.
4. **More than basic obedience — what a trainer adds** (cream-100) — 4 cards incl. the **"we do the heavy lifting"** parent-led-vs-trainer-led contrast + cross-link to `/puppy-training-classes`.
5. **SIGNATURE — Time on, time off** (pine-950) — the socialisation rhythm scroll story + "why the rest matters" note.
6. **Boarding that prevents separation anxiety** (moss-800) — prevention angle; **CouncilRating** licence badge; hand-off to `/dog-boarding-school` + `/archiestory`; settle-loop video.
7. **Into the world, at their pace** (cream-50) — real-world outings grid (town / bus / busy park / loose-lead) + `worldSkills` list + recall image.
8. **Your month with us** (cream-100) — 4-week `monthPlan` timeline (DRAFT).
9. **How your puppy benefits** (cream-50) — 4 benefit cards + "and you learn too" handover + dashed testimonial placeholder.
10. **Pricing & how to book** (pine-900) — data-driven card (`puppy-intensive`), `includes` list, enquiry + free-consult CTAs, "who it's for" accordion.
11. **FAQ** (cream-50) — 6 DRAFT FAQs incl. "how is this different from classes / Board & Train".
12. **Other puppy pathways** (cream-100) — cross-sell (minus self): Puppy Training Classes (£175 parent-led), Boarding School for Puppies (£1,200 residential — **distinguished** from this full-day £1,200 product), free DIY course (**TEMP → /blog** until `/puppycourse` ships).
13. **Enquiry** (pine-900) — `<EnquiryForm service="Comprehensive Puppy Training" page="/comprehensive-puppy-training" />` + call/WhatsApp.

## Wiring / flip-backs shipped with this page
- `src/components/EnquiryForm.astro` — added `'Comprehensive Puppy Training'` to `services[]` (so the dropdown pre-selects).
- `src/pages/index.astro` — `detailHref['puppy-intensive']` → `/comprehensive-puppy-training` (homepage repoint).
- `src/pages/puppy-training-classes.astro` — the "Puppy Pathways" Comprehensive-Puppy card link → `/comprehensive-puppy-training` (was `/intensive-dog-training`); button text → "Comprehensive puppy training".
- `scripts/verify-urls.mjs` — `/comprehensive-puppy-training` added as `status:'built'`.
- `Header.astro` — nav item **"Puppy Classes" → "Puppy School"** relabelled and repointed to `/comprehensive-puppy-training` (owner update 2026-07-06). Puppy Training Classes leaves the nav (still internally linked from the homepage grid + the puppy pages' cross-sell).
- **TEMP link remaining:** the DIY-course pathway card → `/blog` until page 7 `/puppycourse` ships (shares the existing HANDOVER flip-back).

## Build status (2026-07-06)
- ◐ **content + design + motion BUILT** — `npm run build` clean (31 pages), `npm run verify-urls` 0 failures (`/comprehensive-puppy-training` OK).
- Adversarial review workflow `wf_99282fdc-ca8` run post-build; findings applied.
- **Pending:** owner preview review (voice/DRAFT copy on `monthPlan`/`faqs`/`rhythm`, real hero clip, real testimonial); Lighthouse/a11y polish pass; desktop + mobile visual sign-off.

## Post-build review (workflow `wf_99282fdc-ca8`, 16 agents)
12 findings raised → 7 rejected (false-positive / intentional / draft), **5 survived; 0 high-severity, 0 functional/wiring/GSAP/link defects.** Applied: `text-bark-400`→`bark-500` (AA contrast on card subtitles), deleted 2 dead imports, softened "No separation anxiety" → "Confident when left alone" (absolute-claim/tone), trimmed meta description.
**Deferred to the site-wide polish pass (NOT page-specific):** `.eyebrow` in `text-honey-600` on cream measures ~3.3–3.6:1 (fails WCAG AA) — a shared design-token issue on every built page (incl. the signed-off reference page); fix once at the token level (e.g. darken eyebrow-on-cream to `honey-700`), and apply the same `bark-400`→`bark-500` bump to the sibling pages for consistency.

Visual check (owner rule): desktop (1920) + mobile (390 via iframe emulation, window was snapped so `resize_window` no-op'd). **0 horizontal-overflow offenders at both widths**; hero, "time on/off" signature, and boarding+council sections eyeballed and correct. (Nav updated 2026-07-06 to include it as "Puppy School" — re-checked one-line desktop fit + mobile drawer.)

## Quality gates
`npm run build && npm run verify-urls` green · Lighthouse ≥90 · reduced-motion pass · **desktop (~1440px) AND mobile (~390px) visual check** (owner rule) · owner sign-off on the live preview.
