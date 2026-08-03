#!/usr/bin/env node
/**
 * Guard for the canonical-URL redirect rules in public/.htaccess.
 *
 * Those rules are the fix for the duplicate-URL defect found 2026-07-28: Astro's
 * build.format:'file' writes "<slug>.html", the extensionless rewrite serves it, and the
 * raw ".html" file stayed directly fetchable — so every page had a 200-serving twin and
 * the homepage had three live URLs ("/", "/index", "/index.html").
 *
 * A mistake here is expensive in both directions: too loose and the site redirect-loops
 * (every page dead), too tight and the duplicates come back silently. So this parses the
 * REAL .htaccess, replays the rules against a request corpus, and asserts the structural
 * invariants that keep it loop-free.
 *
 * Run: npm run test:htaccess
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htaccess = readFileSync(join(root, 'public', '.htaccess'), 'utf8');

const lines = htaccess
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL  ${msg}`);
};

/* ── Structural invariants ─────────────────────────────────────────────────── */

// The canonical-URL redirects MUST test %{THE_REQUEST} (the original request line).
// Matching %{REQUEST_URI} would also match the internal rewrite to "<slug>.html" that
// the extensionless rule performs, producing an infinite redirect loop.
const redirectConds = lines.filter((l) => /^RewriteCond\s+%\{THE_REQUEST\}/i.test(l));
if (redirectConds.length !== 2) {
  fail(`expected 2 RewriteCond on %{THE_REQUEST} (rules 2a + 2b), found ${redirectConds.length}`);
}
for (const l of lines) {
  if (/^RewriteCond\s+%\{REQUEST_URI\}.*\\\.html/i.test(l)) {
    fail(`a .html rule matches %{REQUEST_URI} — that loops against the extensionless rewrite: ${l}`);
  }
}

// The trailing-slash normaliser must exist and must be guarded on !-d, or every page's
// "slug/" spelling 500s (rule 3 rewrites it to "slug/.html" and loops). It must also sit
// before rule 3. Guarding on !-d is what keeps the real directories (/breed-matcher/,
// /media/, /_astro/) serving 200 instead of being redirected into nothing.
const slashRuleIdx = lines.findIndex((l) => /^RewriteRule\s+\^\(\.\+\)\/\$/i.test(l));
if (slashRuleIdx === -1) {
  fail('the trailing-slash normaliser (RewriteRule ^(.+)/$) is missing — every /slug/ will 500');
} else if (!/^RewriteCond\s+%\{REQUEST_FILENAME\}\s+!-d/i.test(lines[slashRuleIdx - 1] || '')) {
  fail('the trailing-slash rule is not guarded by "RewriteCond %{REQUEST_FILENAME} !-d" — real directories would break');
}

// The extensionless rewrite must still be present, and must come AFTER the redirects.
const extensionlessIdx = lines.findIndex((l) => /^RewriteRule\s+\^\(\.\*\)\$\s+\$1\.html/i.test(l));
if (extensionlessIdx === -1) {
  fail('the extensionless-serving rewrite (RewriteRule ^(.*)$ $1.html) is missing');
}
const lastRedirectIdx = lines.reduce(
  (acc, l, i) => (/^RewriteCond\s+%\{THE_REQUEST\}/i.test(l) ? i : acc),
  -1,
);
if (extensionlessIdx !== -1 && lastRedirectIdx > extensionlessIdx) {
  fail('the canonical-URL redirects must come BEFORE the extensionless rewrite');
}
if (slashRuleIdx !== -1 && extensionlessIdx !== -1 && slashRuleIdx > extensionlessIdx) {
  fail('the trailing-slash normaliser must come BEFORE the extensionless rewrite, or /slug/ still 500s');
}

/* ── Replay the real patterns against a request corpus ─────────────────────── */

// Apache patterns here use only constructs that behave identically in JS regex.
const patterns = redirectConds.map((l) => {
  const m = l.match(/^RewriteCond\s+%\{THE_REQUEST\}\s+(\S+)/i);
  if (!m) fail(`could not parse RewriteCond: ${l}`);
  return m ? new RegExp(m[1], 'i') : null;
});

const evaluate = (theRequest) => {
  for (const re of patterns) {
    if (!re) continue;
    const m = re.exec(theRequest);
    if (m) return { action: '301', to: '/' + (m[1] ?? '') };
  }
  return { action: 'serve' };
};

const cases = [
  ['GET / HTTP/1.1', 'serve', null],
  ['GET /index HTTP/1.1', '301', '/'],
  ['GET /index.html HTTP/1.1', '301', '/'],
  ['GET /london HTTP/1.1', 'serve', null],
  ['GET /london.html HTTP/1.1', '301', '/london'],
  ['GET /dog-boarding-school HTTP/1.1', 'serve', null],
  ['GET /dog-boarding-school.html HTTP/1.1', '301', '/dog-boarding-school'],
  ['GET /dog-boarding-school.html?utm_source=x HTTP/1.1', '301', '/dog-boarding-school'],
  ['GET /breed-matcher/ HTTP/1.1', 'serve', null],
  ['GET /breed-matcher/index.html HTTP/1.1', '301', '/breed-matcher/'],
  // The EXTENSIONLESS twin. Added 2026-08-03 when /breed-matcher/ became a real Astro page at
  // src/pages/breed-matcher/index/index.astro — the double nesting is what preserves the
  // trailing slash under build.format:'file', but it also means "index" is now a real path
  // segment. Rule 2a's `index(\.html)?` already folds it; this case asserts that, so the port
  // cannot silently reintroduce the duplicate-twin defect fixed on 2026-07-28.
  ['GET /breed-matcher/index HTTP/1.1', '301', '/breed-matcher/'],
  ['GET /comprehensive-puppy-training HTTP/1.1', 'serve', null],
  ['GET /dog-exercise-calculator HTTP/1.1', 'serve', null],
  ['GET /puppy-classes HTTP/1.1', 'serve', null],
  ['GET /sitemap-0.xml HTTP/1.1', 'serve', null],
  ['GET /robots.txt HTTP/1.1', 'serve', null],
  ['GET /media/home-hero.mp4 HTTP/1.1', 'serve', null],
  ['GET /og-default.jpg HTTP/1.1', 'serve', null],
  ['GET /_astro/app.abc123.css HTTP/1.1', 'serve', null],
  // a slug that merely CONTAINS "index" must not be caught
  ['GET /index-of-breeds HTTP/1.1', 'serve', null],
  ['GET /reindex HTTP/1.1', 'serve', null],
  // ".html" only inside a query string must not be caught
  ['GET /?ref=a.html HTTP/1.1', 'serve', null],
  // a genuine miss keeps its 404 (ErrorDocument runs as a subrequest; THE_REQUEST is unchanged)
  ['GET /definitely-missing-xyz HTTP/1.1', 'serve', null],
  ['GET /404 HTTP/1.1', 'serve', null],
  ['HEAD /london.html HTTP/1.1', '301', '/london'],
];

for (const [req, wantAction, wantTo] of cases) {
  const got = evaluate(req);
  const ok = got.action === wantAction && (wantAction !== '301' || got.to === wantTo);
  if (!ok) {
    fail(`${req}\n      want ${wantAction} ${wantTo ?? ''}\n      got  ${got.action} ${got.to ?? ''}`);
  }
}

// Loop safety: every 301 target must itself serve, never redirect again.
for (const [req, action, to] of cases) {
  if (action !== '301') continue;
  const target = evaluate(`GET ${to} HTTP/1.1`);
  if (target.action !== 'serve') {
    fail(`REDIRECT LOOP: ${req} -> ${to} -> ${target.action} ${target.to}`);
  }
}

if (failures) {
  console.log(`\n✗ public/.htaccess: ${failures} failure(s)`);
  process.exit(1);
}
console.log(`✓ public/.htaccess: ${cases.length} request cases + structural invariants pass`);
