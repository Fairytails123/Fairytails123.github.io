# Breed Matcher — Build Plan & Handover Brief

> ⚠️ **INTEGRATED AS AN ASTRO PAGE, 2026-08-03.** Everything below this banner was written for the retired **standalone single-file** tool. **Wherever a path, a hosting claim or a build claim below disagrees with this banner, the banner wins** — that applies to the whole document, not to any one numbered section, so do not read an unmarked line further down as current just because it carries no warning. (The sections most obviously rewritten by the port are the REPO LAYOUT block, §1, §2, §3, §5 and §13; the stalest lines in those have been corrected in place.) The tool ships as **`/breed-matcher/`**, a full `<Base>` Astro page, **NOT** a bare `public/` file. **`public/breed-matcher/index.html` is DELETED** — do not recreate it; a copy there would be served verbatim by Astro and would silently win over the page.
>
> - **Page:** `src/pages/breed-matcher/index/index.astro`. 🔴 **That path is not a typo — read the header comment in the file before moving it.** `build.format:'file'` emits `<route pathname>.html`, and Astro strips a trailing `index` segment, so BOTH `breed-matcher.astro` AND `breed-matcher/index.astro` would emit `dist/breed-matcher.html` and destroy the trailing-slash URL. Only this path emits `dist/breed-matcher/index.html`, which is what has been live since June 2026. `scripts/verify-urls.mjs` fails the build if it moves.
> - **Engine (single source):** `src/scripts/breed-matcher/{data,engine,services,ui}.js`. `data.js` + `engine.js` are the dataset and the scoring, lifted **verbatim** — the port changed no scores. `services.js` holds the service links; `ui.js` is the rendering layer, adapted only for ClientRouter-safety, namespaced handlers (`window.ftBM`), the site's `tool_engagement` event, and section-local scrolling.
> - **⚠️ Those four modules must stay PLAIN JS with no `src/data/*.ts` imports** — the node regression harness loads them directly and cannot read TypeScript. That is why the grooming sister-site URL is handed in from the page (`data-grooming-url` on `#bm-root`) rather than imported.
> - **Styling:** the `.astro` page's `<style is:global>` carries the tool's own palette and rules, every selector scoped to `#bm-root`. The **Google Fonts `<link>` is gone** — Fraunces/Inter became the site's self-hosted `var(--font-display)`/`var(--font-body)`. That third-party request, on a page that had no consent banner at all, was a live UK PECR exposure and is the reason this port happened. **Never reintroduce a third-party font link.**
> - **Framing:** the homepage embeds this page in an iframe. `Base.astro` marks a framed render with `html.is-framed`, hides the header/footer/consent banner, and — critically — **does not load GTM in a frame**, so scrolling past the homepage section can no longer fire a phantom `page_view`. Sections tagged `data-frame-hide` drop out too, leaving just the tool.
> - **Tests:** `npm run test:breed-matcher` (unchanged assertions, now importing the modules). Then `npm run build && npm run verify-urls`.
>
> **Everything else below — §0's three sacred rules, the scoring spec in §6, the dataset schema in §7, the tips design in §8 and the regression checklist in §13 — still applies verbatim.** Back up before edits, into `backups/` (gitignored).

**Project:** Breed-matching tool for The Fairy Tails K9 Centre (Hastings)
**Status:** v1 complete and tested; integrated as the Astro page `/breed-matcher/` on 2026-08-03.

---

## ⚙️ REPO LAYOUT (how this tool lives inside the main website — read this first)

This tool was **integrated into the Fairy Tails main website repo on 2026-06-20**. It is kept in
**its own folder so it can be worked on in isolation** while still shipping with the site build.

- **The live tool (single source of truth), since 2026-08-03:** the Astro page
  `src/pages/breed-matcher/index/index.astro` plus the four modules in `src/scripts/breed-matcher/`.
  ~~`public/breed-matcher/index.html`~~ is **deleted** — see the banner above.
- **Why an Astro page, not `public/`:** a bare `public/` file is copied verbatim into `dist/`, which is
  how the tool shipped originally — but it also meant no `<Base>`, so no consent banner, no self-hosted
  fonts, no schema and no analytics on a page that was pulling a third-party font CDN. Being a real page
  fixes all of that. There is still **only one copy** of the tool (no mirror to drift).
- **This dev kit (`tools/breed-matcher/`, NOT served):**
  - `CLAUDE.md` — this brief (auto-loads as context when working in this folder).
  - `README.md` — quick orientation + the dev/test/backup loop.
  - `test/engine.test.mjs` — the node regression harness (§13). Run: `npm run test:breed-matcher`.
  - `backups/` — put timestamped backups here (gitignored; see §1).
- **Editing rule:** edit the module that owns the thing you are changing (the table in `README.md`
  maps them). **Back it up into `tools/breed-matcher/backups/` first** (see §1). Do **not** create a
  second copy of the tool anywhere — one source of truth only.
- **It IS on the homepage.** The homepage's `data-section="breed-matcher"` band iframes
  `/breed-matcher/`, with a direct link as the fallback. Check layout changes framed and unframed.
- **Service URLs (§5)** are now our own site-relative slugs, held in `src/scripts/breed-matcher/services.js`
  — no domain literal, so nothing to go stale. The one external link, the grooming sister site, is handed
  in from `business.ts`. §5's placeholder table below is history, not the current config.

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
  `cp src/scripts/breed-matcher/engine.js tools/breed-matcher/backups/engine.backup-2026-08-03-1430.js`
  (or PowerShell `Copy-Item`). Backups live in `tools/breed-matcher/backups/` (gitignored), so any single
  change can be reverted instantly. The last standalone build is kept there as
  `index.backup-2026-08-03-astro-port.html`.
- **Hosting is the main website's own pipeline** — production is **Hostinger** since 2026-07-04 (push to
  `main` → GitHub Actions → FTPS deploy). The tool ships as part of `npm run build`. Do **not** introduce
  Netlify, Vercel, or any extra build/deploy tooling for this tool.
- **No framework. Plain JS only.** Vanilla ES modules, no React/Vue, no bundler config of its own — Astro
  bundles `ui.js` and its imports like any other page script. ⚠️ `data.js` / `engine.js` / `services.js` /
  `ui.js` must stay **plain `.js` with no `src/data/*.ts` imports**: the node regression harness loads them
  directly and cannot read TypeScript.
- **Mobile-first.** Design and test at ~380px width first.
- **No third-party runtime dependencies at all.** 🔒 In particular the fonts are the **site's self-hosted
  Fraunces/Karla** (`var(--font-display)` / `var(--font-body)`, shipped by `Base.astro` via `@fontsource`).
  **NEVER add a third-party font `<link>`** — the standalone tool pulled Fraunces and Inter from Google's
  font CDN, firing a request carrying the visitor's IP before any consent could be given, on a page with no
  consent banner. That was a live UK PECR exposure and it is the reason this port happened. A grep of the
  built HTML for that CDN's hostname must return nothing.

### Rules that do NOT apply here (noted to avoid confusion)
- The **Telegram mobile URL / no-percent-encoding rule** applies only to URLs sent through a Telegram bot. This tool uses plain website `<a href>` links with no query parameters — standard encoding is fine. Don't apply the `+`-for-spaces rule here.
- The **no-localStorage rule** comes from the Claude artifact sandbox. On a real host, `localStorage`/`sessionStorage` work normally — so if you want to add "save my result" or "resume", you may. (v1 deliberately keeps all state in memory; see §12. ⚠️ If you do add storage, the page's "Your answers stay in your browser" line still holds, but check it before shipping.)
- The read-only master Google Sheet is irrelevant to this tool — it doesn't touch any sheet.

---

## 2. File map

> ⚠️ **Everything used to live in one file; it does not any more.** The blocks below are all still
> there, but split across `src/scripts/breed-matcher/`: `FT`/`svc()` → **`services.js`**; `B()`/`BREEDS[]`
> and `QUESTIONS[]` → **`data.js`**; `effectiveSpace()`/`scoreBreed()`/`whyLine()`/`buildTips()` →
> **`engine.js`**; `state` and every `render*`/`animateBars()` → **`ui.js`**. The CSS moved to the
> `<style is:global>` block in `src/pages/breed-matcher/index/index.astro`, in the same order, every
> selector scoped to `#bm-root`. `README.md` has the "what am I changing → which file" table.

| Block | What it is | Edit frequency |
|---|---|---|
| `FT = {…}` | Fairy Tails service links. 🔒 A key here is a **product claim** — it must exist in `pricing.json` | Rare — and never additively without checking |
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

CSS is organised top-to-bottom: tokens → base → buttons → intro → progress → question → results/bridge → tips → alternatives → reduced-motion.

---

## 3. Tech stack & hosting

- Vanilla JS (ES modules, ES2015+), HTML5, CSS3. No transpile, no framework.
- Fonts: the **site's self-hosted** Fraunces (display) + Karla (body), via `var(--font-display)` /
  `var(--font-body)`, with system-font fallbacks still in the stack. 🔒 **No Google Fonts `<link>`, and
  never any other third-party font request** — see §1 for why (UK PECR).
- Deploy: the page and its modules build with the site (`npm run build`) and go out through the main
  website's GitHub Actions → **FTPS → Hostinger** pipeline (production since 2026-07-04; GitHub Pages is
  a manual-only preview). No actions specific to this tool. Served at `/breed-matcher/`.

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

> ⚠️ **The live config is `src/scripts/breed-matcher/services.js`, and the table below is the ORIGINAL
> placeholder set — history, not current state.** Read the file. Two things changed materially: the URLs
> are now our own site-relative slugs (`/dog-day-school`, `/puppy-training-classes`,
> `/intensive-dog-training`, `/dog-boarding-school`, `/contact`), and **`field` was DELETED on
> 2026-08-03** — we have no field-hire offering in `pricing.json`, so the tool no longer presents one as
> ours. 🔒 **A key in `FT` is a product claim.** Adding one for something we do not sell breaches the
> honesty gate; it must exist in `pricing.json` first. The owner-owed question about field hire is
> recorded at the top of `services.js`.

The original placeholder set, which pointed at the **old live domain**:

| Key | Used for | Placeholder URL |
|---|---|---|
| `daycare` | hours-alone bridge | `/daycare` |
| `puppy` | first-timer bridge | `/training` |
| `intensive` | drive / challenging-breed / strong-steer | `/training` |
| `grooming` | coat-upkeep bridge + the handling tip | `/grooming` |
| `walking` | exercise/space top-up | `/dog-walking` |
| ~~`field`~~ | ~~space/access bridge~~ — **DELETED 2026-08-03**: not a service we sell. The space bridges now suggest hiring a field as generic advice, unlinked | ~~`/contact`~~ |
| `boarding` | (available, not yet wired into a bridge) | `/boarding` |
| `chat` | "thinking of getting a dog" soft CTA | `/contact` |

**Done:** the real page URLs are wired. **Still open:** if field hire turns out to be a real service, it
needs a `pricing.json` entry first, then a `field` key and its bridges back.

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

There's no framework (by rule). The engine is validated with a small **node harness**, committed at
**`tools/breed-matcher/test/engine.test.mjs`** and run via **`npm run test:breed-matcher`** (or
`node tools/breed-matcher/test/engine.test.mjs`).

Since the 2026-08-03 port it simply **imports the real modules** —
`src/scripts/breed-matcher/data.js` and `engine.js` — and asserts against them. The assertions are
unchanged from the standalone era, which is the proof that the port moved the engine without retuning it.

⚠️ **That import is why those modules must stay plain JS with no `src/data/*.ts` imports.** Add a
TypeScript import to any of them and this harness stops running — i.e. the scoring engine silently stops
being covered. (The old machinery — read the HTML, find the inline script with `lastIndexOf('<script>')`,
strip the `renderIntro();` boot call, `(0, eval)` it with the assertions appended so they shared scope with
the eval'd `const`s — existed only because the tool was one file. It is gone; don't reinstate it.)

**Regression checklist** (the §6.6 cases must keep their shape): giant→hard-no with no lift; the dramatic Collie bridge (14→75); Rottweiler+toddler steer flag; allergy hard-no only on non-low-allergen coats; supported never exceeds 92; hard-no `supported === base`. (Mid-range exact numbers like the 73→89 case depend on the *full* answer set, so the harness asserts those as invariants/ranges rather than exact points.)

Plus a manual pass on a real phone at ~380px: auto-advance feels right, Back works, the bar animates, focus rings show on keyboard nav, reduced-motion kills animation.

---

## 14. Suggested next Claude Code session

1. Back up first: `cp src/scripts/breed-matcher/data.js tools/breed-matcher/backups/data.backup-<date>.js`.
2. ~~Confirm the real service URLs in `FT = {…}`.~~ Done — see §5. What is still open there is the
   **field-hire question for Kam** (`services.js`, top).
3. Add the Phase-1 breeds in batches by group; re-run `npm run test:breed-matcher` after each batch to confirm nothing regressed and rankings still look sane.
4. Sit with Kam for 20 minutes on the `kids` / `guard` / `aloneTol` / `novice` values for breeds he knows best.
5. Only then move to Phase 2 (visuals).

Keep edits additive, keep it British English, keep the three things in §0 sacred.
