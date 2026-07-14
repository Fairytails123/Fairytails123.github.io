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

const DIR = 'src/pages';
const HIDE = /(autoAlpha|opacity)\s*:\s*0\s*[,}]/;

const offences = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.astro'))) {
  const path = join(DIR, file);
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!HIDE.test(line)) continue;
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

    // Is this hidden from-state owned by a .from() call? Walk back to the opening call.
    let owner = null;
    for (let k = i; k >= Math.max(0, i - 4); k--) {
      if (/\.(to|fromTo|set)\(/.test(lines[k])) { owner = 'to'; break; }
      if (/\.from\(/.test(lines[k])) { owner = 'from'; break; }
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
