# Page 4 — Puppy Training Classes — FINAL SPEC (pre-build interview 2026-07-05)

> **📸 Update 2026-07-07 (LIVE):** a new "Out in the real world" `data-stagger` photo grid (6 real town/café/seafront/park shots) was added at the end of the benefits section. Also, **5 stock/AI filler images shared by both puppy pages were replaced with real photos** — on this page: `puppy-socialisation`, `classes-lead-walk` (aspect 16/9→square), `puppy-lab-sit`, `puppy-head-tilt` (all now real, alt text updated). Source + method: `docs/training-photo-pipeline.md`; head-collar/muzzle screened. See HANDOVER 2026-07-07.

**Slug:** `/puppy-training-classes` (preserved). Supersedes the WEBSITE-PLAN baseline for this page.
**Source copy:** `fairytails-image-archive/puppy-training-classes/copy.md` (verbatim base).
**Reference implementation:** `src/pages/dog-boarding-school.astro` conventions; timeline mechanic sibling of Day School's dawn→dusk.

## Locked interview decisions (owner, 2026-07-05)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Schedule | **Concordia Hall, St. Leonards, Thursday evenings 6pm** — publish as current, drop the stale "For 2024" framing |
| 2 | Enrolment | **Rolling** — book any time, "we will then contact you to book you in to the next available course" (old copy's wording stands). Group size stays **unnumbered "small group"** (owner gave no number) |
| 3 | Offer facts | **£175 per course = 4 evening sessions over one month + THREE day-school intro sessions** (three = locked plan decision; old page's "two" is wrong) |
| 4 | Booking CTAs | **Both** — EnquiryForm primary (site-wide pattern) + Acuity "Reserve your place — £175" secondary. Acuity cart link byte-for-byte: `https://app.acuityscheduling.com/catalog.php?owner=13914499&action=addCart&clear=1&id=1469464` |
| 5 | Signature interaction | **"A class night" timeline** — one Thursday evening 6:00→7:00pm, evening-sky gradient, **moon rises** as you scroll (night-time sibling of Day School's sun). Rundown DRAFTED by Claude from the week 1–4 content; owner corrects on preview |
| 6 | Class length | **1 hour (6–7pm)** |
| 7 | Curriculum | **Owner-supplied (verbatim below)** — W1 basics, W2 revision + outside walking, W3 recall, W4 real-world practical |
| 8 | Entry rules | Under 6 months + **same vaccine set as day school: DHP, Leptospirosis, Kennel Cough** (covers hall classes AND the day-school intros) |
| 9 | Trainers | **Unnamed for now** — "at least two experienced trainers at every class"; names/photos when site-wide team content lands |
| 10 | Hero media | **Video hero** cut from the 4 reserved drop-in clips (`puppy class.mp4`, `TKNnzquRcahYzd6fGJaF_Puppy+Class-v.mp4`, `0PetWEqiQ12Cd200oAko_Dennis+Puppy+Training-v.mp4`, `KoArWtFQc6oaJNkDThdM_Puppy+Training-v.mp4`) via the FFmpeg pipeline (tonemap if HLG); spare clips become in-page trust loops |
| 11 | Proof | **Graceful placeholder** testimonial slot (Intensive pattern); owner supplies the real story later |
| 12 | SEO | Title **"Puppy Training Classes in Hastings & St Leonards \| The Fairy Tails"**; meta description = legacy ("Small group puppy training evening classes based in Hastings for your pup and you! The experienced trainers will help you give your puppy the best start.") |
| 13 | Extras | ALL FOUR: kit list (Claude-drafted, owner corrects) · puppy-pathways cross-sell strip · FAQ accordion · day-school bridge section |
| 14 | Kit list draft | High-value treats · flat collar/harness + normal lead (no extendable) · mat/blanket for settle work · vaccination record (first class) · favourite toy · water. **DRAFT — owner corrects on preview** |

## Owner-supplied curriculum (verbatim, 2026-07-05)

- **Week 1** focuses on mastering basic skills, including sit, down, and settle. It also introduces homework to help build good home habits and prevent future issues such as separation anxiety and other common puppy-related challenges.
- **Week 2** begins with a revision of Week 1 skills, then introduces walking outside. Cover loose lead walking, walking techniques, engagement, responsiveness, and additional good habits for home.
- **Week 3** focuses on recall training.
- **Week 4** brings everything together with a practical session outside in a real-world environment.

## Section map

1. **Hero** — video loop (`data-hero-video` lazy pattern) + poster; headline; CTAs: Enquire (moss primary → `#enquire`) + "Reserve your place — £175" (honey, Acuity cart link).
2. **Intro** — "Small group evening classes for you and your puppy" verbatim, with the schedule sentence de-staled: "Classes are held at Concordia Hall, St. Leonards on Thursday evenings at 6pm."
3. **Why choose group classes** — verbatim five blocks (start early / two trainers / what you will learn [8 bullets] / what's included [THREE intros] / socialisation).
4. **The four weeks** — owner curriculum, week cards/steps (GSAP stagger; `overflow-x-clip` on the wrapper per the mobile lesson).
5. **SIGNATURE: A class night** — 6:00 arrive & settle → 6:10 warm-up (name game + focus) → 6:25 the week's skill → 6:40 practice + controlled socialising → 6:55 Q&A + homework → 7:00 home. Evening-sky gradient (dusk→night palette on pine/bark), moon marker rises along the trail. Reduced-motion: fully visible static list.
6. **How your pup benefits** — verbatim benefit cards + bond/understanding/positive-experience copy.
7. **Day-school bridge** — sells the 3 included intro sessions, what a day gives a puppy → `/dog-day-school`.
8. **Proof** — testimonial placeholder slot (graceful).
9. **Entry rules & kit** — under 6 months; DHP/Lepto/Kennel Cough; kit list draft; day-school rules apply on intro days (incl. females-in-season exclusion, per day-school policy).
10. **Pricing & how to book** — £175 card rendered from `pricing.json` `puppy-classes` + verbatim how-to-book copy + both CTAs.
11. **FAQ accordion** — vaccination timing, nervous/mouthy pups, who attends, missed-a-session (conservative "talk to us" phrasing where policy is unpublished — DRAFT, owner corrects).
12. **Puppy pathways cross-sell** — ~~DIY Puppy Course (**TEMP → `/blog`** until page 7 ships, `TEMP:` comment) · Boarding School for Puppies £1,200 → `/dog-boarding-school` · Comprehensive Puppy Training £1,200 → `/intensive-dog-training`.~~ **REBUILT 2026-07-21 — now TWO cards: DIY Puppy Course → `/puppycourse`** (the TEMP `/blog` target was flipped when page 7 shipped 2026-07-12) **+ ONE puppy programme card** rendering `board-train-puppy.publicName` → **"Puppy School"**, £1,200 for 4 weeks, → `/comprehensive-puppy-training`.
    - 🔴 **Why:** the row previously showed **`board-train-puppy` AND `puppy-intensive` side by side as if they were different products.** The owner confirmed on 2026-07-21 that they are **one** (*"they're one product"*) and `puppy-intensive` was deleted. **Do not re-split this card.**
    - 🔴 **A SECOND LIVE FALSEHOOD was caught here during the merge:** the old second card claimed the puppy was **"home every evening, trained all day"**. That is false — the puppy **boards**. The 2026-07-18 boarding sweep **missed it because the sentence named no dates and no weeks**, so it didn't match the phrases being hunted. **Never reinstate that line** — and treat this as the lesson: a factual sweep keyed on phrases misses paraphrases; sweep by **claim**, not by wording.
    - Current card blurb (live): *"The full residential start: toilet training, obedience foundations and structured socialisation, with daily reports home. Puppies travelling to us board for the whole four weeks; local families can keep the boarding flexible."* — that sentence is the **only** place on this page the boarding rule appears, it keeps the two groups in separate clauses, and the full rule lives in `pricing.json` `board-train-puppy.arrangements` (SEO.md locked #13).
13. **Enquiry form** — `service="Puppy Training Classes"`.

## Wiring / flip-backs shipped with this page

- `Header.astro` — nav link added (inside-out rule); **verify one-line desktop nav at 1440px AND mid widths** (owner rule).
- `scripts/verify-urls.mjs` — `/puppy-training-classes` planned → built.
- `astro.config.mjs` — `/puppy-classes` redirect TEMP `/#Trainingplans` → `/puppy-training-classes` (flip-back item).
- `src/pages/index.astro` — `detailHref['puppy-classes']` TEMP `#enquire` → `/puppy-training-classes` (flip-back item).
- Breed Matcher `FT.puppy` TEMP `/#Trainingplans` → `SITE+"/puppy-training-classes"` (backup first per standing rule; run `npm run test:breed-matcher`).
- `WEBSITE-PLAN.md` tracker row 4; HANDOVER 🔔 flip-back checklist updated.

## BUILD STATE

- 2026-07-05 — interview complete (3 AskUserQuestion rounds + follow-ups + owner curriculum message), spec written.
- 2026-07-05 — **BUILT + DEPLOYED + LIVE-VERIFIED** (commit `5ad8949`, production www.thefairytails.co.uk). All 13 sections per the map; media = `puppy-classes-hero.mp4` (clean hall clip; the `puppy class.mp4` twin has baked-in social graphics) + `puppy-walk-loop` + `puppy-settle-loop` + posters; 9 curated images (AI png, collar-poster graphic + logo dropped; real-hall WhatsApp photo kept as welcome polaroid).
- 2026-07-05 — **Spec amendments from the adversarial review (38 agents, 5 confirmed findings, all fixed pre-deploy):**
  - §7 bridge + hero sub: intros are worded "three intro sessions" NOT "three (full) days" — duration is unsourced and the day-school page models intros as 1/2/3-hour tasters. If the owner confirms the puppy-course intros ARE full days, the stronger copy can return.
  - §9: females-in-season exclusion is scoped to the day-school intro sessions only (folded into the day-school-rules line) — it was never confirmed as a hall-class rule.
  - §5 timeline: step entrance is **x-only** (CSS owns opacity — dim 0.55, spotlight via `.is-active`); mobile trail track at `left-[15px]` so the moon isn't clipped by `overflow-x-clip`.
  - Site-wide: desktop nav now `lg:`+ (tablets get the drawer); nav label "Intensive Training".
- 2026-07-21 — **§12 pathways row rebuilt (3 cards → 2)** with the puppy-SKU merge; shipped in deploy `ffb4486` (run 29861971032), LIVE. See §12 above for the two "never do this again" notes (don't re-split the card; never reinstate *"home every evening, trained all day"*).
- **OWNER REVIEW OPEN ITEMS:** class-night rundown times/blocks (draft) · kit list (draft) · FAQ answers (drafts — esp. missed-session + family attendance) · "Intensive Training" nav label · testimonial (placeholder waiting) · confirm whether the 3 day-school intros are full days (copy currently says "sessions") · then polish pass (Lighthouse/a11y/reduced-motion/Service JSON-LD) + sign-off + tracker tick.
