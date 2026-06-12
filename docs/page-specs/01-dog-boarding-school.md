# FINAL page spec — `/dog-boarding-school` (Board & Train)

> Produced by the pre-build interview on **2026-06-12**. This is the **final word** for page 1,
> superseding the baseline in `WEBSITE-PLAN.md` where they differ. Locked site-wide decisions
> (enquiry form = primary CTA, prices, Acuity links byte-for-byte) still apply.

## Interview outcomes (2026-06-12)

| Topic | Decision |
|---|---|
| Page arc | **Keep baseline guided sales arc**: problem → programme & why it works → proof → week-by-week regime → pricing → limitations & eligibility → 4-step booking. Checklist/open-visit/body-cam in accordions. |
| Holiday Board & Train | **Appears on this page as a third pricing tier** — £1,500 / 4 weeks (+£300 large dogs), boarding + training + structured day care, daily video reports. |
| Proof section | **All four elements**: Archie's story as flagship case study (summary + link to `/archiestory`), body-cam video clips, written testimonials (live page's 4-item doggy-client carousel as starting material), before/after photo pairs. |
| Regime section | **One merged week-by-week timeline** overlaying the old `/training-stages` 3-stage method + parent-training Fridays + the mandatory break. Claude drafts from live copy; **owner corrects details before sign-off**. |
| Voice (site-wide) | **Warm, parent-to-parent** — empathetic friend-who's-an-expert; keeps the honest "Our Limitations!" candour. |
| Design system (site-wide) | **Warm & natural** — earthy greens/creams, soft countryside light, premium but approachable. Logo kept. |
| Signature animation | **Week-by-week scroll story** — the regime timeline is a pinned, scroll-driven GSAP sequence (the page's centrepiece). Reduced-motion fallback: plain stacked timeline. |
| Hero | **Short looping video** (muted autoplay) behind headline — built with a placeholder/photo poster until owner supplies a clip; static photo is the reduced-motion + fallback state. |
| Telegram alerts | **Email only for now** — n8n workflow ships with email (to info@) + log; Telegram node wired later when owner picks a destination. |
| Media assets | **Build with placeholders** — best harvested live-site photos now; video/before-after slots clearly marked; owner drops real clips/photos before sign-off. |
| Content add/cut | **Carry everything over** from the live page, restructured into the arc. Nothing added, nothing cut. |
| "Mandatory break" | It is a **mid-stay home break** (dog goes home partway through the programme). Claude drafts explanatory copy; owner corrects details. |

## Page structure (build order top → bottom)

1. **Hero** — looping muted video slot (placeholder photo poster for now), warm transformation-promise headline, sub-line, primary CTA "Send an enquiry" (anchors to form), secondary CTA = free phone consult (Acuity `appointmentType=56694430`, byte-for-byte). Trust strip: open visits anytime · body-cam daily reports · no kennels, home-based.
2. **The problem** — empathetic parent-to-parent framing; the live "~12 issues we routinely deal with" list woven in as recognisable pain points (lead pulling, reactivity, biting, crate training, hyperactivity…).
3. **The programme & why it works** — residential board-and-train model; why-us 3 points (positive reinforcement/no aversive tools, staff expertise, no-kennels home-based care); eligibility teaser (puppies 12–16wk → ~4wk programme; adults 16wk+ → 8wk min; rescues case-by-case).
4. **Proof** — Archie flagship case-study block (on-page summary + link to `/archiestory`); body-cam clip slots (placeholders); testimonial carousel; before/after photo pairs (placeholder pairs until owner supplies).
5. **Week-by-week regime — SIGNATURE SCROLL STORY** — merged timeline (draft; owner corrects): Wk 1 settling in / integration (Stage 1) · Wk 2 basics in the quiet barn setting (Stage 2) · Wks 3–4 consolidation; parent training starts (Fridays, pickup 11am–2pm); mid-stay home break drafted here · Wks 5–7 specialisation in real-world environments — parks on-lead, seafront promenade, high streets (Stage 3) · Wks 8–10 transition & handover. Training-cycle infographics (harvested) included. Mid-course + end-of-course parent sessions recommended.
6. **Your involvement matters most** — owner-involvement copy + parent-training Friday details.
7. **Pricing** (renders from `src/data/pricing.json`) — Puppy £1,200 / 4 wks · Adult behaviour £2,500 / 8–10 wks (+£300 large) · Holiday Board & Train £1,500 / 4 wks (+£300 large).
8. **Honest limitations & eligibility** — "Our Limitations!" candour carried over verbatim in spirit; full eligibility detail.
9. **Visits & daily feedback** (accordion group with #10) — open-visit policy; body-cam recording of every session + daily reports via OneDrive link (live copy verbatim).
10. **22-item required-equipment checklist** — accordion.
11. **How to book — 4 steps** — contact → prioritise issues → contract → agreement & payment → leads into the enquiry form.
12. **Enquiry form** (primary CTA target) — locked fields: name/email/phone/message + service dropdown **pre-filled "Board & Train"** + dog name/breed/age + behavioural-concerns multi-select + preferred contact method & time. Honeypot `website` + `elapsedMs<4000` fake-success. POSTs to n8n production webhook.

## Built alongside this page (foundation deliverables)

Header/footer (site-wide fixes baked in: `wa.me/447842116216` / `wa.me/441424300668`, no placeholder mailtos, real Google Maps URL, no Employee Login), design tokens (warm & natural palette), GSAP foundation, form component, n8n "Website Enquiry" workflow (**email + log only**; Telegram later), `business.ts`, `pricing.json`, `verify-urls.mjs`.

## Owner inputs still open for this page (needed before sign-off, not before build)

- [ ] Hero video clip (muted loop; body-cam or training footage)
- [ ] Corrections to the drafted week-by-week timeline incl. mid-stay home break details
- [ ] Which testimonials to feature (or approve the live carousel four)
- [ ] Before/after photo pairs + body-cam proof clips
- [ ] (Deferred, site-wide) Telegram destination for enquiry alerts

## Sign-off gates (from WEBSITE-PLAN.md)

Owner sign-off on live preview · `verify-urls --dist` · Lighthouse ≥ 90 (perf/SEO/a11y) · reduced-motion check · n8n enquiry live-tested end-to-end with the execution read (CORS from a real browser).
