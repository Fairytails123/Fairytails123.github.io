# Page 6 — Membership Plans — FINAL SPEC (pre-build interview 2026-07-11)

**Slug:** `/membership-plans` (NEW page — no old-site equivalent; the old site carried membership as a homepage section, and the homepage keeps the exact-case `#MembershipPlans` anchor so legacy links still land). Supersedes the WEBSITE-PLAN baseline for this page.
**Source data:** `src/data/pricing.json`, `category: "membership"` — **owner-corrected 2026-07-04 and the single source of truth.** Do NOT "reconcile" against other pages: T1 has NO free training session; T2 = TWO free sessions per (2-month) cycle; **free pick-ups & drop-offs ARE a T1/T2/grooming-sub perk** (everyone else pays £1/journey). Never hard-code money — render from data with `gbp()`.
**Reference implementation:** `src/pages/dog-boarding-school.astro` conventions; `training-plans.astro` for the flat data-driven card grid.

## Locked interview decisions (owner, 2026-07-11)

| # | Topic | Decision |
|---|-------|----------|
| 1 | **Days included** | **Full-time, all tiers.** Every membership covers full-time attendance (every weekday / as often as you like). **Tier 2 is purely the higher-perk commitment tier** — same £375/mo equivalent as T1 but billed £750 per 2-month cycle, adding Free Full Dog Grooming + two free training sessions per cycle + no large-dog surcharge. Write the copy so this is plain (T1 vs T2 = perks and commitment, not more days). |
| 2 | **Savings maths** | **Real animated £ counters**, computed live from `pricing.json` (never stale). Comparison basis: full-time (5 days/week) day school **at the weekly-discount rate** — the honest comparison, not the £24.99 headline rate. See formula below. |
| 3 | **Apply CTA** | **On-page apply form** — the site-wide `EnquiryForm` with `service="Membership"` / `page="membership-plans"`, framed as *Apply for membership* (eligibility-gated product; not buy-now). Same n8n webhook + spam gate as everywhere. |
| 4 | **Nav** | **Footer + links only — NO header nav change** (nav stays 6, one-line-locked). Footer gains a Membership Plans link; the homepage `#MembershipPlans` section and the day-school membership teaser point here (TEMP flip-backs below). |
| 5 | **Hero** | **PLACEHOLDER for an owner-designed animation.** The owner will design a hero animation with Claude design (same handoff pattern as `design_handoff_training_funnel_animation/` → native rebuild, per `WholeDogFunnel`). Build and SHIP the page with a clean static hero (real photo or type-led band) in a clearly marked slot — `<!-- HERO ANIMATION SLOT: owner design handoff pending (2026-07-11) -->` — sized so swapping the animation in later doesn't reflow the page. Do NOT invent a bespoke animation now. |
| 6 | **Featured tier** | **Full Tier 1 (£375/mo) elevated as "Most popular"** (ring/badge treatment like training-plans' free-consult card); T2 positioned as the step-up, Half Days as the lighter option. |
| 7 | **Grooming subscription** | **Separate band** — the three school-membership cards in the main row; then a distinct **"For our grooming regulars"** section for the £25/mo Dog Grooming Subscription with its own CTA to the sister salon's Acuity (`https://thefairytailsdoggrooming.as.me/schedule.php`, byte-for-byte). Keeps the two eligibility stories clean. |
| 8 | **Framing** | **Warm but gated.** Honest "this is for our school family" tone — clear eligibility path (3 taster sessions → acceptance as a registered school dog → membership) with NO artificial scarcity. Weave in club language lightly; don't do limited-spaces theatre. |

## The 4 tiers (from `pricing.json` — render, don't retype)

| Tier (`id`) | Price | Large dog | Key perk deltas | CTA |
|---|---|---|---|---|
| Membership Half Days (`membership-half`) | £275/mo · AM or PM | +£25 | Hot towel wash, monthly bath & brush + maintenance trim, priority boarding, half-price full groom. (NO free pick-ups on this tier — not in its data.) | Apply form |
| Full Days Tier 1 (`membership-full-t1`) — **FEATURED** | £375/mo | +£25 | Everything above **+ free pick-ups & drop-offs** (no bath/hot-towel delta — read features from data). NO free training sessions. | Apply form |
| Full Days Tier 2 (`membership-full-t2`) | £750 bi-monthly (= £375/mo) | £0 | T1 perks + **FREE Full Dog Grooming** + **two free training sessions each cycle** + no large-dog surcharge. | Apply form |
| Dog Grooming Subscription (`grooming-subscription`) | £25/mo | n/a | Separate audience: regular grooming dogs. Online booking code, reminders, free pick-ups/drop-offs, monthly maintenance OR full groom, free nail clips. | Sister-salon Acuity (byte-for-byte) |

Eligibility line (all three school tiers, from data): *"Available to registered school dogs who have been through the introduction process and are accepted into the school."*

## Savings-counter formula (decision #2 — derive at build, from data only)

- Comparison basis: full-time day school paid day-by-day at the **weekly-discount** rate. Days/month = 5 × 52/12 ≈ **21.67**.
- **Half Days:** 21.67 × `day-half-am.weeklyDiscountPrice` (£14.99) ≈ £325/mo → vs £275 → **saves ~£50/mo**.
- **Full T1:** 21.67 × `day-full.weeklyDiscountPrice` (£19.99) ≈ £433/mo → vs £375 → **saves ~£58/mo** — plus free pick-ups (vs £1/journey = up to ~£43/mo for a twice-daily run) presented as a secondary "and that's before…" line, not folded into the headline number.
- **Full T2:** same care saving as T1; its extra value is the perk stack (free full grooming + 2 training sessions/cycle + no large-dog surcharge) — counter can show "saves ~£58/mo + perks worth more" but do NOT invent £ values for grooming/training perks unless the owner supplies them.
- Round DOWN to whole pounds (never overstate); caption the counters honestly, e.g. *"compared with paying day-by-day at our weekly rate"*. All inputs read from `pricing.json` at build time so a price change re-derives everything.

## Section map (draft — copy is Claude-drafted, owner corrects on the live page)

1. **Hero (PLACEHOLDER — decision #5)** — static band: real photo or type-led, eyebrow + H1 + one warm gated line ("For the dogs who are already part of the family") + primary CTA scrolling to `#apply`. Marked slot comment for the future owner-designed animation.
2. **Intro — warm but gated** — short paragraph: what membership is (full-time day school, bundled and invoiced, with club perks), who it's for (registered school dogs), and the honest saving.
3. **SIGNATURE: the three membership cards + animated savings counters** — flat 3-card row, T1 featured ("Most popular"); each card: name · price + unit (from data) · large-dog surcharge where set · features list (verbatim from data) · animated "saves ~£X/mo" counter (GSAP count-up on scroll-into-view; reduced-motion = final value rendered statically) · Apply CTA → `#apply`.
4. **Eligibility path — "How you join"** — 3 steps: taster sessions (3 × £12.50, from data) → accepted as a registered school dog → apply for membership. Links `/dog-day-school` admission section for the not-yet-a-school-dog visitor. This is the page's honest gate AND its cross-sell.
5. **Perk detail strip** — the shared club perks explained in one place (bath & brush + maintenance trim, priority boarding space, grooming discounts, free pick-ups on full tiers), real photos from the existing curated pools (gallery/`training-real-world`/day-school assets — real photos only, NO stock).
6. **"For our grooming regulars" band (decision #7)** — the £25/mo grooming subscription, its own eligibility line, CTA = sister-salon Acuity link (byte-for-byte).
7. **Apply (`#apply`)** — `EnquiryForm service="Membership" page="membership-plans"` with apply framing ("Tell us about your dog — if they're already one of ours, we'll sort the rest").

## Animation contract
- Standard idempotent `data-gsapInit` init; `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`; initial hidden states in JS never CSS; re-init on `astro:page-load`, kill ScrollTriggers on `astro:before-swap`.
- Counters: tween a proxy object → textContent; **reduced-motion/no-JS = final £ values visible statically**. No `pin` on this page.
- Standard `data-reveal`/`data-stagger` for sections/cards. Hero slot stays static until the owner's animation handoff lands.

## Wiring / TEMP flip-backs to ship with this page (🔔 HANDOVER checklist — verify each at build)
- `src/pages/index.astro` `#MembershipPlans` — the TEMP "Enquire about membership" button (`→ #enquire`) → relabel + point at `/membership-plans`; remove its `TEMP:` comment.
- `src/pages/dog-day-school.astro` — membership teaser TEMP target (`/#MembershipPlans`) → `/membership-plans`; remove its `TEMP:` comment.
- Sweep for any other `TEMP:` comments referencing membership (`grep -rn "TEMP:" src/`).
- `Footer.astro` — add Membership Plans link (verify desktop 1440px AND mobile 390px after — owner rule).
- `scripts/verify-urls.mjs` — `/membership-plans` planned → **built**.
- No new TEMP targets: everything this page links to (day-school, Acuity, #apply) already exists. After this ships, `/puppycourse` is the only remaining planned-missing URL.

## Quality gates
- `npm run build && npm run verify-urls` green; Lighthouse ≥ 90; reduced-motion pass; **desktop (~1440px) AND mobile (~390px) visual check on built output** before ship; adversarial review before push (push = live production deploy); owner sign-off on the live page.

## BUILD STATE (2026-07-11) — BUILT + adversarially reviewed + DEPLOYED + LIVE

Built as `src/pages/membership-plans.astro` (mirrors `training-plans.astro` conventions). All 8 locked decisions implemented; copy is DRAFT for owner correction on the live page.
- **Spec deviations (deliberate):** `EnquiryForm service="Membership Plans"` not the spec's literal `"Membership"` — the spec value matches no option in the form's services array and would silently preselect "Board & Train"; "Membership Plans" is the exact existing option. Savings counters show **£49/£58** (floor-rounded per the locked formula), not the spec prose's "~£50/~£58".
- **Hero placeholder:** static `doggy-friends` photo band inside `[data-hero-slot]` with the marked HERO ANIMATION SLOT comment; svh-sized so the future owner-designed animation swap is reflow-free.
- **QA:** build 33 pages 0 errors · verify-urls 0 failures (1 planned-missing = puppycourse) · Lighthouse a11y/best-practices/SEO **100/100/100**, LCP 132ms CLS 0.00 (localhost) · desktop 1440px + emulated 390x844 (CDP device emulation via chrome-devtools MCP `emulate` — works where window resize no-ops) both verified section-by-section · no horizontal overflow · no console errors · reduced-motion/no-JS = server-rendered final £ values (verified in dist HTML).
- **Adversarial review (5 parallel agents: a11y+contrast / data+facts / GSAP contract / responsive layout / copy+brand) → 13 confirmed findings, ALL FIXED:** (1) "monthly invoice/plan" claims ×4 contradicted T2's bi-monthly billing → "one simple invoice"/"all on one plan"; (2) counters exposed "£0"/mid-count to screen readers → static `sr-only` value + `aria-hidden` counting span; (3) hero+trust "one simple plan" vs the 3-plan grid → "rolled into one simple plan"; (4) T1 tagline overstated ("the plan most of our regulars are on") → "our most popular membership"; (5) "honestly gated" spec-jargon → "There's one honest rule"; (6) "perk stack" ×2 SaaS register → "fullest set of perks"/"more perks on top"; (7) "skills stay topped up for life" overpromise → "so the training never goes stale"; (8) mixed curly/straight apostrophes → normalised straight; (9) `pricing.json` orthography-only normalisation ("Full-Day"→"Full Day", "Includes Free"→"Free", "Half price"→"Half-price", "pick ups"→"pick-ups") — **zero fact changes, owner sign-off wanted**; (10) `gsap.matchMedia()` context never reverted on `astro:before-swap` (session-long leak + reduced-motion OFF-toggle could strand content invisible) → module-level `mm` + `mm.revert()` in the swap handler; (11) perk polaroids (Tailwind standalone `rotate:` — deliberate, survives `clearProps`) didn't straighten on hover → page-scoped `rotate: 0deg` hover rule + RM guard; (12) hero H1 orphaned "are" on all phones → "For dogs who are / already family" (2 clean lines at 390); (13) two CTA labels wrapped into 76px pills at 390 → "Start with Day School" (framing moved to the adjacent line) and "Book with the groomers". Bonus pre-existing fix: `training-plans.astro` passed `service="Training enquiry"` (not an option → silently preselected Board & Train) → `"General enquiry"`.
- **Known site-wide polish items surfaced (NOT this page's defects, left for the polish pass):** `.eyebrow text-honey-600` on cream fails AA (3.29–3.56:1) across 12 files / 57 uses — swap to honey-700 site-wide is the fix; the unreverted-matchMedia pattern also exists in `training-plans.astro` (and likely other pages) — replicate this page's `mm.revert()` fix when touched; honey-300-on-moss-700 passes AA by 0.01 (fragile pairing).
- **DEPLOYED + LIVE 2026-07-11 (owner: "yes all good lets make it live"):** commit `be8c42d` → Hostinger run `29145961588` green first try; docs commit `5af42ae` → run `29146043649` green. **Live-verified:** page 200 with 3 counters + review-fixed copy + byte-for-byte grooming Acuity link; homepage "Explore membership plans" CTA, day-school teaser and footer link all live; `verify-urls --live` 48/0 (only `/puppycourse` planned-missing). **Owner still owed:** live review of the sign-off items (draft copy, £49/£58 counters, pricing.json orthography, placeholder hero photo) + a real-phone layout check; hero animation design to follow (slot is marked).
