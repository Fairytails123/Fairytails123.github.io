# tools/breed-matcher — dev kit for the Breed Matcher

The Breed Matcher is a **standalone, self-contained, no-build** web tool (vanilla HTML/CSS/JS in one file).
This folder is its **isolation/dev kit**. The tool itself ships with the main website.

## Where the actual tool lives

**`public/breed-matcher/index.html`** (repo root) → `../../public/breed-matcher/index.html` from here.

Astro copies `public/` verbatim into `dist/`, so the file ships **with no build step** and is served at
**`/breed-matcher/`** on the site. There is only **one** copy of the tool — edit that file directly.

## Working on the tool

1. **Back up first** (standing rule):
   ```
   cp public/breed-matcher/index.html tools/breed-matcher/backups/index.backup-$(date +%Y-%m-%d-%H%M).html
   ```
   (PowerShell: `Copy-Item public/breed-matcher/index.html tools/breed-matcher/backups/index.backup-<date>.html`)
   `backups/` is gitignored.
2. **Edit** `public/breed-matcher/index.html`. Keep it British English, additive, mobile-first (~380px).
3. **Preview** — just open the file in a browser (it's self-contained), or `npm run dev` and visit
   `http://localhost:4321/breed-matcher/`, or `npm run build && npm run preview` for the built version.
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

Not wired into the homepage yet — the site is built inside-out and the homepage is **last**. The homepage
integration is recorded in `WEBSITE-PLAN.md` and `HANDOVER.md` to be done during that build.
