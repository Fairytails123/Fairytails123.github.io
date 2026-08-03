/**
 * verify-nap — the "facts come from business.ts" gate.
 *
 * WHY THIS EXISTS (2026-08-03)
 * ---------------------------
 * The house rule is that NAP facts — phone, email, address — render from
 * `src/data/business.ts` and are never typed into copy. The rule was real but
 * UNENFORCED, and three literals had accumulated where it mattered most:
 *
 *   src/components/EnquiryForm.astro ×2 — the enquiry form's SUCCESS and FAILURE
 *     messages quoted the phone number as a string literal inside an inline
 *     <script>, which cannot import frontmatter. So the single highest-intent
 *     moment on the site — "we've got your enquiry, call us if it's urgent" —
 *     would have gone on quoting a dead number after any change.
 *   src/pages/contact.astro — the meta description, i.e. the number Google shows.
 *
 * That is not hypothetical drift. The business is currently cleaning the dead
 * grooming-era mobile 07842 116216 off SIX independent directory listings, and the
 * reason it spread is that nobody had a way to notice a number going stale. The
 * website should not be the seventh.
 *
 * THE RULE THIS ENFORCES
 * ----------------------
 *   • `src/data/business.ts` IS the source of truth — every phone/email literal in
 *     it is canonical by definition. Add a number there and the gate accepts it.
 *   • .astro / .ts components may contain NO phone or email literal at all. They can
 *     interpolate, so a literal is never necessary and is always a latent defect.
 *   • Markdown in src/content/ CAN'T interpolate, so a literal is permitted — but
 *     only if it byte-matches a canonical value. A number that drifts fails the build.
 *
 * ⚠️ NEGATIVE-CONTROL THIS WHEN YOU CHANGE IT: plant a wrong number, confirm the gate
 *    fails, then remove it. A gate nobody has watched fail is not known to work.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_OF_TRUTH = 'src/data/business.ts';

// UK phone shapes as a human would write them, plus +44 forms.
const PHONE = /(?:\+44\s?\(?0?\)?\s?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}|\b0\d{3,4}[\s-]?\d{6,7}\b)/g;
const EMAIL = /\b[A-Za-z0-9._%+-]+@thefairytails\.co\.uk\b/g;

const normalise = (s) => s.replace(/[\s()\-]/g, '').replace(/^\+440?/, '0').replace(/^\+44/, '0');

/**
 * Remove anything where a digit run is not a phone number: URLs (Google's tracking
 * params are full of 11-digit runs), markdown link targets, and tel:/wa.me hrefs.
 * Without this the gate would fail on the London-parks post's Google-review link.
 */
const stripUrls = (s) =>
  s
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\]\([^)]*\)/g, '](  )')
    .replace(/(?:tel|mailto):\S+/g, ' ')
    .replace(/wa\.me\/\S+/g, ' ');

const walk = (dir, exts) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p, exts);
    return e.isFile() && exts.some((x) => p.endsWith(x)) ? [p] : [];
  });

/** Strip block and line comments. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');

// ---- canonical set: every phone/email literal in business.ts -------------------
// ⚠️ COMMENTS MUST BE STRIPPED FIRST. Caught by negative control 2026-08-03: business.ts
// line ~51 names the DEAD grooming-era mobile in a comment explaining the citation guard.
// Without this strip that number became "canonical", and the gate then waved through a
// planted stale number in markdown — i.e. the one number this gate exists to catch was
// the one number it was blind to. Data is canonical; prose about data is not.
const truth = stripComments(readFileSync(SOURCE_OF_TRUTH, 'utf8'));
const canonicalPhones = new Set([...truth.matchAll(PHONE)].map((m) => normalise(m[0])));
const canonicalEmails = new Set([...truth.matchAll(EMAIL)].map((m) => m[0].toLowerCase()));

if (!canonicalPhones.size) {
  console.error(`✖ verify-nap: found no phone number in ${SOURCE_OF_TRUTH} — the gate cannot work. Check the file.`);
  process.exit(1);
}

const offences = [];

// ---- 1. components/pages: NO literal is acceptable ----------------------------
for (const path of walk('src', ['.astro', '.ts', '.tsx'])) {
  if (path.replace(/\\/g, '/') === SOURCE_OF_TRUTH) continue;
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/verify-nap-ignore/.test(line)) return;
    const clean = stripUrls(line);
    for (const m of clean.matchAll(PHONE)) {
      offences.push(
        `${path}:${i + 1}  hard-coded phone "${m[0]}" — import { business } and use business.phones.main.display`
      );
    }
    for (const m of clean.matchAll(EMAIL)) {
      offences.push(`${path}:${i + 1}  hard-coded email "${m[0]}" — use business.emails.*`);
    }
  });
}

// ---- 2. markdown: a literal is allowed, but only if it is CURRENT --------------
for (const path of walk('src/content', ['.md', '.mdx'])) {
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const clean = stripUrls(line);
    for (const m of clean.matchAll(PHONE)) {
      if (canonicalPhones.has(normalise(m[0]))) continue;
      offences.push(`${path}:${i + 1}  STALE phone "${m[0]}" — not in ${SOURCE_OF_TRUTH}`);
    }
    for (const m of clean.matchAll(EMAIL)) {
      if (canonicalEmails.has(m[0].toLowerCase())) continue;
      offences.push(`${path}:${i + 1}  STALE email "${m[0]}" — not in ${SOURCE_OF_TRUTH}`);
    }
  });
}

if (offences.length) {
  console.error('\n✖ NAP facts are not coming from business.ts.\n');
  console.error('  A phone number or email that lives in copy instead of data goes stale');
  console.error('  silently — the same way 07842 116216 ended up on six directory listings.\n');
  offences.forEach((o) => console.error(`  ${o}`));
  console.error(`\n  ${offences.length} problem(s). See scripts/verify-nap.mjs.\n`);
  process.exit(1);
}

console.log(
  `✓ verify-nap — every phone/email traces to business.ts ` +
    `(${canonicalPhones.size} number(s), ${canonicalEmails.size} address(es)).`
);
