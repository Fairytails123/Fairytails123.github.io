/**
 * Regression harness for `toAreaDistrict()` — the ONLY place the enquiry form's
 * "Postcode or area" value is reduced before it reaches dataLayer/GA4.
 *
 * 🔒 LOCKED PRIVACY DECISION #6: only the DISTRICT (outward code, e.g. "TN35",
 * "SW1A") may ever reach analytics. The FULL postcode identifies a household and
 * stays exclusively in the private n8n path (and the owner's enquiry email).
 *
 * Why this file exists: the original implementation matched an ANCHORED regex, so
 * it only reduced the value when the WHOLE field was a postcode. Real entries like
 * "London SW1A 1AA" or "TN35 5DT, Hastings" — which the form's own placeholder
 * invites — fell through to a raw `value.slice(0, 32)` and shipped the full
 * postcode to GA4. Live from 2026-07-14, found and fixed 2026-07-23.
 *
 * No GA4/GTM setting can catch this: stream-level "Redact data" inspects
 * page_location query parameters and email patterns, never the VALUES of custom
 * event parameters. The reduction has to be correct before the push.
 *
 * Run: npm run test:area-district
 *
 * The function is read out of the real TypeScript source (rather than copied) so
 * there is exactly one source of truth. If it is renamed or moved, this fails loudly.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, '..', 'src', 'scripts', 'analytics.ts');

const src = readFileSync(SOURCE, 'utf8');
const start = src.indexOf('export function toAreaDistrict');
if (start === -1) {
  console.error(`FAIL: toAreaDistrict() not found in ${SOURCE}.`);
  console.error('It was renamed, moved or deleted — this guard must be repointed, not removed.');
  process.exit(1);
}
// Walk braces from the function's opening `{` to its matching close.
const open = src.indexOf('{', start);
let depth = 0;
let end = -1;
for (let i = open; i < src.length; i += 1) {
  if (src[i] === '{') depth += 1;
  else if (src[i] === '}') {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const body = src
  .slice(open, end)
  .replace(/\)\s*:\s*string/g, ')') // strip the return annotation if it landed inside
  .trim();

// eslint-disable-next-line no-new-func
const toAreaDistrict = new Function('raw', body.slice(1, -1));

/** [input, expected] */
const CASES = [
  // The bug that prompted this file — a postcode ANYWHERE in the string.
  ['London SW1A 1AA', 'SW1A'],
  ['TN35 5DT, Hastings', 'TN35'],
  ['14 Acacia Avenue, TN34 2QQ', 'TN34'],
  ['SE1 7PB (Southwark)', 'SE1'],
  ['E17 something 9AB', 'E17'],
  // Plain postcodes, the case that always worked.
  ['TN35 5DT', 'TN35'],
  ['SW1A 1AA', 'SW1A'],
  ['tn35 5dt', 'TN35'],
  ['SW1A1AA', 'SW1A'],
  // Bare outward codes are already district-level.
  ['TN35', 'TN35'],
  ['N1', 'N1'],
  ['near TN35', 'TN35'],
  // Free-text areas are not identifying and pass through as typed.
  ['Hastings', 'Hastings'],
  ['London', 'London'],
  ['', ''],
  ['   ', ''],
  // Digits but no postcode: dropped rather than guessed at. An empty district is
  // a gap in a report; a leaked postcode is a household.
  ['Flat 3, London', ''],
];

let failed = 0;

for (const [input, expected] of CASES) {
  const actual = toAreaDistrict(input);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL  ${JSON.stringify(input)} -> ${JSON.stringify(actual)} (expected ${JSON.stringify(expected)})`);
  }
}

// The invariant that matters more than any single case: nothing that leaves this
// function may contain an inward code (the "5DT" half), in any input.
const FUZZ = [
  'TN35 5DT', 'tn35 5dt', 'TN355DT', 'London SW1A 1AA', 'my postcode is BN21 4RT ok',
  'BN21 4RT', 'Hastings TN34 1AB', 'GIR 0AA', 'EC1A 1BB', 'W1A 0AX', 'M1 1AE',
  'B33 8TH', 'CR2 6XH', 'DN55 1PT', '  TN35   5DT  ', 'TN35-5DT', 'TN35,5DT',
];
for (const input of FUZZ) {
  const actual = toAreaDistrict(input);
  if (/\d[A-Z]{2}/i.test(actual)) {
    failed += 1;
    console.error(`FAIL  privacy invariant: ${JSON.stringify(input)} -> ${JSON.stringify(actual)} contains an inward code`);
  }
}

if (failed) {
  console.error(`\n${failed} assertion(s) failed — decision #6 is NOT holding. Do not ship.`);
  process.exit(1);
}

console.log(`toAreaDistrict: ${CASES.length + FUZZ.length}/${CASES.length + FUZZ.length} assertions passed (privacy invariant holds).`);
