/**
 * verify-reveals — the scroll-reveal SEO gate.
 *
 * WHY THIS EXISTS (2026-07-14, the 71% Board & Train click drop)
 * --------------------------------------------------------------
 * `gsap.from(el, { autoAlpha: 0, scrollTrigger })` IMMEDIATE-RENDERS its from-state.
 * The moment JS runs, every [data-reveal] becomes opacity:0 + visibility:hidden, and it
 * only un-hides when a human scrolls it into view.
 *
 * Googlebot does not scroll, and it snapshots before GSAP's timeline advances. So it
 * rendered /dog-boarding-school with ALL 14,227 characters of body copy hidden — the
 * page's head terms (which rank on title/URL/links) held at #3-6 while the entire
 * long tail, which needs body content, collapsed. Clicks fell 71%.
 *
 * THE RULE: a scroll reveal may MOVE content (y / x / scale / blur). It must NEVER
 * hide it. Content has to be fully visible in the rendered DOM at t=0, with no JS and
 * no scroll required — because that is all Googlebot, a screen reader, and a stalled
 * render ever get.
 *
 * Decorative, aria-hidden furniture (the [data-hero-cue] scroll arrow, the homepage
 * canvas/video crossfade) may still fade — it carries no text. Those are `.to()`
 * tweens, which this gate deliberately ignores.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// ⚠️ SCAN EVERY .astro FILE UNDER src/, NOT JUST src/pages (widened 2026-07-28).
// The original gate did a FLAT readdir of src/pages only, so it never once looked at
// src/components — and WholeDogFunnel.astro, the homepage's pinned funnel, was shipping
// five hidden from-states the whole time. Measured live at scroll 0 in real Chrome:
// 32 of 32 [data-fnl-*] nodes hidden (one H2, four H3s, 20 service phrases), while the
// 61 [data-reveal] nodes on the same page were correctly visible — i.e. the gate reported
// green for two weeks while the rule was being broken on the site's biggest earning page.
// A gate that only inspects part of the tree is worse than no gate: it manufactures
// confidence. Keep this recursive.
const ROOT = 'src';
const HIDE = /(autoAlpha|opacity)\s*:\s*0\s*[,}]/;

const astroFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return astroFiles(p);
    return e.isFile() && p.endsWith('.astro') ? [p] : [];
  });

const offences = [];

for (const path of astroFiles(ROOT)) {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!HIDE.test(line)) continue;
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

    // Is this hidden from-state owned by a .from() call? Walk back to the opening call.
    let owner = null;
    for (let k = i; k >= Math.max(0, i - 4); k--) {
      if (/\.(to|fromTo|set)\(/.test(lines[k])) { owner = 'to'; break; }
      // `(?<!\bArray)` — `Array.from({length: n}, …)` is not a GSAP tween. Without this the
      // gate flags decorative SVG particles built inside an Array.from callback (they set
      // opacity:0 and carry no text), which would train people to ignore a real failure.
      if (/(?<!\bArray)\.from\(/.test(lines[k])) { owner = 'from'; break; }
    }
    if (owner !== 'from') continue;                 // .to()/.set() may fade — no text
    if (lines[i].includes('[data-hero-cue]')) continue; // aria-hidden scroll arrow

    offences.push(`${path}:${i + 1}  ${line.trim()}`);
  }
}

if (offences.length) {
  console.error('\n✖ Scroll reveals are HIDING content from Googlebot.\n');
  console.error('  A gsap.from() reveal must never set autoAlpha/opacity to 0 — it');
  console.error('  immediate-renders that state and Googlebot never scrolls to undo it.');
  console.error('  Move the content (y/x/scale/blur) instead of hiding it.\n');
  offences.forEach((o) => console.error(`  ${o}`));
  console.error(`\n  ${offences.length} offending reveal(s). See scripts/verify-reveals.mjs.\n`);
  process.exit(1);
}

console.log('✓ verify-reveals — no scroll reveal hides content (Googlebot sees every word).');
