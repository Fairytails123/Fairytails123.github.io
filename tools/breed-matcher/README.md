# tools/breed-matcher — dev kit for the Breed Matcher

The Breed Matcher is a vanilla-JS breed-matching quiz, shipped as the Astro page **`/breed-matcher/`**
on the main website. It was a standalone single-file tool until 2026-08-03; this folder is its
**isolation/dev kit** (brief, tests, backups) and is **not served**.

## Where the actual tool lives

> ⚠️ **SUPERSEDED 2026-08-03.** The single-file `public/breed-matcher/index.html` is **deleted**. The
> tool is now an Astro page — see the banner at the top of `CLAUDE.md` in this folder for the full
> layout and the traps. Short version:
>
> | What | Where |
> |---|---|
> | The page | `src/pages/breed-matcher/index/index.astro` (🔴 that nested path is load-bearing — it is what keeps the live `/breed-matcher/` trailing-slash URL; read the file header) |
> | Dataset + scoring | `src/scripts/breed-matcher/data.js`, `engine.js` (lifted verbatim; do not retune) |
> | Service links | `src/scripts/breed-matcher/services.js` |
> | Rendering | `src/scripts/breed-matcher/ui.js` |
> | Styling | the `<style is:global>` block in the `.astro` page, all scoped to `#bm-root` |
>
> Keep `data.js` / `engine.js` / `services.js` / `ui.js` as **plain JS with no `.ts` imports** — the
> test harness loads them with bare `node`.

## Working on the tool

1. **Back up first** (standing rule) — copy whichever module you are about to edit:
   ```
   cp src/scripts/breed-matcher/engine.js tools/breed-matcher/backups/engine.backup-$(date +%Y-%m-%d-%H%M).js
   ```
   (PowerShell: `Copy-Item src/scripts/breed-matcher/engine.js tools/breed-matcher/backups/engine.backup-<date>.js`)
   `backups/` is gitignored. The last standalone single-file version is preserved there as
   `index.backup-2026-08-03-astro-port.html`.
2. **Edit the right file.** Keep everything British English, additive, mobile-first (~380px).
   | Changing… | Edit |
   |---|---|
   | breeds, their trait scores, or the quiz questions | `src/scripts/breed-matcher/data.js` |
   | scoring, gaps, bridges, bands, `whyLine()`, tips | `src/scripts/breed-matcher/engine.js` |
   | which service closes a gap, and its link | `src/scripts/breed-matcher/services.js` |
   | screens, rendering, the animated bar, analytics | `src/scripts/breed-matcher/ui.js` |
   | the tool's own palette/CSS | the `<style is:global>` block in the `.astro` page |
   | the page around the tool — hero, prose, help cards, schema | the `.astro` page frontmatter + markup |

   ⚠️ **Never create `public/breed-matcher/index.html`.** Astro copies `public/` verbatim into
   `dist/`, so a file there would be served instead of the page and every fix above would silently
   stop shipping. 🔒 And a service named in `services.js` is a **product claim** — it must exist in
   `src/data/pricing.json` first (the owner-owed field-hire question is recorded at the top of
   `services.js`).
3. **Preview** — `npm run dev`, then visit **`http://localhost:4321/breed-matcher/index`**.
   ⚠️ In dev the trailing-slash URL `…/breed-matcher/` does **not** resolve (`trailingSlash:'never'`);
   only the built output is a real directory. For the true production URL use
   `npm run build && npm run preview` and visit `http://localhost:4321/breed-matcher/`.
   The homepage embeds the page in an iframe, so also check it at `/` — `Base.astro` strips the site
   chrome and every `[data-frame-hide]` section on a framed render.
4. **Test the engine** after any scoring/data change:
   ```
   npm run test:breed-matcher
   ```
5. **Verify it still ships:** `npm run build && npm run verify-urls` (expects `/breed-matcher/` present, 0 failures).

## The full brief

`CLAUDE.md` in this folder is the authoritative spec (the big idea, scoring engine, dataset schema, tips
layer, roadmap). It auto-loads as context when Claude Code works in this folder. **Read it before changing
the engine** — the three sacred rules (hero-breed-first, honest hard-nos, two-register tips) are in §0.

## Homepage

Done. The homepage's `data-section="breed-matcher"` band **iframes `/breed-matcher/`** (with a direct
link beside it as the no-iframe fallback). That is why the page carries `data-frame-hide` /
`data-frame-flat` hooks and why `Base.astro` skips GTM inside a frame — otherwise scrolling past the
homepage section would fire a phantom `page_view`. Test any layout change **framed and unframed**.
