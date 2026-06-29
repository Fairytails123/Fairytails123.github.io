# Breed Matcher — Build Plan & Handover Brief

**Project:** Breed-matching tool for The Fairy Tails K9 Centre (Hastings)
**Status:** v1 complete and tested. This document is the brief for continuing it in Claude Code.

---

## ⚙️ REPO LAYOUT (how this tool lives inside the main website — read this first)

This tool was **integrated into the Fairy Tails main website repo on 2026-06-20**. It is kept in
**its own folder so it can be worked on in isolation** while still shipping with the site build.

- **The live tool file (single source of truth):**
  `public/breed-matcher/index.html` (relative to the repo root, i.e. `../../public/breed-matcher/index.html` from here).
  It is a **standalone, self-contained, no-build file** — open it directly in a browser to work on it.
- **Why `public/`:** Astro copies everything in `public/` **verbatim** into `dist/` at build time, so the
  tool ships automatically at the URL **`/breed-matcher/`** with **no build step, no bundler, no Astro
  processing** — exactly as the "no build step" rule below requires. There is **only one copy** of the
  tool (no mirror to drift).
- **This dev kit (`tools/breed-matcher/`, NOT served):**
  - `CLAUDE.md` — this brief (auto-loads as context when working in this folder).
  - `README.md` — quick orientation + the dev/test/backup loop.
  - `test/engine.test.mjs` — the node regression harness (§13). Run: `npm run test:breed-matcher`.
  - `backups/` — put timestamped backups here (gitignored; see §1).
- **Editing rule:** edit `public/breed-matcher/index.html` directly. **Back it up into
  `tools/breed-matcher/backups/` first** (see §1). Do **not** create a second copy of the tool anywhere
  — one source of truth only.
- **It is NOT yet on the homepage.** The site is built inside-out and the homepage is built **last**; the
  homepage integration (feature/link/embed the matcher) is recorded in the site plan (`WEBSITE-PLAN.md`)
  and `HANDOVER.md` to be done during the homepage build. For now the tool is reachable standalone at
  `/breed-matcher/` on the preview.
- **Service URLs (§5)** currently point at the **old live domain** (`https://thefairytails.co.uk/...`),
  which still resolves. When those service pages exist on the new site, repoint `FT = {…}` to the new
  paths. This is a known follow-up (see §5 / Phase 4).

> Everything below is the original brief, kept as the authoritative spec.

---

## 0. The big idea (read this first — do not lose it)

This is **not** a gatekeeping quiz that tells people they've chosen the wrong dog. It is a **confidence-and-enablement** tool.

- **Target user:** someone who *already has a breed in mind* and is researching/validating it.
- **Their chosen breed stays the hero** of the results, always.
- We show an **honest match score** for their real life, then show the score **climb once Fairy Tails support is factored in**.
- **Services are the bridge** between the dog they want and the life they have. This is where "educate" and "generate leads" stop fighting each other.
- **The spine / running theme:** *"The right start prevents the problems people pay to fix later — Fairy Tails helps you start right."* Prevention over treatment. It runs through the scoring, the bridges, and the tips.

**The credibility rule is the whole asset:** the score only ever climbs on gaps a service *genuinely* closes. If we fake a recovery, we lose the trust that makes the tool work. **Never let the "with support" score lift on a true hard-no.**

If you're tempted to simplify the engine, simplify *anything except* these three things:
1. The hero-breed-first framing.
2. The honesty of hard-nos (no lift, plainly stated).
3. The two-register tip voice (see §8).

---

## 1. Standing rules (non-negotiable)

- **British English** everywhere — UI copy, comments, everything. (colour, organise, behaviour, neighbour…)
- **Additive-only edits** where possible. Don't rip out working sections to "tidy".
- **Take a timestamped backup before any edit.** From the repo root:
  `cp public/breed-matcher/index.html tools/breed-matcher/backups/index.backup-2026-06-20-1430.html`
  (or PowerShell `Copy-Item`). Backups live in `tools/breed-matcher/backups/` (gitignored), so any single
  change can be reverted instantly.
- **Hosting is GitHub Pages only**, under the `fairytails123` account, via the main website's Astro build
  (the file ships verbatim from `public/`). Do **not** introduce Netlify, Vercel, or any extra build/deploy
  tooling for this tool.
- **No build step. No framework. No bundler.** Vanilla JS, HTML, CSS in one file. It must run by opening the file.
- **Mobile-first.** Design and test at ~380px width first.
- **No external runtime dependencies** except the Google Fonts stylesheet. Everything else is self-contained.

### Rules that do NOT apply here (noted to avoid confusion)
- The **Telegram mobile URL / no-percent-encoding rule** applies only to URLs sent through a Telegram bot. This tool uses plain website `<a href>` links with no query parameters — standard encoding is fine. Don't apply the `+`-for-spaces rule here.
- The **no-localStorage rule** comes from the Claude artifact sandbox. On GitHub Pages, `localStorage`/`sessionStorage` work normally — so if you want to add "save my result" or "resume", you may. (v1 deliberately keeps all state in memory; see §12.)
- The read-only master Google Sheet is irrelevant to this tool — it doesn't touch any sheet.

---

## 2. File map (`public/breed-matcher/index.html`)

Everything lives in one file. Inside the single `<script>`:

| Block | What it is | Edit frequency |
|---|---|---|
| `SITE` + `FT = {…}` | Fairy Tails service links (placeholder URLs **to confirm**) | High — confirm URLs |
| `svc()` | Helper that renders a service link | Rare |
| `B()` + `BREEDS[]` | The breed dataset (see §7). `B()` is a positional helper | High — extend to 150+ |
| `QUESTIONS[]` | The quiz, one object per question (see §9) | Medium |
| `state` | In-memory app state | Rare |
| `effectiveSpace()` | Space available = home + access (see §6) | Low |
| `scoreBreed()` | **The engine.** Three tiers, gaps, bridges, bands (see §6) | Medium — tune carefully |
| `whyLine()` | One-line plain-English summary of fit | Medium |
| `buildTips()` | Tips layer + promotion logic + two-register voice (see §8) | Medium |
| `renderIntro / renderBreedSelect / renderQuestion / renderResults / heroCardHtml / altHtml` | Rendering | Medium |
| `animateBars()` | Drives the signature before→after bar | Low |

CSS is all in the `<head>` `<style>`, organised top-to-bottom: tokens → base → buttons → intro → progress → question → results/bridge → tips → alternatives → reduced-motion.

---

## 3. Tech stack & hosting

- Vanilla JS (ES2015+), HTML5, CSS3. No transpile.
- Fonts: **Fraunces** (display) + **Inter** (body) via Google Fonts `<link>`. System-font fallbacks are in the stack if the CDN is blocked.
- Deploy: the file lives at `public/breed-matcher/index.html`; the main website's GitHub Actions build
  (`npm run build` / `withastro/action`) copies `public/` into `dist/` and publishes to Pages. No actions
  specific to this tool, no build for it. Served at `/breed-matcher/`.

---

## 4. Design system (so new UI matches)

**Palette — "considered countryside premium".** Defined as CSS custom properties in `:root`:

```
--forest:#1E4A3A   primary brand green (structure, headings, primary button)
--forest-deep:#123127
--moss:#3E6B57     secondary green (progress, the "now" portion of the bar)
--sage:#8AA899     muted accent
--paper:#F6F2E9    warm page background
--card:#FCFAF4     card surface
--sand / --line    neutrals & hairlines
--gold:#C2853A     RESERVED: the "with our support" score lift + key CTAs only
--gold-soft:#E8CB94
--clay:#A94C34     RESERVED: safety-critical / hard-no / strong-steer only
```

**The colour discipline carries the voice:** gold = enablement/upside; clay = "this genuinely matters / we can't bridge this". Don't spend gold or clay on ordinary UI — their rarity is what makes them land.

**Type:** Fraunces for headings, breed names, and the big % numbers (it reads editorial/confident). Inter for body and UI. The large % numerals are a deliberate signature — keep them in Fraunces.

> Note: the tool's palette is its own self-contained "considered countryside premium" system. The main
> site uses a related but distinct "countryside editorial" Tailwind theme (moss/cream/honey). They are
> visually compatible cousins; keep the tool's own tokens unless a deliberate unification pass is agreed.

**Signature element:** the **before → after bridge bar** on the results hero card. The moss "now" segment fills, then the gold "lift" segment extends to the supported score (`animateBars()`). On a hard-no the gold segment is never rendered — the absence is the honesty. This is the one bold thing; keep everything around it quiet.

**Quality floor:** responsive to mobile, visible keyboard focus (`:focus-visible` outlines), and `prefers-reduced-motion` disables transitions. Maintain all three.

---

## 5. Service config (confirm these)

In `FT = {…}` at the top of the script. Current placeholders point at the **old live domain** (which
still resolves); repoint to the new-site paths once those pages exist:

| Key | Used for | Placeholder URL |
|---|---|---|
| `daycare` | hours-alone bridge | `/daycare` |
| `puppy` | first-timer bridge | `/training` |
| `intensive` | drive / challenging-breed / strong-steer | `/training` |
| `grooming` | coat-upkeep bridge + the handling tip | `/grooming` |
| `walking` | exercise/space top-up | `/dog-walking` |
| `field` | space/access bridge — points to **contact** so it works whether or not field hire is a service | `/contact` |
| `boarding` | (available, not yet wired into a bridge) | `/boarding` |
| `chat` | "thinking of getting a dog" soft CTA | `/contact` |

**Action:** replace with the real page URLs. If field hire becomes a named service, give it its own URL.

---

## 6. The scoring engine — full spec

`scoreBreed(breed, answers)` returns `{ base, supported, hardNo, steer, bridges[], cautions[], band, lift }`.

### 6.1 Space available
```
effectiveSpace = clamp( home + accessBoost , 1, 5 )
  home:   flat 1 · smallGarden 3 · largeGarden 5
  boost:  parksOnly 0 · natureNearby 1.5 · willTravel 1.5 · privateLand 2
```
The point: the constraint is **home minus access**, not the postcode. A high-energy breed in a flat *with beaches nearby* is very different from the same dog in a flat with only pavement.

### 6.2 The three tiers

**Tier 1 — HARD NO** (score caps low, `supported == base`, no lift, stated plainly):
- `size === 5 && home === 'flat'` → giant breed, home itself too small. `base = min(base,36)`.
- `coat === 'needHypoallergenic' && !lowAllergen` → real allergy vs non-allergy-friendly coat. `base = min(base,38)`.
- These are the *only* hard-nos. A high-**energy** normal-sized breed in a flat is **not** a hard-no — it's a recoverable access gap.

**Tier 2 — STRONG STEER** (recovers with support, but a loud clay caution always stays):
- `hasToddler && (guard >= 4 || kids <= 2)` → penalty 14, ~70% recoverable, `steer` text set. It's a steer, **not** a brake — a family with a big house and budget can do it, but we never hide the seriousness.

**Tier 3 — BRIDGEABLE GAP** (score lifts cleanly via a named service). Each logged via `gap(penalty, recoverableFraction, gapText, fixHtml)`.

### 6.3 Gap reference table (current constants)

| Trigger | Penalty | Recover frac | Bridge |
|---|---|---|---|
| `spaceNeed > effectiveSpace`, parksOnly & size<5 | diff×9 | 0.70 | field hire / nearby nature / walking |
| `spaceNeed > effectiveSpace`, other | diff×9 | 0.45 | field hire / walking |
| `coat=preferLowShed` & shed≥4 | 8 | 0.35 | grooming (reduces loose hair; not a cure) |
| `alone=mostDay` & aloneTol≤2 | 16 | 0.85 | daycare |
| `alone=mostDay` & aloneTol=3 | 8 | 0.85 | daycare |
| `alone=fewHours` & aloneTol≤2 | 7 | 0.80 | daycare |
| `experience=first` & novice≤2 | 15 | 0.80 | puppy course |
| `experience=some` & novice=1 | 8 | 0.75 | intensive training |
| `energy > exerciseLevel`, energy≥5 | diff×7 | 0.60 | intensive + daycare |
| `energy > exerciseLevel`, else | diff×7 | 0.55 | walking + daycare |
| `groom≥4` & grooming=minimal | 11 | 0.85 | grooming salon |
| `groom≥4` & grooming=brush | 5 | 0.80 | grooming salon |
| `barking=quiet` & bark≥4 | 6 | 0.45 | training |
| size pref mismatch | dist×5 | 0 (preference) | — |
| `hasToddler` & size≥4 (and not a steer) | 0 | — | soft caution only |

`exerciseLevel = { gentle:1, moderate:2, active:4, working:5 }`.

### 6.4 Final maths
```
base       = clamp( round(base), 5, 97 )
supported  = hardNo ? base : clamp( round(base + recover), base, 92 )
headline   = hardNo ? base : supported
```
**Supported is capped at 92** on purpose — nothing is ever a perfect 100; that cap protects honesty.

### 6.5 Bands (off `headline`)
```
hardNo        → "Be honest with yourself"           (clay)
headline ≥ 82 → "A great fit"                        (green)
headline ≥ 65 → "A great fit — with the right support" (moss)
else          → "Doable, but demanding"             (gold)
```

### 6.6 Verified behaviour (keep these green — see §13)
- Great Dane / flat → 36, hard-no, no lift.
- Border Collie / flat+parks+first-timer+mostDay → **14 → 75** (the signature dramatic bridge).
- Border Collie / flat+nature+experienced → 73 → 89.
- Rottweiler + toddler → 78 → 92 **with steer flag**.
- Poodle / allergy home → fine (not a hard-no). Labrador / allergy home → hard-no.

---

## 7. The breed dataset

`BREEDS` is built with the positional helper:
```js
B(name, group, size, energy, spaceNeed, aloneTol, novice, groom, shed, lowAllergen, kids, guard, bark, train)
```

**Scales (1–5 unless noted):**
```
size       1 toy · 2 small · 3 medium · 4 large · 5 giant
energy     1 couch  →  5 tireless working drive
spaceNeed  1 flat-fine  →  5 needs real room/access
aloneTol   1 needs company (separation-prone)  →  5 independent
novice     1 experts only  →  5 ideal first dog
groom      1 wash-and-go  →  5 high professional grooming
shed       1 minimal  →  5 heavy
lowAllergen  boolean — true = coat reasonably allergy-friendly
kids       1 not suited to toddlers  →  5 excellent with young children
guard      1 none  →  5 strong protective/guarding drive
bark       1 quiet  →  5 very vocal
train      1 stubborn  →  5 eager & easy
```

**Current count: 96 breeds.** Groups: Gundog, Pastoral, Working, Terrier, Hound, Toy, Utility, plus a handful of popular Crosses (Cockapoo, Cavapoo, Labradoodle, Goldendoodle, Cavachon, Sprocker).

**Data quality:** these are sensible starting values grounded in breed-standard temperament/known characteristics. **They are Kam's to review** — especially `kids`, `guard`, `aloneTol`, and `novice`, which drive the steers and bridges. Adjust from real professional experience.

**To extend toward the full 150+:** just add `B(...)` lines following the schema. No other code changes needed — the engine, ranking, search, and rendering all pick up new breeds automatically.

**High-priority additions** (popular in the UK, currently missing — not exhaustive):
- Gundog: Welsh Springer Spaniel, English Setter, Gordon Setter, Spinone Italiano, Lagotto Romagnolo, Clumber/Sussex/Field Spaniel, Large Munsterlander.
- Pastoral: Cardigan Welsh Corgi, Smooth Collie, Finnish Lapphund, Swedish Vallhund, Briard, Hungarian Puli, Anatolian Shepherd, Lancashire Heeler.
- Working: Pyrenean Mountain Dog, Portuguese Water Dog, Tibetan Mastiff, Bouvier des Flandres, Russian Black Terrier, Neapolitan Mastiff.
- Terrier: Welsh, Irish, Lakeland, Norfolk, Norwich, Kerry Blue, Soft Coated Wheaten, Dandie Dinmont, Sealyham, Manchester, Glen of Imaal, Miniature Bull Terrier.
- Hound: Borzoi, Deerhound, Norwegian Elkhound, Otterhound, Pharaoh Hound, Ibizan Hound, the remaining Dachshund coat/size variants, Petit/Grand Basset Griffon Vendéen.
- Toy: Pekingese, Bolognese, Brussels/Griffon Bruxellois, Chinese Crested, Coton de Tuléar, Japanese Chin, Affenpinscher, Miniature Pinscher, Löwchen.
- Utility: Keeshond, Schipperke, Tibetan Spaniel, German Spitz (Klein/Mittel), Japanese Spitz, Japanese Akita Inu, Eurasier, Canaan Dog, Schnauzer (Giant is in Working).

Target end-state: full Kennel Club breed list (~220), but 150+ covers virtually everything a UK family realistically considers.

---

## 8. The tips layer (the cleverest part)

`buildTips(result, answers)` returns up to 5 ordered tips. Two ideas drive it:

### 8.1 Promotion ("say it louder")
Tips aren't flat. A tip can be **promoted** — pulled to the top, visually flagged (clay card + "Read this" pill), and switched to a **plain-spoken, direct register** — precisely for the users most likely to *underestimate* it.

### 8.2 Two-register voice
Most tips are calm, neutral, professional. The safety-critical, counter-intuitive ones shift to blunt "telling you straight" language *and* get the clay highlight. **The contrast is the trick:** one blunt line in a calm room lands hard, and it positions Fairy Tails as the pro who only raises their voice when it counts. Keep most tips quiet so the loud ones mean something.

### 8.3 The tips and their triggers

| Tip | Shown | Promoted/flagged when | The professional point |
|---|---|---|---|
| **Breeder vetting** | always, #1 | (firm but neutral) | Where you buy matters more than the breed. Council-licensed, inspected, see the mum, walk away from online-only. It's the foundation that keeps every bridge reachable. |
| **Early grooming handling** | always | grooming=minimal **or** groom≤2 | Bite prevention, not coat care. Dogs handled by groomers young accept being touched; the biters are often the ones who never went. **Low-maintenance breeds get this promoted** — they're the ones who skip the groomer and pay later. |
| **Day-one separation training** | always | alone=mostDay/fewHours | Start short calm absences hour one. Being glued to a new pup builds the clinginess you'll spend months undoing. Prevention; leave it a week and it's treatment. |
| **Early socialisation window** | always | experience=first | Socialise *before* the jabs finish — carry/sling the pup (feet off ground, senses open to traffic/crowds/hoovers). The critical window never reopens. |
| **Mental stimulation** | if energy≥4 | under-exercised (& energy≥5) | A bored bright breed invents jobs you won't like. Tire the brain, not just the legs. |
| **Coat-prep routine** | if groom≥4 (and handling tip not already promoted) | — | Build the brushing/salon habit before the adult coat arrives. |

Ordering: breeder first, then promoted tips by `order`, then the rest; capped at 5.

---

## 9. The quiz

`QUESTIONS[]` — 10 single questions, one per screen. Single-select **auto-advances** (~170ms); the multi-select household question shows a Continue button. There's a Back control; Back from Q1 returns to breed selection.

Order & ids: `home → access → exercise → alone → experience → grooming → coat → household(multi) → sizePref → barking`.

The **`access`** question is load-bearing for the space nuance (§6.1) — don't merge it into `home`.

Flow: `intro → breed select (optional, searchable; can skip) → quiz → results`. If a breed is chosen it's the hero; if skipped, the top-ranked breed becomes the hero and the rest are alternatives.

---

## 10. Results layout

Hero card: breed name + meta → the before→after bridge (or single honest score) → band chip → `whyLine()` → strong-steer note (if any) → hard-no honesty note (if any) → "closing the gap" bridge list with per-item lift tags → soft cautions → the tips block. Beneath the hero: ranked **alternatives** ("Others you might also fall for"; on a hard-no this becomes "Where we'd gently point you instead" and shows more of them). Tapping an alternative makes it the hero. Footer: generalisation disclaimer + a soft "have a chat with us" link + the spine line.

---

## 11. What's done in v1

- [x] Full intro setting the prevention-over-treatment tone.
- [x] Optional searchable breed selection (96 breeds) with skip.
- [x] 10-question mobile-first quiz, auto-advance, progress bar, Back.
- [x] Scoring engine: three tiers, effectiveSpace, base/supported, bands.
- [x] Animated before→after bridge bar (gold lift; absent on hard-no).
- [x] Bridge list mapping each gap to the service that closes it.
- [x] Tips layer with promotion logic + two-register voice.
- [x] Ranked alternatives; tap to re-hero.
- [x] Disclaimer + soft CTA + spine line.
- [x] Reduced-motion, focus states, fallback fonts.
- [x] Engine validated via node scenario tests.
- [x] **Integrated into the main website repo (2026-06-20):** ships at `/breed-matcher/`; node harness committed at `tools/breed-matcher/test/engine.test.mjs` (`npm run test:breed-matcher`).

---

## 12. Roadmap / future work (prioritised)

### Phase 1 — Complete the dataset to 150+
Add the breeds in §7. Then do a **scores review pass** with Kam on the values that drive steers/bridges (`kids`, `guard`, `aloneTol`, `novice`). Biggest value, lowest risk.

### Phase 2 — Richer visual score indicator
Kam wants to push the bridge graphic further. Ideas: a segmented/gradient dial, animated count-up on the % numerals, a small "what moved it" annotation on the bar, colour-coded gap chips that map to the bar segments. Keep gold = lift, clay = can't-bridge.

### Phase 3 — More quizzes / areas / expertise
Kam's stated direction: "add more value and quizzes and areas." Candidates:
- **Puppy vs rescue vs older dog** path (changes the tips and the breeder advice).
- **"Compare two breeds"** side-by-side for someone torn between two.
- **Cost-of-ownership** estimate per breed (food/grooming/insurance bands).
- **Grooming-needs deep-dive** (plays straight to the salon).
- **Hastings-specific content**: name the actual local beaches/fields/woods for the access answer — local credibility + SEO.

### Phase 4 — Polish & growth
- Breed **illustrations/icons** (line-art style; avoids photo licensing). One per group at minimum, ideally per breed.
- **Share/print a result** (and, since GitHub Pages allows it, optional `localStorage` "resume" or "save my shortlist").
- **Deep-link** a breed (`?breed=border-collie`) so results are shareable/linkable from social.
- Lightweight **analytics** (privacy-friendly) to see which breeds and gaps are most common — feeds content and service messaging.
- Confirm and wire **real service URLs**; consider wiring `boarding` into a relevant nudge (e.g. holidays).
- An **email-capture** soft step ("send me my result + a getting-started guide") feeding the lead pipeline — optional, keep it non-blocking.
- **Homepage integration** (done during the homepage build, which is LAST in the inside-out plan): feature/link/embed the matcher prominently on `/`. Decision to make then: link to `/breed-matcher/` vs iframe-embed inline.

### Phase 5 — Engine depth (later)
- Weight tuning once real usage shows where scores feel off.
- Per-breed editorial one-liners instead of generated `whyLine()` for the most popular breeds.
- Handle breed *variants* (e.g. show working vs show lines) where it materially changes the advice.

---

## 13. Testing

There's no framework (by rule). The engine is validated with a small **node harness** that loads the
file with the DOM stubbed. It is committed at **`tools/breed-matcher/test/engine.test.mjs`** and runs via
**`npm run test:breed-matcher`** (or `node tools/breed-matcher/test/engine.test.mjs`). It reads the live
tool at `public/breed-matcher/index.html`.

How it works (and the gotchas it handles):
- Extract the inline script with **`lastIndexOf('<script>')`** — a naive `split('<script>')[1]` can grab the
  wrong chunk if a CSS comment ever contains the literal word `<script>`.
- Strip the boot call `renderIntro();` so nothing renders under the stub.
- `(0, eval)(...)` the script **plus appended assertions in the same string** — `eval`'d `const`s don't leak
  out, so assertions must live inside the evaluated string to share scope with `BREEDS`/`scoreBreed`.

**Regression checklist** (the §6.6 cases must keep their shape): giant→hard-no with no lift; the dramatic Collie bridge (14→75); Rottweiler+toddler steer flag; allergy hard-no only on non-low-allergen coats; supported never exceeds 92; hard-no `supported === base`. (Mid-range exact numbers like the 73→89 case depend on the *full* answer set, so the harness asserts those as invariants/ranges rather than exact points.)

Plus a manual pass on a real phone at ~380px: auto-advance feels right, Back works, the bar animates, focus rings show on keyboard nav, reduced-motion kills animation.

---

## 14. Suggested next Claude Code session

1. Back up first: `cp public/breed-matcher/index.html tools/breed-matcher/backups/index.backup-<date>.html`.
2. Confirm the real service URLs in `FT = {…}`.
3. Add the Phase-1 breeds in batches by group; re-run `npm run test:breed-matcher` after each batch to confirm nothing regressed and rankings still look sane.
4. Sit with Kam for 20 minutes on the `kids` / `guard` / `aloneTol` / `novice` values for breeds he knows best.
5. Only then move to Phase 2 (visuals).

Keep edits additive, keep it British English, keep the three things in §0 sacred.
