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
 * ─────────────────────────────────────────────────────────────────────────────
 * 2026-08-03 — THE GATE WAS BLIND AND IT WAS NEVER RUN. Both halves fixed here.
 *
 * (1) IT DID NOT RUN AUTOMATICALLY. `npm run build` had no `prebuild`, and
 *     .github/workflows/deploy-hostinger.yml ran verify-urls and test:htaccess but
 *     NEVER verify-reveals. The one gate protecting the site from the bug that has
 *     already cost it 71% of its best page's clicks fired only when a human
 *     remembered to type it. It is now a `prebuild` script AND an explicit CI step.
 *
 * (2) ITS DETECTION MISSED FOUR ORDINARY WAYS OF WRITING THE OFFENCE. The old
 *     matcher was a single-line regex plus a 4-line look-back. Negative-controlled
 *     one shape at a time, ALL FOUR of these passed it clean:
 *       A. `gsap.fromTo(el, { opacity: 0 }, {...})`     — from-state in arg 1
 *       B. `autoAlpha: 0` as the 6th+ property of a multi-line `.from({...})`
 *          ← THE DANGEROUS ONE: multi-line configs are this codebase's house style,
 *            so the miss is the DEFAULT, not an edge case.
 *       C. quoted zeros — `opacity: '0'`
 *       D. `gsap.set(el, { autoAlpha: 0 })` + a scroll-triggered `.to()` reveal
 *          (the same hide-then-reveal, spelled across two calls)
 *     The matcher is now a brace-balanced config-object parser. It reads the WHOLE
 *     config regardless of length, and for `.fromTo()` it inspects ONLY the first
 *     object (the from-state) — the second object is the destination and is meant
 *     to un-hide.
 *
 * ⚠️ WHEN YOU CHANGE THIS FILE, NEGATIVE-CONTROL IT FIRST. Write a file that breaks
 *    the rule, confirm the gate FAILS on it, then confirm it passes once removed.
 *    A gate nobody has ever seen fail is a gate nobody knows is working — that is
 *    exactly how both the 2026-07-14 and 2026-07-28 incidents shipped.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// ⚠️ SCAN EVERY SOURCE FILE UNDER src/, NOT JUST src/pages (widened 2026-07-28),
// AND NOT JUST .astro (widened 2026-08-03 — GSAP could just as easily live in a
// src/scripts/*.ts module, and the gate would never have looked).
// The original gate did a FLAT readdir of src/pages only, so it never once looked at
// src/components — and WholeDogFunnel.astro, the homepage's pinned funnel, was shipping
// five hidden from-states the whole time. Measured live at scroll 0 in real Chrome:
// 32 of 32 [data-fnl-*] nodes hidden (one H2, four H3s, 20 service phrases), while the
// 61 [data-reveal] nodes on the same page were correctly visible — i.e. the gate reported
// green for two weeks while the rule was being broken on the site's biggest earning page.
// A gate that only inspects part of the tree is worse than no gate: it manufactures
// confidence. Keep this recursive and keep the extension list wide.
const ROOT = 'src';
const EXTENSIONS = ['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs'];

// Properties that make content INVISIBLE. `visibility` is here because autoAlpha is
// just opacity+visibility, and someone will eventually write the long form.
// NOTE: scale/scaleX/scaleY are deliberately NOT hide keys — the animation contract
// explicitly permits movement, and the money pages' `scaleY: 0` progress fills are
// decorative bars carrying no text.
const HIDE_KEY = String.raw`(?:autoAlpha|opacity|visibility)`;
const HIDE_VALUE = String.raw`(?:0(?:\.0+)?|['"]0(?:\.0+)?['"]|['"]hidden['"])`;
const HIDE_PROP = new RegExp(String.raw`(?:^|[,{\s])${HIDE_KEY}\s*:\s*${HIDE_VALUE}\s*(?:[,}]|$)`);

// An escape hatch that is DOCUMENTED rather than silent. A hide that is genuinely not a
// scroll reveal (a user-clicked lightbox/filter transition, aria-hidden furniture) may
// carry `verify-reveals-ignore` + a reason on the call line or the 3 lines above it.
// The reason is REQUIRED: a bare marker is rejected, so nobody can quietly mute the gate.
// ⚠️ The separator class must EXCLUDE the newline and the reason must be `[^\n]{12,}`.
// Caught by negative control 2026-08-03: with `[:\s-]+` and `.{12,}`, `\s` matched the
// line break and the "reason" was satisfied by the NEXT LINE OF CODE — so a bare
// `// verify-reveals-ignore` silently suppressed the gate, which is the precise failure
// this marker exists to prevent. The reason must sit on the marker's own line.
const IGNORE = /verify-reveals-ignore[ \t:\-\u2013\u2014]+([^\n]{12,})/;

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return e.isFile() && EXTENSIONS.some((x) => p.endsWith(x)) ? [p] : [];
  });

/**
 * From `open` (the index of a `(`), return the source text of the first `{...}`
 * object literal in the argument list, brace-balanced and string-aware.
 * Returns null if the call has no object literal before its closing paren.
 */
const firstConfigObject = (src, open) => {
  let depth = 0;
  let quote = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    const prev = src[i - 1];
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '(') depth++;
    else if (ch === ')') { depth--; if (depth === 0) return null; }
    else if (ch === '{') {
      // Found the start of the first object literal — brace-match it.
      let braces = 0;
      let q = null;
      for (let j = i; j < src.length; j++) {
        const c = src[j];
        const p = src[j - 1];
        if (q) { if (c === q && p !== '\\') q = null; continue; }
        if (c === "'" || c === '"' || c === '`') { q = c; continue; }
        if (c === '{') braces++;
        else if (c === '}') { braces--; if (braces === 0) return src.slice(i, j + 1); }
      }
      return src.slice(i);
    }
  }
  return null;
};

/** Strip block and line comments so a commented-out property can't trip the gate. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

/**
 * Strip balanced `(...)` spans, so a NESTED call inside a config cannot be blamed on
 * its parent. Without this, `Flip.from(state, { onEnter: (els) => gsap.fromTo(els,
 * { opacity: 0 }, …) })` reports the OUTER Flip.from as well as the inner fromTo —
 * two lines for one fact, and the outer one is a plain false positive (Flip.from's
 * first object is a config, not a from-state). The inner call is still matched on its
 * own by the top-level scan, so nothing is lost. A real hide property is never inside
 * parentheses at object level.
 */
const stripNestedParens = (s) => {
  let out = '';
  let depth = 0;
  let quote = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quote) { if (ch === quote && s[i - 1] !== '\\') quote = null; if (depth === 0) out += ch; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; if (depth === 0) out += ch; continue; }
    if (ch === '(') { depth++; continue; }
    if (ch === ')') { if (depth > 0) depth--; continue; }
    if (depth === 0) out += ch;
  }
  return out;
};

const offences = [];

for (const path of sourceFiles(ROOT)) {
  const src = readFileSync(path, 'utf8');
  const lines = src.split(/\r?\n/);
  const lineOf = (idx) => src.slice(0, idx).split(/\r?\n/).length;

  // `.from(` / `.fromTo(` / `gsap.set(` — every call whose FIRST config object is
  // rendered immediately. `(?<!\bArray)` keeps `Array.from({length: n}, …)` out: it
  // builds decorative SVG particles, not tweens, and flagging it would train people
  // to ignore the gate.
  const CALL = /(?<!\bArray)\.(from|fromTo|set)\s*\(/g;
  let m;
  while ((m = CALL.exec(src)) !== null) {
    const kind = m[1];
    const openParen = src.indexOf('(', m.index + 1);
    const config = firstConfigObject(src, openParen);
    if (!config) continue;
    if (!HIDE_PROP.test(stripNestedParens(stripComments(config)))) continue;

    const ln = lineOf(m.index);

    // Documented exemption on the call line or the 8 lines above it. The window has to be
    // this generous because a justification worth reading runs to two or three comment
    // lines, and the tween is often a line or two below its property key
    // (`onEnter: (els) =>` then the call). Too tight a window and authors get a failure
    // they cannot silence honestly — which is how gates end up deleted.
    const window = lines.slice(Math.max(0, ln - 9), ln).join('\n');
    if (IGNORE.test(window)) continue;

    // The [data-hero-cue] scroll arrow is aria-hidden decorative furniture carrying no
    // text — it is the one built-in allowance, kept so ten pages don't each need a
    // comment. Anything else must justify itself in writing.
    if (/\[data-hero-cue\]/.test(src.slice(m.index, openParen + 60))) continue;

    const snippet = config.replace(/\s+/g, ' ').slice(0, 96);
    offences.push(`${path}:${ln}  .${kind}( ${snippet}${config.length > 96 ? ' …' : ''}`);
  }
}

if (offences.length) {
  console.error('\n✖ Content is being HIDDEN from Googlebot at t=0.\n');
  console.error('  A .from()/.fromTo() from-state, or a gsap.set(), that zeroes');
  console.error('  autoAlpha/opacity/visibility immediate-renders that state. Googlebot');
  console.error('  renders but never scrolls, so it never sees the reveal.');
  console.error('  Move the content (y / x / scale / blur) instead of hiding it.\n');
  console.error('  If this really is not a scroll reveal (a user-clicked lightbox or');
  console.error('  filter transition, aria-hidden furniture), add a comment above it:');
  console.error('    // verify-reveals-ignore — <why this cannot hide content from a crawler>\n');
  offences.forEach((o) => console.error(`  ${o}`));
  console.error(`\n  ${offences.length} offending tween(s). See scripts/verify-reveals.mjs.\n`);
  process.exit(1);
}

console.log(`✓ verify-reveals — no tween hides content (Googlebot sees every word).`);
