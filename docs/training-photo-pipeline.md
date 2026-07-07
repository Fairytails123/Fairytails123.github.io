# Real-world training photo pipeline (reusable)

How we source, screen and place genuine "dog-in-training-out-in-the-real-world" photos across the site. First run: **2026-07-07** (added to both puppy pages, Intensive, Board & Train and the homepage Track 1 hub; also used to replace 5 stock puppy images). There is a pool of **~3,000** such photos, so this is a repeatable job — re-run it any time the owner wants more anywhere.

## Source

- **Form:** the owner's JotForm **"Training Report"** form `240177109303044` (EU region), ~3,000+ submissions, one photo each on the newer ones.
- **Photo field:** question **34** ("My Photo in Training ") — an `imagelinks` **widget**, so its `.answer` is a JSON string:
  `{"widget_metadata":{"type":"imagelinks","value":[{"name":"IMG_x.jpg","url":"/widget-uploads/imagepreview/240177109303044/<hash><name>.jpg"}]}}`.
  The full URL = `https://www.jotform.com` + that `url`. It 302-redirects to a **signed** `files.jotform.com` link (expires), so **download server-side immediately** (`curl -sL`), ~4.7 MB full-res each. Don't hand the signed URL to a later step.
- **Access:** use the authenticated **JotForm MCP** `mcp__claude_ai_Jotform__api_request` (`endpoint: form/240177109303044/submissions`). ⚠️ It **hard-caps 20 rows/call** and **ignores `offset`/`limit` in the `query` object** — bake them into the endpoint path instead: `form/240177109303044/submissions?offset=N&limit=100` (limit up to 100 honoured). Each call's payload is huge → it auto-saves to a tool-results file; page inside a **subagent** and parse with Python so the raw JSON never hits the main context. (The hardcoded JotForm API keys in `_SECRETS` return **401** for the submissions endpoint — use the MCP.)

## Filter metadata (do this BEFORE downloading — huge hit-rate win)

Every submission is tagged with two fixed-dropdown fields that let you target the owner's priority scenes without looking at a single image yet:

- **Field 21 — Training Location** (10 values): `Bale House Cafe`, `Town Centre/High Street`, `Sea Front`, `Rock-O-Nore - Fishing Huts`, `Travelling - Bus`, `Alexandra Park (Off/On Lead Park Side)`, `Bale House Training Area`, `Around The Barn Area`, `Inside The Barn`. For "real-world public with people": **cafe + town + seafront + bus** (parks are public too but weaker; the barn/training-area are the private facility).
- **Field 23 — Level of Distractions**: `Quite` [sic = quiet] / `Busy` / `Extemely Busy` [sic]. Busy ⇒ people around.
- **Field 1 — My Name** = the dog's first name (for captions + a per-dog variety cap; note free-typed dupes like `Tato`/`TaTo`, `Enzo & Miles`/`Enzo and miles`).

Typical yield (most recent ~1,200 submissions, 2026-07-07): café 177, town/high-street 118, seafront 44, bus 1, busy park ~246.

## Screen every candidate with vision — and exclude head collars/muzzles in TWO passes

The owner is **strict**: **NEVER publish a dog wearing a head collar (Halti / Gentle-Leader — a strap or loop across the muzzle / nose bridge) or a muzzle.** (14 were removed from the Gallery before this.) Ordinary **flat neck collars and body/chest harnesses are fine.**

- Thumbnail candidates (sharp `.rotate()` → ~768 px) so agents can `Read` them. **Workflow subagents can view local images** via the Read tool (webp/jpg render) — fan out batches of ~8 and return structured JSON (scene, people-present, quality, apparent age, alt/caption, and the head-collar/muzzle flag).
- **Run a second, fresh-eyes verify pass on the FINALISTS, focused only on head-collar/muzzle** — on 2026-07-07 the first pass flagged 43/202 and the verify pass **caught 1 more it had missed**. Don't skip it.

## Process + place

- **sharp** `.rotate()` (EXIF auto-orient — these are portrait phone photos) → `resize({width:1400, withoutEnlargement:true})` → `webp({quality:80})`. ~0.5 MB each.
- Put them in **`src/assets/pages/training-real-world/`**, named `rw-<scene>-<dog>-<id>.webp`; import + render with astro:assets `<Image widths sizes>`.
- **Portrait sources → use square or portrait tiles** (`aspect-[4/5]` / `aspect-square`), NEVER landscape `aspect-[4/3]`/`16/9` (crops off heads/feet). Adjust the slot's aspect if you're dropping a portrait photo into an old landscape slot.
- **Captions = dog FIRST NAME only** (consent rule), e.g. `Betty · Settling calmly at the café`.
- **Placement patterns already in the codebase:**
  - No-JS **`data-stagger` grid** (`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6`) — the puppy pages have **no** drag-rail script, so use a grid there.
  - Extend an existing **draggable polaroid rail** (`clientCards` / `rail` array of `{img, caption/name, rotate}` + `[data-drag-track]`) on Intensive, Board & Train, Day School, homepage — those pages already ship `initDragRail`.

## Consent

The Training Report photos are **consent-confirmed for public use** (owner 2026-07-01 for the Gallery, **reconfirmed 2026-07-07**). Same source as the Gallery's `train-*`/`scene-*` shots. If consent for a specific dog changes, delete its `rw-*` file + the array/import entry and rebuild.

## Tooling gotchas (bit us on 2026-07-07)

- **Workflow `args` arrives as a STRING**, so `args.x` is `undefined` (the workflow fired 0 agents the first time). **Hardcode config into the script** instead of relying on `args`. Forward-slash Windows paths work fine with the `Read` tool.
- **Node scripts run from the scratchpad** can't resolve `sharp` → set `NODE_PATH="<repo>/node_modules"`.
- Curation artifacts (candidates/finalists JSON, a labelled contact-sheet montage for eyeballing/owner-review) live in the session scratchpad — **temp, not committed**; regenerate on re-run.

## Stock-image note

The 2026-07-05/06 puppy pages shipped with **5 stock/AI filler images** (real class photos were scarce then): `classes-lead-walk`, `puppy-lab-sit`, `puppy-head-tilt`, `puppy-socialisation`, `puppy-life-skills`. A vision audit of all 104 in-use page images (2026-07-07) flagged exactly those 5; they were **overwritten in place with real photos**. If you ever spot a "too-perfect" studio/stock-looking photo elsewhere, replace it with a real one from this pipeline.
