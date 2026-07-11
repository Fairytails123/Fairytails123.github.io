# FINAL page spec — `/` (Homepage — the LAST page, the flagship)

> **📸 Update 2026-07-07 (LIVE):** Track 1 ("Training that transforms", `#Trainingplans`) — previously photo-less — got a new "Out in the real world" `data-stagger` photo grid (6 real town/café/seafront/park shots, `realWorld` array), and the PROOF polaroid `rail` was topped up **9 → 13**. Source + method: `docs/training-photo-pipeline.md`; head-collar/muzzle screened. See HANDOVER 2026-07-07.

> Produced by the pre-build interview on **2026-07-02** (4 rounds, 16 questions). This is the **final
> word** for page 12, superseding the baseline in `WEBSITE-PLAN.md` where they differ. Locked
> site-wide decisions still apply (enquiry form = primary CTA, prices live in `pricing.json`, Acuity
> links byte-for-byte, warm parent-to-parent voice, "countryside editorial" design system). Reference
> implementation to mirror: `src/pages/dog-boarding-school.astro`. The homepage is built **LAST** and is
> meant to be **the strongest page on the site** — best animation, best graphics, the one Three.js/WebGL
> signature moment, everything the other pages proved now brought together.
>
> ✅ **STATUS: initial version BUILT 2026-07-02** (`src/pages/index.astro`; content + design + motion +
> WebGL; build 0 errors, verify-urls 0 failures; adversarial-reviewed, 12/14 findings fixed). **Committed
> `57d9a99` + pushed + LIVE 2026-07-02** (deploy verified 200 at https://fairytails123.github.io/). See the **BUILD STATE log** at the foot of this file. Copy marked *DRAFT* is mine to
> be refined; content marked *[OWNER]* is a fact I did not invent (graceful placeholder, swap before
> sign-off — the established Day School / Intensive pattern).

## Interview outcomes (2026-07-02)

| Topic | Decision |
|---|---|
| **Primary goal** | **Enquiry-first — every path leads to the enquiry form.** The form is the gravitational centre of the page. Acuity "Book" links appear only where contextually correct (grooming, existing clients, puppy-class cart), never as the homepage's main CTA. |
| **Hero** | **Bold 3D transformation moment** — the anxious → calm story as the site's one Three.js/WebGL signature. Lazy-loaded after LCP; static poster + full copy paint first (SEO/no-JS safe); **reduced-motion / no-WebGL → clean static hero**. Hard Lighthouse ≥ 90 gate; if the full 3D can't hold the budget or feels gimmicky, fall back to the "tasteful WebGL accent over the real hero video" variant (§Hero technical plan). |
| **Lead audience** | **Owners of struggling dogs** (anxiety, reactivity, pulling, poor recall) lead the copy and the hero; everyone else (day-care convenience, puppy owners, the club) follows. |
| **Voice** | **Warm, parent-to-parent** — reassuring, human, "we love them like our own." Consistent with the built pages. |
| **Structure** | **Two clear tracks** — **"Training that transforms"** (the struggling-dog programmes, leads) vs **"Day-to-day care & the club"** (day school, membership, lifestyle). The signature structural device; people self-select. |
| **Peripheral offerings** | **One warm "life in the club" section** — grooming (→ sister site), boarding, doggy events, social walks bundled into a single lifestyle band. Keeps training the focus up top. |
| **Breed Matcher** | **Inline interactive section** on the homepage (owner instruction 2026-06-20 + confirmed 2026-07-02: "for extra value to page visitors"). Frames the existing standalone tool in-page; on a result it hands the visitor into the enquiry funnel. Single source of truth stays `public/breed-matcher/index.html`. |
| **Proof emphasis** | **Photos & daily life** — dogs visibly thriving (drawn from the built `/gallery` asset set) is the primary proof, **not** a wall of testimonial text. The hero still carries **one** narrative transformation. All four credibility signals get a compact slot (below). |
| **Credibility signals (all confirmed real & displayable)** | Recognised **qualifications** · **force-free accreditation** (backs the two badges) · a **years + dogs-trained** stat · **public reviews/rating** (Google/FB). Exact numbers/logos = *[OWNER]*. |
| **Difference / positioning** | **The whole-dog club (A–Z)** — one place for a dog's whole life: training → day school → boarding → grooming → membership → lifelong support. This is the "why us" spine. |
| **Media** | **Reuse now, swap later** — build with the harvested homepage film + Board & Train hero footage + the gallery photos (graded to match); owner swaps in fresh homepage media before sign-off. |
| **Keep from current homepage** | ✔ **IKEA-bookcase analogy** (owners must do the daily work) · ✔ **"1066 country premier club"** framing · ✔ **both commitment badges** (pain-free care / improving industry standards) · ✔ **doggy events** (summer BBQ, Christmas party) & **pick-up/drop-off** — now corrected (below). |
| **About** | **Named founder + team photos** — the strongest trust play for a nervous owner. Founder "why we started" story, named, with photo; the team. Names/photos = *[OWNER]*. Keep consistent with the future `/contact` "Meet the team". |
| **⚠️ SITE-WIDE FACT FIX — pick-ups** | **Pick-up & drop-off is £1 per journey for pay-per-day bookings** (owner 2026-07-02). **PARTIALLY SUPERSEDED (owner 2026-07-04):** the owner supplied the old-site membership cards as the authority on "what is on offer" — **membership Full Days Tier 1/Tier 2 and the Dog Grooming Subscription DO include free pick-ups & drop-offs as a plan perk** (Half Days does not). £1/journey still stands everywhere outside those plans. `pricing.json` membership features are verbatim from the old-site cards — don't "reconcile" them back to £1. |

## Page structure (build order top → bottom)

1. **HERO — the 3D transformation moment (signature).** Full-viewport. Eyebrow *"Dog training · day school · board & train — in Hastings Country Park"*. Headline carries the transformation (DRAFT options, owner picks one):
   - *"The dog you love is still in there. Let's bring them back out."*
   - *"From anxious to at ease."*
   - *"Bring us your worried dog — we'll help you both breathe again."*
   Sub-line (DRAFT): *"Kind, real-world training and day school that turns nervous, reactive or overwhelmed dogs into calmer, happier companions — set in the heart of the Sussex countryside."* Primary CTA **"Start your enquiry"** (smooth-scrolls to the enquiry form / `#enquire`); soft secondary **"Or talk to us"** → `tel:` / WhatsApp `business.phones.main`. Trust strip (3 `.paw-bullet`): *force-free, qualified trainers · real-world countryside setting · daily reports home*. The WebGL "anxious → calm" scene sits behind/around the copy (§Hero technical plan). **Static fallback = poster frame + all copy fully visible** (no JS needed).
2. **REASSURANCE BAND — "We've helped dogs just like yours."** Speaks straight to the lead audience. DRAFT copy names the pain honestly (*lunging on the lead, barking at every dog, glued to your side, won't come back, can't settle*) then reframes warmly (*"You're not failing them — they just haven't had the right help yet. That's what we do."*). One daily-life photo. Soft CTA into the page. This is the emotional bridge out of the hero.
3. **THE WHOLE-DOG APPROACH — the convergence animation (signature, BUILT 2026-07-09).** Component `src/components/WholeDogFunnel.astro`, full-bleed **pine-950** between the cream reassurance band and the cream-100 club section. Twenty labelled inputs across four groups (*Day school & socialising · Out in the world · Handling & people · What we keep an eye on*); a coloured wire cables down from every chip and converges on a glowing circular portrait of a real dog (**Goldie**) that grows as the streams connect; resolves into *"A confident dog you can take anywhere"* + a `#enquire` CTA. The message: **behaviour training isn't one thing.** Ported from the owner's Claude-designed React prototype (`design_handoff_training_funnel_animation/`) but **rebuilt natively** — no React, no fixed canvas. Scroll-scrubbed and **pinned on desktop**; ambient particles/rings run on a separate rAF clock. Chip labels + group names **FINALISED 2026-07-09** (3-lens critique: brand voice / factual accuracy vs `pricing.json` / veterinary-claim risk). Goldie **approved**. One open owner question: whether `Happy at the groomer’s` should become `Happy being brushed` (grooming is the sister salon). Full detail + all the pin/geometry gotchas: `HANDOVER.md` 2026-07-09.

4. **THE DIFFERENCE — "The whole-dog club."** The positioning centrepiece (chosen differentiator). One place for a dog's whole life — a small **animated journey/orbit** (training → day school → boarding → grooming → membership, lifelong). Weaves in the kept **"premier club for the most beloved dogs in 1066 country"** language and the **two commitment badges** (pain-free care · improving industry standards). Warm, British.
5. **TWO TRACKS — the services spine (signature structural device).** A visually distinct split; scroll-driven reveal.
   - **Track A — "Training that transforms"** (leads; for struggling dogs). Two **flagship feature blocks**: **Board & Train £2,500** (+£300 large) → `/dog-boarding-school`, **Intensive £2,000** (+£300 large) → `/intensive-dog-training`; then a tidy grid for the rest → detail pages: **puppy versions £1,200**, **1-to-1 £49.99**, **Puppy Classes £175**, **free phone consult**. Carries the exact-case **`#Trainingplans`** anchor summary (renders from `pricing.json`, `board-train` + `training` categories). Enquiry-first CTAs.
   - **Track B — "Day-to-day care & the club"** (recurring). **Dog Day School** (+ a one-line cost-estimator teaser → `/dog-day-school`), **Membership** tiers summary → `/membership-plans`, boarding, social walks. Carries the exact-case **`#MembershipPlans`** anchor summary (renders from `pricing.json`, `membership` + `day-school`).
   - Both anchors MUST exist with **exact case** so legacy `/#Trainingplans` and `/#MembershipPlans` links still land.
6. **BREED MATCHER — inline interactive value section.** Heading DRAFT: *"Is your breed really a fit? Find out — honestly."* Intro (DRAFT): the tool keeps *your* chosen breed the hero and shows, honestly, how the right support closes the gaps. **The existing standalone tool framed in-page** (lazy-loaded; §Breed Matcher integration), with a "full screen" open link to `/breed-matcher/`. On a result the section funnels into the enquiry CTA. The site's stand-out "extra value" moment.
7. **PROOF — a day at Fairy Tails (photos & daily life).** The primary proof, per the interview. A rich, **gallery-fed** visual band — dogs thriving in the countryside, town and seafront (reuse the built `src/assets/pages/gallery/` set) as a draggable rail (`.drag-track`) / editorial mosaic. Plus a compact **credibility bar** with the four confirmed signals: *recognised qualifications* (badge/logos) · *force-free accreditation* · *[OWNER] X years / Y dogs trained* · *[OWNER] ★ Google/Facebook rating*. One **narrative transformation** callout (the hero dog) → links to its story. Parent testimonials = graceful placeholder until *[OWNER]* supplies wording.
8. **THE IKEA-BOOKCASE TRUTH — "training holds when you tighten the screws."** Keep the analogy (owner chose to). Reframed warmly: honest about the daily work owners must do, positioning Fairy Tails as the blueprint **and** the ongoing support. Leads into the free phone consult / enquiry. A trust/honesty beat that fits the brand.
9. **LIFE IN THE CLUB — the lifestyle band.** The bundled extras: **grooming** (→ sister site `groomingSite`, byte-for-byte), **boarding** ("home from home at The Barn"), **doggy events** (summer BBQ, Christmas party — kept), **social walks** (£20, existing clients only), the **£1/journey school-bus pick-up** (corrected). Warm lifestyle photos. The "dog shop — returning soon" gets at most a tiny mention or is omitted (owner's call at review).
10. **ABOUT / MEET THE TEAM — named founder + photos.** Founder *[OWNER: name]* + *"why we started"* story (DRAFT scaffold, owner refines), photo *[OWNER]*; the team with roles *[OWNER]*; located within Hastings Country Park, plenty of parking, £1/journey pick-up. Weaves the credentials. Kept consistent with the future `/contact` "Meet the team".
11. **FINAL ENQUIRY CTA + LOCATION (the gravitational centre).** Warm closing headline DRAFT: *"Tell us about your dog."* `<EnquiryForm service="General Enquiry" page="/" />` (id `#enquire`; locked field set; honeypot `website` + `elapsedMs<4000` fake-success; POSTs to the live n8n webhook). Beside it: address (Near the Milking Parlour, The Barn, Fairlight Place, Barley Lane, Hastings TN35 5DT), hours (`business.hours.display`), real Google Maps (`business.mapsUrl`), main line + WhatsApp. Every path on the page lands here.
12. **Footer** — existing `Footer.astro` component (contacts/NAP from `business`).

## Hero technical plan (the ONE WebGL showpiece)

- **Concept — "the settling storm."** A GPU particle field (single `BufferGeometry` of points + a custom shader — cheap, thousands of particles) begins **agitated and cool-toned** (turbulent, jittery — *anxiety*) and, over the hero entrance timeline and light scroll, **calms into a slow warm drift** in the moss/honey palette, resolving into a recognisable calm shape (candidate: a sitting-dog silhouette, the paw motif, or a rolling-hill horizon — decided in the animation pass). Subtle pointer/scroll parallax. Directly encodes *anxious → calm*.
- **Load order (SEO + LCP safe):** the hero's HTML, headline and **poster image** render server-side and paint first. Three.js + the scene are a **separate chunk, dynamically imported only after first paint / on idle**, homepage-only (never in the shared bundle). LCP is the poster/heading, not the canvas.
- **Fallbacks:** `prefers-reduced-motion`, `navigator.connection.saveData`, no-WebGL, or low-power → **skip WebGL entirely**; the poster + copy stand alone, fully legible. Same discipline as the video heroes.
- **Budget & escape hatch:** hard Lighthouse ≥ 90 (perf/SEO/a11y). Prototype first; if the full particle scene threatens the budget or reads as gimmick, **downgrade to the "tasteful WebGL accent"** (drifting particles/parallax fog over the real Board & Train hero video) — still distinctive, much lighter. Decision made on measured numbers, recorded in the BUILD STATE log.
- **Three.js** added as a dep, tree-shaken, homepage-chunk only, lazy. GSAP + ScrollTrigger drive the entrance/scroll timeline as elsewhere.

## Breed Matcher integration (inline)

- **Single source of truth unchanged:** `public/breed-matcher/index.html` (ships verbatim, served at `/breed-matcher/`). Do **not** fork or mirror it.
- **On the homepage:** frame it in §5 as a **lazy-loaded `<iframe src="/breed-matcher/">`** sized into a styled section (loads only when scrolled near — `loading="lazy"` + IntersectionObserver guard), with a prominent **"Open full screen"** link to `/breed-matcher/` and the section's own enquiry CTA beneath. Simplest, keeps the tool self-contained, zero engine duplication. (Alternative considered: a bespoke native inline "first question" that deep-links into the tool — more work, revisit only if the iframe framing feels off at review.)
- **Follow-up (known):** repoint the tool's `FT = {…}` service links from the old live domain to the new-site paths now that those pages exist (Board & Train, Intensive, Day School are live on preview). Track in `tools/breed-matcher/CLAUDE.md`.
- After any change: `npm run test:breed-matcher` (engine regression) then `npm run build && npm run verify-urls`.

## Built alongside this page (data, config & nav changes)

- **⚠️ `src/data/pricing.json` + copy — pick-up fact fix:** ~~membership Tier 1 & Tier 2 → £1/journey~~ **REVERSED by owner 2026-07-04** (old-site membership cards supplied as the authority): **Tier 1, Tier 2 and the Grooming Subscription include free pick-ups & drop-offs as a plan perk**; £1/journey applies to pay-per-day day school (Day School "£1 each way" — keep). Membership plan details in `pricing.json` (2026-07-04) are **verbatim from the old-site cards**: Half Days £275/mo AM-or-PM +£25 large dogs (booked & invoiced, hot towel wash, monthly bath & brush with maintenance trim, priority boarding, half-price Full Dog Grooming); Tier 1 £375/mo +£25 (adds Full-Day School, free pick-ups & drop-offs, half-price grooming — **NO free training session: the old-site card had one but the owner removed it 2026-07-04**); Tier 2 £750 bi-monthly **+£0 large dogs** (FREE Full Dog Grooming — **2 free training sessions/cycle, owner corrected 2026-07-04 from the old-site card's 4**; the old aggregation parenthetical was dropped with it); Grooming Sub £25/mo for regular grooming dogs (online booking code, reminders, free pick-ups, monthly maintenance OR full groom, free nail clipping).
- **Anchors:** the homepage MUST emit **`#Trainingplans`** and **`#MembershipPlans`** summary sections with **exact case** (GH Pages is case-sensitive) — legacy links point at them. Render both from `pricing.json` (never hard-code prices).
- **`src/components/Header.astro`:** the nav is now **complete** — add the **Home** link and confirm all shipped service pages are present; header primary CTA becomes **"Start your enquiry"** (enquiry-first), not the Acuity "Book Appointment". Re-check the nav at tablet widths now it's full (HANDOVER flagged the growing nav as a watch-item).
- **`src/pages/index.astro`:** **replace the temporary holding page** with the real homepage (this spec). It is currently only a stub so `/` resolves on the preview — it is NOT the reference implementation; Board & Train is.
- **`scripts/verify-urls.mjs`:** flip `/` planned→**built** on ship.
- **`astro.config.mjs`:** `site` stays the final custom domain (canonicals already correct on preview); no redirect changes (homepage is root). Confirm the sitemap includes `/`.
- **Dependencies:** add **`three`** (lazy, homepage-chunk only). GSAP/ScrollTrigger already present.
- **Assets:** homepage photos → `src/assets/pages/index/` (from harvest / reuse gallery set, full-res, via astro:assets `<Image>`); hero video (if the accent-fallback is used) → `public/media/` (graded via `ffmpeg-static`, HLG→SDR if HDR — `docs/video-hero-pipeline.md`); hero **poster** always present as the WebGL fallback.
- **`WEBSITE-PLAN.md`:** tracker row 12 pre-build ticked; **`HANDOVER.md`** updated to point the next session here.
- **Defects auto-fixed (site-wide rule):** any lingering `mailto:mymail@…`, malformed `wa.me`, empty Maps links, "Contact us → `/`", or Employee-Login-in-footer — none on the homepage build.

## Animation contract (mirror `dog-boarding-school.astro`)

- Register GSAP + ScrollTrigger; idempotent `init()` guarded by the standard `data-gsapInit` flag; wrap all motion in `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`. **Reduced-motion returns early → page fully visible & static.**
- Initial hidden states set in **JS, never CSS** (no-JS/pre-hydration page shows everything). Standard hooks: `data-reveal`, `data-stagger`, `data-hero-*`.
- ClientRouter lifecycle: re-run `init()` on `astro:page-load`; **kill all ScrollTriggers + `revert()` the matchMedia on `astro:before-swap`** (leak discipline — the gallery build hit this); dispose the WebGL scene/renderer on `astro:before-swap` too (free GL context).
- Signature timelines: the WebGL "settling storm" hero; the two-tracks scroll split; the whole-dog-club orbit; the daily-life drag rail; number count-ups on the credibility stat.

## SEO / structured data

- **Title (DRAFT, owner approves):** `Dog Training, Day School & Board & Train in Hastings | The Fairy Tails K9 Centre`
- **Description (DRAFT):** `Kind, force-free dog training, day school and board & train in Hastings Country Park — turning anxious, reactive and overwhelmed dogs into calmer, happier companions. Book a free consult.`
- **JSON-LD (establish the site's primary structured data here):** `LocalBusiness`/`Organization` from `business.ts` — name, NAP, `geo`, `openingHoursSpecification` (from `hours.jsonLd`), `telephone`, `sameAs` (socials), `priceRange`, logo, `areaServed` Hastings/1066 country. This is the flagship page for org-level schema; per-service `Service` schema stays on the detail pages.
- Canonical/OG owned by `Base.astro` (points at the final domain even on preview — correct).

## Performance & accessibility gates (hard)

- Lighthouse ≥ 90 perf/SEO/a11y (the WebGL escape-hatch above protects perf).
- Full reduced-motion pass: WebGL skipped, all timelines static, content intact.
- Keyboard + focus order through the two tracks, the iframe'd matcher, and the enquiry form; visible focus; the iframe has an accessible title.
- `npm run verify-urls` (dist) green; enquiry form **live end-to-end n8n test from a real browser** (service = "General Enquiry"; read the execution — validation ≠ proof).

## Build plan (4 passes — design + motion folded in, never a bare structure pass)

Per the owner's process and the standing rule *"never present a bare structure pass; fold design + motion in before showing."*
1. **Structure + design together** — full page in the countryside-editorial system, all 12 sections, DRAFT copy in place, reused media, `[OWNER]` placeholders graceful. Owner reviews on the live preview.
2. **Animation** — GSAP scroll-stories + the WebGL hero (prototype → measure → keep-or-downgrade), micro-interactions; all reduced-motion gated.
3. **Content swap** — owner-supplied soul content (founder story/photos, transformation, exact credentials/numbers/reviews, any fresh media) replaces placeholders.
4. **Polish** — Lighthouse ≥ 90, reduced-motion, a11y, SEO + JSON-LD, `verify-urls`, live enquiry test → owner sign-off → tick tracker row 12 → **the site is feature-complete → Stage 5 cutover checklist.**
   - *(Ultracode note: at build time I'll orchestrate this with parallel workflows — section drafting, WebGL-hero prototyping, and an adversarial correctness/perf review — rather than a single linear pass.)*

## Owner inputs still needed (the "soul" — I will NOT invent these)

1. **Founder name(s) + "why we started"** (one short story) + **founder/team photos & roles**. (Is "Kam" the owner-trainer?)
2. **One real transformation** — a named dog + owner, before → after, **with consent** to show photos/video/words. (Is Archie the one, or a stronger story?) Becomes the hero narrative + the §6 callout.
3. **Exact credentials** — which qualifications; which **force-free / industry accreditation body** (name/logo) behind the two badges.
4. **Real track-record number** — *X years operating / Y dogs trained* (an honest figure we can state).
5. **Reviews** — the **Google/Facebook rating + count**, and whether to show a live widget or a static, sourced quote/rating.
6. **Hero copy pick** — choose/adjust one of the DRAFT headlines; approve the SEO title/description.
7. **Media (optional now)** — fresh homepage hero footage/photos, and (optional) one before/after "anxious → calm" clip for the hero. Reuse-now assets carry the build until then.

> Reply **"draft it"** for any of 1–3 and I'll write a strong version for you to correct rather than block the build.

## BUILD STATE log

**2026-07-02 — initial version built** (`src/pages/index.astro`, replacing the holding stub).

- **All 11 sections built** (the structure as it stood on that date — the whole-dog convergence section was added as a new section 3 on 2026-07-09) per the structure above, mirroring `dog-boarding-school.astro` conventions (component classes, `data-reveal`/`data-stagger`/`data-hero-*` hooks, HillDivider colour rhythm, `gsap.matchMedia`, ClientRouter lifecycle). Prices render from `pricing.json`; `#Trainingplans` + `#MembershipPlans` exact-case anchors present; `LocalBusiness` JSON-LD on the page.
- **WebGL hero implemented** with `three` (added as a dependency): a `ShaderMaterial` `THREE.Points` "settling storm" (uniform `uCalm` tweened 0→1 by GSAP), dynamic-imported after first paint, gated off for reduced-motion / `saveData` / no-WebGL, paused off-screen + on tab-hide, disposed on `astro:before-swap` with nav-staleness (`isConnected` + generation-token) guards. Static countryside photo (`gallery-15`) is the LCP + fallback (`fetchpriority="high"`).
- **Breed Matcher** embedded via a lazy (IntersectionObserver) `<iframe>`; `data-src="/breed-matcher/index.html"` (explicit index so it works in the dev server too; the user-facing "Open full screen" link stays `/breed-matcher/`). `<noscript>` fallback card. **TODO:** repoint the tool's `FT={…}` service links from the old domain to new-site paths.
- **Media:** reused (gallery + day-school + a Board & Train "Kam" shot) — swap for fresh homepage media before sign-off.
- **Site-wide fact fixes shipped:** dog walking **£5** (was £2); pick-ups **£1/journey for everyone** (membership "free pickups" removed); header CTA → **enquiry-first** (`/#enquire`).
- **Adversarial review** (7-agent workflow): 14 verified findings, **12 fixed** (see HANDOVER 2026-07-02). **2 deferred:** `og:image` + JSON-LD `image` — need a **1200×630 OG card** asset (make one from a hero/gallery frame, drop at `public/og/home.jpg`, add `ogImage={\`${business.domain}/og/home.jpg\`}` to `<Base>` and `image` to the JSON-LD).
- **Committed (`57d9a99`) + pushed + LIVE 2026-07-02** — Pages deploy run `28611528666` succeeded; verified serving 200 at https://fairytails123.github.io/. Owner reviews on the live preview.

**2026-07-09 — NEW section 3 `<WholeDogFunnel />` built, adversarially reviewed, deployed + LIVE** (commits `a320354` build, `41e7a80` review fixes; Hostinger deploys `29045600182` + `29046034175`, both green first try).

- Owner-chosen: scroll-scrubbed + **pinned** (not autoplay/loop) · **pine-950** backdrop (not cream) · the prototype's medical 4th group reframed to *"What we keep an eye on"* (observation, never diagnosis) · centre portrait = a real, head-collar-screened training photo (**Goldie**, `src/assets/pages/home/whole-dog-goldie.webp`).
- Deliberate departures from the prototype: **dropped the closing logo card** (a wordmark mid-homepage reads as an advert) and the full-cover title card (the section's real `<h2>` anchors it); 20 chips, not 22.
- New design-system token **`clay-500` `#c16a41`** (`global.css` `@theme`) — the 4th wire hue. The four hues descend a luminance staircase so the streams separate for colour-blind viewers on lightness, not hue.
- **This is the repo's first ScrollTrigger `pin:`.** Read the HANDOVER 2026-07-09 block before touching it — the pin must clear the fixed header, is gated on width AND height in CSS + `matchMedia` + a runtime content-fits check, and must never carry `invalidateOnRefresh`.
- Adversarial review (6 dimensions × 3 refuters, 84 agents; 26 raised → 17 refuted → 9 confirmed, all fixed). Biggest: the outcome + primary CTA were `autoAlpha`-hidden (i.e. `visibility:hidden`) until ~65% of the scrub, removing them from the a11y tree and tab order. Now opacity-only + `pointer-events` + a `focusin` snap-to-end.
- **Copy finalised + Goldie approved 2026-07-09.** Group 4 rewritten to warm lay observation (`How they’re eating` / `Toilet habits` / `Energy and mood` / `Any sign of discomfort` / `Anything out of character`) — never diagnosis or treatment; `Dog Day School` uses the verbatim product name. **Owner still owes:** the grooming-chip question (`Happy at the groomer’s` vs `Happy being brushed`) · a real trackpad/phone check of the 2-viewport pin length · confirming the added homepage scroll depth.

**Remaining to reach sign-off:** swap all *[OWNER]* placeholders (founder/team, transformation, exact credentials/numbers/reviews) → pick hero headline + approve SEO → the OG card → polish pass (Lighthouse ≥ 90 / a11y / reduced-motion audit) → live enquiry-form n8n test → owner sign-off → tick `WEBSITE-PLAN.md` row 12 → **site feature-complete → Stage 5 cutover**.

## ADDENDUM (2026-07-11) — whole-dog portrait swapped to the malamute

The owner's new `Master images/` pool (gitignored, repo root) supplied its first placement: image `087` — a smiling malamute sitting on the seafront boardwalk — **replaces Goldie** at the WholeDogFunnel core (`src/assets/pages/home/whole-dog-malamute.webp`, 400px-square face-centred cut from a 600×400 source; goldie asset deleted). Caption = "On the seafront" until the owner supplies the dog's first name; alt text describes the malamute. Commit `426ac50`, live-verified.

**Second master-pool placement (2026-07-11, `149460e`):** image `2` — the golden-hour playground shot — into the club-difference section ("One place for the whole of their life"), which gained the standard text+polaroid split header (copy left, polaroid right at +2°, caption "The playground at golden hour"; the 5-stop journey grid unchanged below). Asset `src/assets/pages/home/club-playground.webp` (600×800 full frame from `Master images/2.jpg`). Live-verified, 390px stack checked.
