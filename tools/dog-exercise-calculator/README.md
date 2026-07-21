# tools/dog-exercise-calculator — dev kit

> ⚠️ **INTEGRATED AS AN ASTRO PAGE 2026-07-21 — the paths below are the OLD standalone-bundle layout and are superseded.** The tool ships as **`/dog-exercise-calculator`** (`src/pages/dog-exercise-calculator.astro`), NOT from `public/`. **Edit the engine at `src/scripts/dog-exercise-calculator/{data,engine,copy,ui}.js`** (there is no `public/` copy). Tests: **`npm run test:dog-exercise-calculator`**. Read this folder's `CLAUDE.md` (its top note) for the full picture; §0's sourcing discipline and the engine contract still apply verbatim.

The dog exercise calculator is a pure-ESM tool (no bundler, no dependencies). This folder is its
isolation/dev kit and **does not ship**.

## Where the tool lives (superseded — see the note above)

The engine now lives at **`src/scripts/dog-exercise-calculator/`** (imported by the Astro page).
The historical standalone layout described below was `public/dog-walking-calculator/` served at
`/dog-walking-calculator/`; it no longer exists in this repo.

```
index.html    markup + module boot
styles.css    THROWAWAY theme, replaced at integration
data.js       bands, 97 breeds, and the numeric RULES
copy.js       every user-facing string
engine.js     pure calculation — no DOM, no window, no network
ui.js         all DOM work
```

## Working on it

1. **Back up first** (standing rule):
   ```
   cp public/dog-walking-calculator/engine.js tools/dog-walking-calculator/backups/engine.js.backup-$(date +%Y-%m-%d-%H%M)
   ```
   PowerShell: `Copy-Item public/dog-walking-calculator/engine.js tools/dog-walking-calculator/backups/engine.js.backup-<date>`
   (`backups/` is gitignored.)

2. **Edit.** British English, additive, mobile-first (~380px).

3. **Test the engine** after any logic or data change:
   ```
   npm run test:dog-walking-calculator
   ```
   Expect `ALL PASS`. 85 assertions including every breed × stage × age combination.

4. **Preview.** `npm run dev`, then `http://localhost:4321/dog-walking-calculator/`.
   (Opening `index.html` straight off disk also works, except deep-link URL updating, which the
   browser blocks on `file://`.)

5. **Confirm it still ships:** `npm run build && npm run verify-urls`.

## Browser pass — required after any `ui.js` change

The node harness covers the engine only. After touching the UI, serve `public/` and check:

- keyboard-only breed selection: type, `ArrowDown`, `Enter`
- submit with nothing chosen → inline error, no result card
- change an input after submitting → the card recomputes rather than going stale
- `?breed=pug&stage=puppy&months=14` → headline 45 minutes **and** a breakdown that agrees with it
  (this is where the puppy cap bites; the two once contradicted each other)
- console clean

## The full brief

**`CLAUDE.md` in this folder is authoritative — read §0 before changing any number.** Three figures in
this tool are our editorial judgement rather than published guidance, and the page says so out loud.
Changing one without changing the matching sentence in `copy.js` makes the page dishonest.
