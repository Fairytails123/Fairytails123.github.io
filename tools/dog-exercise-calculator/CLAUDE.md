# Dog Walking Calculator — authoritative brief

> ⚠️ **INTEGRATED AS AN ASTRO PAGE, 2026-07-21 — this file's path references below are the STANDALONE-bundle layout and are now superseded.** The tool ships as **`/dog-exercise-calculator`** (a full `<Base>` Astro page: `src/pages/dog-exercise-calculator.astro`), **NOT** a bare `public/` file. The engine lives at **`src/scripts/dog-exercise-calculator/{data,engine,copy,ui}.js`** (edit these — there is no `public/dog-walking-calculator/` copy). Tests: **`npm run test:dog-exercise-calculator`**. `ui.js` was adapted only for ClientRouter-safety + the site's `tool_engagement` event; the page owns the styling (the throwaway `styles.css`/`index.html` are gone — the `.astro` page + its `<style is:global>` theme the `dwc__` classes), and the sourcing/disclaimer render server-side from `copy.js`. **Everything else below — §0 sourcing discipline, the engine contract, the search ranks, the dataset rules, the testing invariants — still applies verbatim.** Back up before edits to `src/scripts/dog-exercise-calculator/` under `backups/` (gitignored).

**Project:** Dog walking/exercise calculator for The Fairy Tails K9 Centre (Hastings)
**Status:** v1 complete, tested, browser-verified, and integrated as the Astro page `/dog-exercise-calculator`.
**Sibling tool:** the Breed Matcher (`tools/breed-matcher/`). Same repo pattern, same standing rules.

---

## 0. The one thing not to lose

**This tool distinguishes what is published from what is our judgement, and says so on the page.**

Three numbers in it are ours, not sourced. The copy states that plainly, in public, next to the
result. That honesty is the whole reason this tool is better than the competitor it was modelled on —
that one attributes a rule to an organisation which publicly disagrees with it.

If you change any of the three, change the matching sentence in `copy.js` in the same commit:

| Number | Where | Status |
|---|---|---|
| Senior reduction factor `0.8` | `RULES.senior.factor` | **NOT SOURCED.** No authority publishes any senior reduction. PDSA says "a little less"; Blue Cross's "2 × 30 min rather than an hour" is a redistribution at unchanged volume, not a cut. *Context only, not justification:* other calculators that apply a factor land between ×0.6 and ×0.85 (Dog Outsiders uses ×0.8), so ours sits mid-pack — but a competitor is not a source, and the copy does not cite one. |
| Puppy cap at the adult figure | `RULES.puppy.capAtAdultMax` | **NOT SOURCED.** Ours, for safety: the five-minute rule exceeds the adult figure for a small breed from about four months. |
| The four band ranges | `BANDS` | **NOT SOURCED.** RKC publishes tiers, PDSA publishes minimums; neither publishes these ranges. |

And two attribution traps, both already avoided — do not reintroduce them:

- The five-minute puppy rule is **The Royal Kennel Club's**, not PDSA's. PDSA criticises it:
  *"there's no scientific evidence behind this rule, and although it might work for some, it's not
  appropriate for most puppies."*
- The much-quoted line about the rule being wrong for *"toy breeds or brachycephalics"* is **Vet Help
  Direct**, not PDSA. Search engines conflate the two.

---

## 1. Standing rules (inherited from the Breed Matcher, non-negotiable)

- **British English** everywhere — copy, comments, commit messages. (colour, behaviour, recognise.)
- **Additive edits.** Don't rip out working sections to tidy.
- **Back up before editing:** `cp public/dog-walking-calculator/<file> tools/dog-walking-calculator/backups/<file>.backup-<date>`
  (`backups/` is gitignored.)
- **No build step, no framework, no bundler.** Native ES modules, opened straight from `public/`.
- **No runtime dependencies.** No CDN, no fonts, no network calls.
- **Mobile-first**, designed and checked at ~380px.
- **Hosting is the main site's Astro build only** — the file ships verbatim from `public/`.

---

## 2. File map

Tool (ships, served at `/dog-walking-calculator/`):

| File | Contains | Edit frequency |
|---|---|---|
| `index.html` | Semantic markup + module boot. `data-dwc` hooks are the JS contract. | Low |
| `styles.css` | **Throwaway theme.** Replaced at integration. Nothing reads it. | Replace wholesale |
| `data.js` | `BANDS`, `BAND_ORDER`, `RULES`, `BREEDS` (97). Pure data. | Medium — adding breeds |
| `copy.js` | Every user-facing string + formatters. | Medium — tone of voice |
| `engine.js` | **Pure calculation.** No DOM, no window, no network. | Low — read §0 first |
| `ui.js` | All DOM work. Reads `[data-dwc]` hooks and ids only. | Medium |

Dev kit (does not ship): this file, `README.md`, `test/engine.test.mjs`, `backups/`.

**Import direction is one-way:** `data.js ← engine.js ← ui.js → copy.js → data.js`.
`engine.js` never imports `copy.js` or `ui.js`. Keep it that way — it is what lets node import the
engine directly with no DOM stub, and what would let an Astro component reuse it.

---

## 3. The engine contract

```js
normaliseInput(raw)          // coerce loose values, never decides validity
validate(input)              // -> {ok, errors:[{field, code, message}]}  ALL errors, not just the first
calculate(input)             // -> Result. THROWS on invalid input; call validate first
searchBreedsWithMeta(q, n)   // -> {results, total, isFuzzy}
searchBreeds(q, n)           // -> results only
hasNoMatches(q)              // -> boolean
getBreedBySlug / getBand
parseQuery(search) / buildQuery(input)   // ?breed= deep links, both directions
```

`calculate` returns everything the UI needs so the UI stays a dumb renderer:
`{input, band, breed, lifeStage, adultBaseline, headline:{minMinutes,maxMinutes,sessionsPerDay},
puppy|null, senior|null, cautions[]}`.

### Stage maths

```
adult   headline = band.minMinutes .. band.maxMinutes
puppy   perSession = 5 x floor(months);  perDay = 2 x perSession
        perDay CAPPED at band.maxMinutes  (ours — see §0)
        puppy.months is the FLOORED value; the UI must display that, not the raw input
senior  min = max(round5(band.min x 0.8), 15)
        max = max(round5(band.max x 0.8), 15), forced above min
```

`RULES.puppy.minMonths = 2` because a younger puppy should still be with its mother and litter.

### Cautions

Ids are stable and drive copy lookup in `COPY.cautions`. Adding a caution means adding **both** the
push in `buildCautions` and the entry in `copy.js`, or the test "every caution id has copy defined"
fails.

`puppy-growing-joints`, `puppy-giant-growth`, `puppy-reached-adult-level`, `senior-little-and-often`,
`senior-vet-check`, `brachycephalic-breathing`, `sighthound-sprints`, `working-needs-a-job`.

**`giantGrowth` means a longer restriction PERIOD, never a smaller daily number.** No source
publishes a giant-breed daily multiplier, so there isn't one in the code. Don't add one.

---

## 4. Search

Ranked, not filtered — the tool this replaced listed French Bulldog above Bulldog for the query
"Bulldog". Ranks, best first:

```
0  exact name (spaced or compact)
1  exact alias      <- deliberately ABOVE rank 4
2  name starts with
3  alias starts with
4  a word in the name starts with
5  substring in name
6  substring in alias
```

**Rank 1 above rank 4 is load-bearing.** It is what makes family defaults resolve: `poodle` →
Standard Poodle (exact alias) rather than Miniature Poodle (word-prefix). Same for `collie` → Border,
`dachshund` → Standard, `schnauzer` → Standard, `cocker` → English, `king charles` → Cavalier. Ten
aliases depend on this; the build script prints them as "ambiguous" for review each run.

Handled in the engine, so they need **no alias entries**:
- plurals (`staffies`, `collies`, `boxers`) — irregular forms are all tried
- filler words (`pug dog`, `lab puppy`, `collie cross`, `my labrador puppy`)
- punctuation, hyphens and accents (`shar-pei`, `Löwchen`)
- no-space spellings (`shihtzu`, `bordercollie`, `germanshepherd`)
- single-letter typos, via a Levenshtein fallback that only runs when nothing matched literally, and
  is flagged `isFuzzy` so the UI can say "did you mean"

**Alias rules, enforced by the harness:** globally unique; never equal to another breed's real name;
lowercase. A clashing alias silently hands the user the wrong dog's numbers — the tool this replaced
sends `mastiff` to Bullmastiff and `collie` to Border Collie only.

---

## 5. The dataset

97 breeds. Derived from this site's own Breed Matcher data, then cross-checked breed by breed against
the Royal Kennel Club's per-breed exercise tier and PDSA's minimum-exercise fact box. Both are
recorded per breed in `source`.

**They are not the same quantity** — PDSA publishes a MINIMUM, RKC publishes an upper-ish band. Never
average them silently.

**Band assignment rule:** follow the published evidence, EXCEPT where a documented physical constraint
makes it unsafe as a target — a flat-faced airway, or a giant frame with joint and bloat risk. Those
are banded down a step (Bullmastiff two steps) and the reason is written into `note`. No silent
averages, and no band whose range cannot express the figure its own note claims.

Band edges sit on the published landmarks: **30** (PDSA's floor and RKC's lowest tier), **60** (inside
the 45–75 band), **120** ("2 hours", both authorities' key number).

```
low 30-45   moderate 45-75   high 75-120   working 120-180
```

Continuous by design. The tool this replaced has a hole between 45 and 60, so no dog can ever be told
50 minutes.

**Adding a breed** is additive: append a row to `BREEDS`, run the harness. It fails loudly on a
duplicate slug, a clashing alias, an alias shadowing a real breed name, or an unknown band.
**Never rename or reuse a slug** — slugs are public `?breed=` deep links.

---

## 6. Testing

```
npm run test:dog-walking-calculator
```

85 assertions. No framework, no DOM stub — plain ESM import, because the engine is DOM-free.

Written as **invariants over the whole dataset** rather than hard-coded breeds, because a hard-coded
expectation rots the moment someone re-tiers a breed. It calculates **every breed × every stage ×
every legal puppy age (1,919 combinations)** and asserts: no throw, no NaN, min ≤ max, whole numbers,
positive, a puppy never exceeds the adult figure, a senior never exceeds the adult figure.

Keep green, and add a case for anything you fix.

**A browser pass is still required after UI changes** — the harness does not touch `ui.js`. Serve
`public/` and check: keyboard-only breed selection (arrows + Enter), submit with nothing chosen shows
an inline error, the result recomputes live after the first submit, the puppy cap message appears for
a Pug at 14 months, and the console is clean.

---

## 7. Deliberate divergences from the tool this was modelled on

Recorded so nobody "fixes" them back. Full table in the bundle's `INTEGRATION.md` §8. The headlines:
validation instead of a silently invented "moderate" answer; puppy age clamped (theirs will tell you
990 minutes a day); stage-appropriate headline instead of always showing the adult range; the result
recomputes instead of going stale; ranked and typo-tolerant search; deep links; a real ARIA combobox;
beacon de-duplication.

---

## 8. Roadmap

1. **Extend the dataset** beyond the 97 inherited breeds, same additive process.
2. **Cross-link from breed content** using `?breed=<slug>` — the competitor never wired its 435 breed
   pages to its own calculator, which is the most obvious missed integration in the category.
3. **Reverse link** from the Breed Matcher to this tool.
4. **Decide on the beacon** (`ANALYTICS` in `ui.js`, shipped disabled). If enabled, gate on cookie
   consent.
5. **Owner review of band assignments** with Kam, particularly the safety downgrades in §5 and the
   crosses, which have no RKC or PDSA page at all.
6. Page-specific Open Graph tags when it gets a real page wrapper.

---

## 9. Provenance

The research bundle lives with the handover, not in the repo:
`research-guidance.md` (published guidance with quotes and URLs, and an explicit list of what is *not*
published), `research-competitors.md`, `reference-spec.md` (the 26 catalogued defects of the tool this
replicates), `dataset-candidate.json` and `build-data.mjs` (how `data.js` was generated, including
every verifier fix applied).

Read `research-guidance.md` before changing any number in `RULES`.
