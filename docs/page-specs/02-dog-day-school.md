# FINAL page spec — `/dog-day-school` (Dog Day School)

> Produced by the pre-build interview on **2026-06-29**. This is the **final word** for page 3,
> superseding the baseline in `WEBSITE-PLAN.md` where they differ. Locked site-wide decisions
> (enquiry form = primary CTA, prices live in `pricing.json`, Acuity links byte-for-byte, warm
> parent-to-parent voice, "countryside editorial" design system) still apply. Reference
> implementation to mirror: `src/pages/dog-boarding-school.astro`.

## Interview outcomes (2026-06-29)

| Topic | Decision |
|---|---|
| Page arc | Welcome → why day school (enrichment philosophy) → **a day in the life (signature)** → why people choose us → proof → CBS → pricing + estimator → joining (assessment + criteria + health + kit) → how to join → enquiry form. |
| Booking flow | **Acceptance-gated.** Primary CTA = enquiry form (request an assessment). Secondary CTA for accepted regulars = a smaller "already with us? book your days" → `acuity.main` (byte-for-byte). No direct public day-booking for new dogs. |
| Signature animation | **"A day in the life" scroll-story** — the typical-day timetable as the scroll-driven centrepiece (a paw/sun travels the hours; each block reveals & highlights). Reduced-motion fallback: clean static stacked timeline. |
| Hero | **Short looping muted video**, cut from the **harvested** day-school clips (arrivals / enrichment), poster-image fallback. Owner swaps in fresh footage later. |
| Memberships | **Teaser + link only** — a short "save with membership" callout linking to the future `/membership-plans` page. No full tiers/pricing duplicated here. |
| Boarding | **Moved out.** Overnight-boarding logistics (old `/boarding-information`) go to Board & Train, NOT here. This page covers **day-school** drop-off/collection only. Redirect change: `/boarding-information` → `/dog-boarding-school` (was `/dog-day-school`). |
| Pricing — PM half day | **Removed.** There is **no PM half-day**. Day-school offerings are now **Full Day** + a single **Half Day (AM)** — the old AM rate, **mornings only**; the label must show it is AM/mornings. |
| Pricing — full-day inclusion | **Remove "teaching basic commands"** from full-day inclusions (no longer offered). Light obedience practice still happens within the day; dedicated training is CBS. |
| Estimator | **Yes**, in the pricing section — full/half × dog size × days per week (+ "comes every week" toggle) → live daily + monthly cost incl. the weekly-booking discount. **Weekly-discount rate applies ONLY when the dog attends every week for the period** (a standing weekly booking), not just for several days in one week. Reads `pricing.json` so it never drifts. |
| Proof section | **All four**: Day School & CBS **report samples** (harvested screenshots — concrete differentiator), parent **testimonials** (placeholder), draggable **photo rail** (harvested photos), **promo video** clip (harvested). |
| CBS | Kept as its own section — **£15/session flat (no large-dog surcharge)**, ~30 min, recorded on camera, video link sent; for dogs needing extra help; covers lead pulling, focus, recall, obedience, town walks; subject to availability. |
| Admissions tone | **Honest but warm-framed** — real criteria, clearly stated as "how we keep every dog safe," in a tidy checklist/accordion. Not harsh. |
| Naming | **Drop "open roaming pack."** Use friendlier wording — "the day-school group" / "the pack of friends." |
| 8am rule | **State plainly, low-key** — earliest arrival 8am in the hours/drop-off info; no council-planning explanation on the page. |
| Assessment & tasters | A **set assessment** made of **three introductory taster sessions at £12.50 each** (£37.50 for the three). Each needs collar + harness + ID tags; staff debrief after each. After the three, further attendance is at the standard half/full-day rate (tasters are **not** credited unless owner says otherwise). |
| Vaccination & health | Required: **DHP, Lepto, Kennel Cough.** Intact males over 6 months subject to the neutering rule. **Females in season excluded.** (Plus existing: no banned breeds/crosses, no dogs on routine medication / ongoing medical / in recovery, no risky behaviour, size-ratio waitlist, muzzle/isolate safety declaration.) |
| Kit list | **Unchanged** — carry the live "getting ready" list verbatim (collar + ID, appropriate collar, non-retractable lead, fitted harness with handle, vaccination card, microchip current, flea-treatment self-declaration, named lunch box, blanket from home, plain boiled chicken treats only, signed registration form). |
| Phone | Page contact = **main line 01424 300668** (from `business.ts`). |
| Media | **Use harvested media now**, graceful placeholders for owner-supplied extras (testimonials, fresh hero footage). |
| SEO | **Approved.** Title: `Dog Day School & Doggy Day Care in Hastings | The Fairy Tails K9 Centre`. Description: `Enrichment-led doggy day school near Hastings Country Park — structured play, socialisation, light training and daily reports. Full & half days, with local pick-up & drop-off.` |
| Voice / design | Locked site-wide — warm parent-to-parent; countryside-editorial palette/type; reuse existing component classes. |

## Page structure (build order top → bottom)

1. **Hero** — looping muted bg video (harvested day-school clips; poster fallback). Eyebrow "Doggy Day School · Hastings"; warm headline around *"Where dogs learn that learning is fun"*; sub-line; primary CTA **"Send an enquiry"** (anchors to form) + secondary **"Already with us? Book your days"** → `acuity.main` (byte-for-byte). Trust strip (3 `.paw-bullet`): enrichment-led, not just minded · local pick-up & drop-off · daily reports home.
2. **Welcome** — the live "stay, play & learn" pitch (verbatim from harvest): fun, safe place to stay/play/learn; happy, active, busy; socialise with furry friends; space, learning equipment, timetabled activities.
3. **Why day school — enrichment philosophy** — the *Enrichment* essay (feral-dog ~70% framing) + curated benefit pillars from the day-care blog, rebranded to "day school" / all ages, British English, typos fixed. Pillars (pick ~5–6, `data-stagger` cards): comprehensive socialisation · energy & enrichment · mental stimulation · routine & structure · confidence & adaptability · independence (eases separation anxiety) · staff observation & feedback. Support-for-working-parents woven into the lead.
4. **A day in the life — SIGNATURE SCROLL STORY** — the updated timetable below as the scroll-driven centrepiece (paw/sun travels the hours; each block reveals + highlights; reduced-motion → static stacked timeline). Transport windows intentionally overlap on-site activity; the visual handles overlap gracefully. Hours/earliest-arrival note (open 8am, drop-offs to 10am; closes 5:30pm) sits here.
   - **7:45–9:30am** — Bus pick-up round & arrivals
   - **8:00–10:00am** — Parent drop-offs (we open at 8am; drop off any time up to 10am)
   - **9:30–10:30am** — Welcome, settling in & checks (health, poop & bag checks)
   - **10:30am–12:00pm** — Walking & enrichment activities
   - **11:00am–12:30pm** — Lunch & feeding
   - **12:30–1:30pm** — Rest period (anywhere suitable — not only indoors)
   - **1:30–2:30pm** — Afternoon engagement & prep (engagement, some obedience practice, finishing daily reports, preparing van load-ups)
   - **From 3:00pm** — Van load-up & departure (loading, headcounts, vans depart)
   - **By 4:30pm** — Return journeys completed
   - **Until 5:30pm** — Parent pick-ups (we stay open until 5:30pm)
5. **Why people choose us** — the 4 benefit points + harvested icons: Regular buddies · Local pick-ups & drop-offs (the school bus, £1 each way) · Strict entrance criteria · We love dogs. Followed by the short ethos band (Treating your pooch like our own · A calm & positive atmosphere · A structured day) — verbatim from harvest.
6. **Proof** — four blocks, Board-&-Train graceful-placeholder pattern: (a) **report samples** — the real Day School Report + CBS recorded-video report (harvested screenshots) as polaroids; (b) **parent testimonials** (placeholder until owner supplies wording); (c) **draggable photo rail** (`.drag-track`) of harvested day-school photos — beach, bus, climbing frame, focus work, doggy friends; (d) **promo video** clip (harvested Day School promo / arrivals, lazy + muted + reduced-motion-gated).
7. **Confidence Building Sessions (CBS)** — £15/session flat, ~30 min, recorded on camera with a video link sent; "designed for dogs who need a bit of extra help"; helps with lead pulling, focus, recall, obedience, town walks; subject to availability. The in-school training upsell.
8. **Pricing + estimator** (renders from `pricing.json`, day-school category) — **Full Day £24.99** (£19.99 on regular weekly bookings, +£10 large) · **Half Day £19.99** (£14.99 weekly, +£5 large). Add-ons noted: school bus £1 each way · dog walking +£2 · CBS £15. **Interactive estimator** under the cards (full/half × standard/large × days per week + "regular weekly booking?" toggle → daily + monthly total incl. weekly discount). **Membership teaser** → link to `/membership-plans`.
9. **Joining the school** — honest-but-warm. The journey: enquire → **introductory assessment = three taster sessions** (1hr → 2hr → 3hr, **£12.50 each**, collar + harness + ID each time, staff debrief after each) → acceptance into the day-school group → book regular days. Then **admission criteria** (warm-framed accordion/checklist): vaccinations **DHP, Lepto, Kennel Cough**; intact males >6mo neutering rule; **females in season excluded**; no banned breeds/crosses; no dogs on routine medication / ongoing medical / in recovery; no risky behaviour (route to training first); we keep a healthy size ratio (may waitlist); safety declaration (muzzle/restrict/isolate/send home a dog that presents a risk). Earliest arrival 8am; visits by appointment after 4pm weekdays, without a dog. **Getting-ready kit list** (accordion, **unchanged** verbatim).
10. **How to join — 4 steps** — 1. Send an enquiry · 2. Introductory assessment + 3 taster sessions (£12.50 each) · 3. Acceptance into the school · 4. Book your regular days. Leads into the enquiry form.
11. **Enquiry form** (primary CTA target) — `<EnquiryForm service="Dog Day School" page="/dog-day-school" />`; locked field set; honeypot `website` + `elapsedMs<4000` fake-success; POSTs to the live n8n webhook. Closing line: main line 01424 300668 + WhatsApp.

## Built alongside this page (data, config & nav changes)

- **`src/data/pricing.json`** — remove `day-half-pm`; rename `day-half-am` → name **"Half Day"**; in `day-full` features remove "commands" (e.g. → "Activities & socialisation training"); add an **assessment/taster** entry (id `day-taster`, "Introductory taster session", £12.50, unit "per session", note "3 required before joining", category `day-school`) rendered in §9 (not as a price card); `cbs` stays £15 with `largeDogSurcharge: null`.
- **`astro.config.mjs`** — change redirect `'/boarding-information': '/dog-day-school'` → `'/dog-boarding-school'`. (`'/admission-process': '/dog-day-school'` stays — admissions content lives here.)
- **`scripts/verify-urls.mjs`** — flip `/dog-day-school` planned→built on ship; reflect the `/boarding-information` redirect-target change.
- **`src/components/Header.astro`** — add the **Dog Day School** nav link (nav grows inside-out as pages ship).
- **Assets** — page photos → `src/assets/pages/dog-day-school/` (from harvest, full-res; rendered via astro:assets `<Image>`); hero video → `public/media/day-school-hero.mp4` + `public/media/day-school-poster.jpg` (cut via `ffmpeg-static`; HLG→SDR if any source is HDR — see `docs/video-hero-pipeline.md`). Drop the AI ChatGPT image + the stray vegetable stock photo.
- **`WEBSITE-PLAN.md`** — tracker row 3 pre-build ticked; baseline + redirect map updated to match these decisions.
- **Defects auto-fixed** (carried from the site-wide rule): broken `mailto:mymail@…` button, "Contact us → `/`" bug, malformed `wa.me` links, empty Google-Maps link, am/pm timetable typos, no Employee Login in the public footer.

## Animation contract (mirror `dog-boarding-school.astro`)

`data-page="day-school"` root; idempotent `init()` guarded by `data-gsapInit`; all motion inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; initial hidden states in JS only (no-JS shows everything); ClientRouter lifecycle (re-init on `astro:page-load`, kill all ScrollTriggers on `astro:before-swap`); hero video `preload="none"`, lazy `.load()/.play()` after first paint, skipped for reduced-motion / `saveData`. Signature = the §4 day-in-the-life timeline trail. Estimator is plain interactive JS (works regardless of motion pref); photo rail uses the existing `.drag-track` logic (mouse-drag, outside the motion gate).

## Owner inputs still open for this page (needed before sign-off, not before build)

- [x] Assessment maths: 3 × £12.50 = **£37.50** total; tasters **not** credited toward future days (confirmed 2026-06-29).
- [x] Estimator rule: weekly-discount rate applies **only when the dog comes every week** for the period (confirmed 2026-06-29).
- [x] Half-day label: **"Half Day (AM)" — mornings only** (confirmed 2026-06-29).
- [ ] Parent testimonial wording (+ optional family/dog photos) — or approve building placeholders.
- [ ] Any fresh hero footage / day-school photos to swap for the harvested set later.
- [ ] (Optional, later) a day-school-specific Acuity appointment type for the regulars' "book your days" link (currently `acuity.main`).

## Sign-off gates (from WEBSITE-PLAN.md)

Owner sign-off on the live preview · `verify-urls --dist` · Lighthouse ≥ 90 (perf/SEO/a11y) · reduced-motion check · enquiry form live-tested end-to-end with the n8n execution read (CORS from a real browser).

---

## BUILD STATE (2026-06-29 — content + design + motion BUILT, verified on local preview, awaiting owner review + polish)

**Source:** `src/pages/dog-day-school.astro` (mirrors the Board & Train reference). Built with the `frontend-design` skill's craft bar applied within the locked countryside-editorial system.

**What's implemented vs this spec:**
- Full arc (§Page structure 1–10), copy lifted/adapted from the harvest verbatim, all decisions applied.
- **Signature "a day in the life" timeline** — honey trail + scrubbed paw marker + step highlighting (reuses the Board & Train mechanic, `data-day-list`/`data-day-step`), using the owner's updated timetable. Reduced-motion → static full timeline.
- **Interactive estimator** — full/half × standard/large × days per week × "comes every week" → live per-day/week/month, reads prices from `pricing.json` data-attributes. Verified live: Full/Standard/3 = £24.99/£74.97/£325; Half/Large/5/weekly = £19.99/£99.95/£433. Works under reduced motion (it's interactive, bound before the motion gate).
- **Proof** — click-to-play promo clip (poster) + Day School & CBS report polaroids + draggable photo rail; testimonials = graceful dashed placeholder (owner to supply).
- **CBS** section (£15 flat), **pricing** cards (Full Day + Half Day (AM); PM removed; "commands" removed), **membership teaser** → `/membership-plans`, **joining** (4 steps + £12.50 taster note + criteria accordion incl. DHP/Lepto/Kennel-Cough + females-in-season + gov.uk banned-breeds link + kit-list accordion), **enquiry form** (`service="Dog Day School"`).
- Animation contract mirrors the reference (`data-page="day-school"`, idempotent `data-init` guard, `data-gsap-init` CSS hook, matchMedia gate, ClientRouter lifecycle, hero video lazy + reduced-motion/saveData skip).

**Media (harvested, graded via `ffmpeg-static`):** hero loop `public/media/day-school-hero.mp4` (1.7 MB, from the "arrivals" clip, centre-cropped + warm grade) + `day-school-poster.jpg`; proof clip `day-school-promo.mp4` (3.2 MB) + `day-school-promo-poster.jpg`. Page photos in `src/assets/pages/dog-day-school/` (AI ChatGPT image + vegetable stock photo dropped).

**Data/config:** `pricing.json` (PM half removed, "commands" removed, `day-taster` £12.50 added, Half Day labelled "Half Day (AM)"); `astro.config.mjs` (`/boarding-information` → `/dog-boarding-school`); `verify-urls.mjs` (`/dog-day-school` → built; `npm run build && verify-urls --dist` → 0 failures); `Header.astro` (Dog Day School nav link added).

**Shipped 2026-06-29:** committed `c59ca9f` + pushed to `main`; **LIVE on the preview** at `https://fairytails123.github.io/dog-day-school` (verified 200). Also shipped a site-wide contact fix (dead `07842 116216` removed; `01424 300668` is the only public number, carries WhatsApp) and a design-elevation pass (dawn→dusk sun timeline, estimator count-up, why-us icon hover).

**Still open before sign-off:** owner bug-check on the preview · parent testimonials · any fresh hero footage · then the polish pass (Lighthouse/reduced-motion/SEO/JSON-LD) + enquiry-form live n8n test.
