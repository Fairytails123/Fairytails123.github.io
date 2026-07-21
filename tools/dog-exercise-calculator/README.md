# tools/dog-walking-calculator — dev kit

The Dog Walking Calculator is a **no-build** web tool: native ES modules, no bundler, no
dependencies. This folder is its isolation/dev kit and **does not ship**. The tool itself ships from
`public/`.

## Where the tool lives

**`public/dog-walking-calculator/`** (repo root) → `../../public/dog-walking-calculator/` from here.

Astro copies `public/` verbatim into `dist/`, so it is served at **`/dog-walking-calculator/`** with
zero build wiring. There is only one copy — edit those files directly.

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
