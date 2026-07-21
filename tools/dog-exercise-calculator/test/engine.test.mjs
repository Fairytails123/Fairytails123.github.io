#!/usr/bin/env node
/* ===========================================================================
   Dog Walking Calculator — engine regression harness
   ---------------------------------------------------------------------------
   Run:  npm run test:dog-exercise-calculator
         (or: node tools/dog-exercise-calculator/test/engine.test.mjs)

   No test framework, by the same rule the Breed Matcher follows. Unlike the
   Breed Matcher's harness this one needs no DOM stub and no eval trickery:
   engine.js and data.js are pure ES modules with zero DOM access, so node can
   import them directly.

   Tests are written as INVARIANTS over the whole dataset wherever possible,
   rather than a handful of hard-coded breeds. A hard-coded expectation rots the
   moment someone re-tiers a breed; an invariant keeps testing the real contract.
   =========================================================================== */

import {
  BANDS,
  BAND_ORDER,
  BREEDS,
  RULES,
  calculate,
  calculatePuppy,
  calculateSenior,
  validate,
  normaliseInput,
  normaliseText,
  searchBreeds,
  searchBreedsWithMeta,
  hasNoMatches,
  getBreedBySlug,
  getBand,
  parseQuery,
  buildQuery,
  roundTo,
} from '../../../src/scripts/dog-exercise-calculator/engine.js';

/* ===========================================================================
   Minimal assertion kit
   =========================================================================== */

let passed = 0;
const failures = [];
let currentGroup = '';

function group(name) {
  currentGroup = name;
  console.log(`\n${name}`);
}

function check(label, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${label}`);
  } else {
    failures.push(`${currentGroup} > ${label}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function eq(label, actual, expected) {
  check(label, Object.is(actual, expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/** Run fn over every case; pass only if every case holds. Reports the first 3 failures. */
function forAll(label, cases, predicate) {
  const bad = [];
  for (const c of cases) {
    try {
      if (!predicate(c)) bad.push(c);
    } catch (err) {
      bad.push(`${JSON.stringify(c)} threw ${err.message}`);
    }
    if (bad.length >= 3) break;
  }
  check(label, bad.length === 0, bad.length ? `${bad.length}+ failing case(s), e.g. ${JSON.stringify(bad.slice(0, 3))}` : '');
}

/* ===========================================================================
   1. Dataset integrity
   =========================================================================== */

group('1. Dataset integrity');

check('dataset is a non-empty array', Array.isArray(BREEDS) && BREEDS.length > 0, `length ${BREEDS?.length}`);

const slugs = BREEDS.map((b) => b.slug);
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
check('every slug is unique', dupSlugs.length === 0, `duplicates: ${JSON.stringify([...new Set(dupSlugs)])}`);

const names = BREEDS.map((b) => b.name);
const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
check('every breed name is unique', dupNames.length === 0, `duplicates: ${JSON.stringify([...new Set(dupNames)])}`);

forAll('slugs are lowercase ASCII with hyphens only', BREEDS, (b) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.slug));

forAll('every breed has a known band', BREEDS, (b) => BAND_ORDER.includes(b.band));

forAll('every breed has required fields of the right type', BREEDS, (b) =>
  typeof b.name === 'string' && b.name.length > 0 &&
  typeof b.slug === 'string' &&
  typeof b.band === 'string' &&
  Array.isArray(b.aliases) &&
  typeof b.brachycephalic === 'boolean' &&
  typeof b.giantGrowth === 'boolean' &&
  typeof b.sighthound === 'boolean'
);

/* Aliases must be globally unambiguous: an alias that two breeds both claim
   silently gives the user the wrong dog's numbers (reference defect D-11). */
const aliasOwner = new Map();
const aliasClashes = [];
for (const breed of BREEDS) {
  for (const alias of breed.aliases) {
    const key = normaliseText(alias);
    if (aliasOwner.has(key)) aliasClashes.push(`"${alias}" claimed by ${aliasOwner.get(key)} and ${breed.name}`);
    else aliasOwner.set(key, breed.name);
  }
}
check('no alias is claimed by two breeds', aliasClashes.length === 0, JSON.stringify(aliasClashes.slice(0, 5)));

const canonical = new Set(BREEDS.map((b) => normaliseText(b.name)));
const aliasShadows = [];
for (const breed of BREEDS) {
  for (const alias of breed.aliases) {
    const key = normaliseText(alias);
    if (canonical.has(key) && normaliseText(breed.name) !== key) {
      aliasShadows.push(`${breed.name} claims "${alias}", which is another breed's real name`);
    }
  }
}
check('no alias shadows another breed’s real name', aliasShadows.length === 0, JSON.stringify(aliasShadows.slice(0, 5)));

forAll('aliases are stored lowercase', BREEDS, (b) => b.aliases.every((a) => a === a.toLowerCase()));

/* ===========================================================================
   2. Band integrity
   =========================================================================== */

group('2. Band integrity');

eq('there are four bands', BAND_ORDER.length, 4);

forAll('every band id in BAND_ORDER exists in BANDS', BAND_ORDER, (id) => Boolean(BANDS[id]));

forAll('every band has a sane range', BAND_ORDER, (id) => {
  const b = BANDS[id];
  return Number.isFinite(b.minMinutes) && Number.isFinite(b.maxMinutes) && b.minMinutes > 0 && b.maxMinutes > b.minMinutes;
});

/* The reference tool's bands leave a hole: low ends at 45, moderate starts at
   60, so no dog is ever told 50 minutes. Ours must tile with no gap. */
const gaps = [];
for (let i = 1; i < BAND_ORDER.length; i += 1) {
  const prev = BANDS[BAND_ORDER[i - 1]];
  const curr = BANDS[BAND_ORDER[i]];
  if (curr.minMinutes !== prev.maxMinutes) {
    gaps.push(`${BAND_ORDER[i - 1]} ends ${prev.maxMinutes} but ${BAND_ORDER[i]} starts ${curr.minMinutes}`);
  }
}
check('bands are continuous with no gap or overlap', gaps.length === 0, JSON.stringify(gaps));

const usedBands = new Set(BREEDS.map((b) => b.band));
forAll('every band is used by at least one breed', BAND_ORDER, (id) => usedBands.has(id));

/* ===========================================================================
   3. Search
   =========================================================================== */

group('3. Search');

eq('empty query returns nothing', searchBreeds('').length, 0);
eq('whitespace-only query returns nothing', searchBreeds('    ').length, 0);
eq('whitespace-only query is not reported as "no match"', hasNoMatches('   '), false);

forAll('searching a breed’s full name returns that breed first', BREEDS, (b) => {
  const results = searchBreeds(b.name);
  return results.length > 0 && results[0].slug === b.slug;
});

/* Reference defect D-08: typing the exact name "Bulldog" listed French Bulldog
   first, because matching was unranked. */
const substringPairs = [];
for (const a of BREEDS) {
  for (const b of BREEDS) {
    if (a.slug !== b.slug && normaliseText(b.name).includes(normaliseText(a.name))) {
      substringPairs.push(a);
      break;
    }
  }
}
check('found breed names that are substrings of others (to test ranking)', substringPairs.length > 0, `${substringPairs.length} such names`);
forAll('an exact name outranks longer names containing it', substringPairs, (b) => searchBreeds(b.name)[0].slug === b.slug);

forAll('every alias finds its own breed', BREEDS.flatMap((b) => b.aliases.map((a) => ({ alias: a, slug: b.slug, name: b.name }))), (c) => {
  const results = searchBreeds(c.alias);
  return results.some((r) => r.slug === c.slug);
});

forAll('search is case and punctuation insensitive', BREEDS, (b) => {
  const noisy = b.name.toUpperCase().replace(/ /g, '  ') + '!';
  return searchBreeds(noisy).some((r) => r.slug === b.slug);
});

const limited = searchBreedsWithMeta('a', 5);
check('the suggestion limit is respected', limited.results.length <= 5, `got ${limited.results.length}`);
check('total match count is reported for the overflow hint', limited.total >= limited.results.length, `total ${limited.total}, shown ${limited.results.length}`);

/* Reference defect D-14: "german shepard" (a very common misspelling) returned
   nothing at all. Build a typo for each breed by dropping one letter. */
const typoCases = BREEDS.filter((b) => b.name.replace(/[^a-z]/gi, '').length >= 6).map((b) => {
  const flat = normaliseText(b.name);
  const cut = Math.floor(flat.length / 2);
  return { slug: b.slug, typo: flat.slice(0, cut) + flat.slice(cut + 1), name: b.name };
});
forAll('a single-letter typo still finds the breed', typoCases, (c) => searchBreeds(c.typo).some((r) => r.slug === c.slug));

/* A substituted letter, not a dropped one: dropping a character can delete a
   space, which compact matching then resolves literally (rank 0) rather than
   fuzzily. Substitution guarantees the fuzzy path is the one under test. */
const substitutionCases = BREEDS.map((b) => {
  const flat = normaliseText(b.name).replace(/ /g, '');
  if (flat.length < 8) return null;
  const i = Math.floor(flat.length / 2);
  const replacement = flat[i] === 'q' ? 'w' : 'q'; // 'q' is rare in breed names
  return { slug: b.slug, typo: flat.slice(0, i) + replacement + flat.slice(i + 1), name: b.name };
}).filter(Boolean);

forAll('a single substituted letter still finds the breed', substitutionCases, (c) => searchBreeds(c.typo).some((r) => r.slug === c.slug));

const fuzzyProbe = searchBreedsWithMeta(substitutionCases[0].typo);
check('typo results are flagged as fuzzy so the UI can say "did you mean"', fuzzyProbe.isFuzzy === true, `probe "${substitutionCases[0].typo}" -> isFuzzy=${fuzzyProbe.isFuzzy}`);

const nonsense = searchBreedsWithMeta('qxzjvwkmp');
eq('genuine nonsense still returns nothing', nonsense.results.length, 0);
eq('genuine nonsense is reported as no match', hasNoMatches('qxzjvwkmp'), true);

/* ===========================================================================
   4. Validation
   =========================================================================== */

group('4. Validation');

const codesFor = (raw) => validate(normaliseInput(raw)).errors.map((e) => e.code);

check('breed mode with no breed is rejected', codesFor({ mode: 'breed', lifeStage: 'adult' }).includes('BREED_REQUIRED'));
check('breed mode with an unknown breed is rejected', codesFor({ mode: 'breed', breedSlug: 'not-a-real-dog', lifeStage: 'adult' }).includes('BREED_UNKNOWN'));
check('energy mode with no band is rejected', codesFor({ mode: 'energy', lifeStage: 'adult' }).includes('BAND_REQUIRED'));

const sample = BREEDS[0];
check('a valid adult input passes', validate(normaliseInput({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'adult' })).ok);

check('puppy with no age is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy' }).includes('PUPPY_MONTHS_REQUIRED'));
check('puppy age below the minimum is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy', puppyMonths: 0 }).includes('PUPPY_MONTHS_TOO_LOW'));
check('negative puppy age is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy', puppyMonths: -5 }).includes('PUPPY_MONTHS_TOO_LOW'));
check('puppy age above the maximum is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy', puppyMonths: 99 }).includes('PUPPY_MONTHS_TOO_HIGH'));
check('a huge puppy age is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy', puppyMonths: 1e3 }).includes('PUPPY_MONTHS_TOO_HIGH'));
check('non-numeric puppy age is rejected', codesFor({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'puppy', puppyMonths: 'abc' }).includes('PUPPY_MONTHS_NOT_A_NUMBER'));

check('calculate() throws rather than guessing on invalid input', (() => {
  try {
    calculate({ mode: 'breed', lifeStage: 'adult' });
    return false;
  } catch {
    return true;
  }
})());

/* ===========================================================================
   5. Calculations
   =========================================================================== */

group('5. Calculations');

const adultResult = calculate({ mode: 'breed', breedSlug: sample.slug, lifeStage: 'adult' });
eq('adult headline min equals the band min', adultResult.headline.minMinutes, BANDS[sample.band].minMinutes);
eq('adult headline max equals the band max', adultResult.headline.maxMinutes, BANDS[sample.band].maxMinutes);

const p6 = calculatePuppy(6, { minMinutes: 60, maxMinutes: 500 });
eq('puppy per-session is 5 minutes per month of age', p6.perSession, 30);
eq('puppy per-day is two sessions', p6.perDay, 60);
eq('puppy months are floored for display', calculatePuppy(4.5, { minMinutes: 60, maxMinutes: 500 }).months, 4);
eq('a non-integer age computes on the floored value', calculatePuppy(4.5, { minMinutes: 60, maxMinutes: 500 }).perSession, 20);

const capped = calculatePuppy(18, { minMinutes: 30, maxMinutes: 45 });
check('the puppy figure is capped at the adult maximum', capped.cappedAtAdult === true && capped.perDay === 45, JSON.stringify(capped));
eq('the uncapped figure is retained for the explanation', capped.uncappedPerDay, 180);

const uncapped = calculatePuppy(3, { minMinutes: 120, maxMinutes: 180 });
check('a young puppy of a high-need breed is not capped', uncapped.cappedAtAdult === false && uncapped.perDay === 30, JSON.stringify(uncapped));

const senior = calculateSenior({ minMinutes: 60, maxMinutes: 80 });
check('senior minutes are reduced from the adult figure', senior.minMinutes < 60 && senior.maxMinutes < 80, JSON.stringify(senior));
check('senior keeps a sane spread', senior.maxMinutes > senior.minMinutes, JSON.stringify(senior));
check('senior is split into more sessions than an adult', senior.sessionsPerDay > RULES.adult.sessionsPerDay);

forAll('senior minutes never fall below the floor', BAND_ORDER, (id) => calculateSenior(BANDS[id]).minMinutes >= RULES.senior.minimumMinutes);

eq('roundTo rounds to the nearest step', roundTo(43, 5), 45);
eq('roundTo handles exact multiples', roundTo(60, 5), 60);

/* ===========================================================================
   6. Exhaustive invariants — every breed, every stage, every legal age
   =========================================================================== */

group('6. Exhaustive invariants (every breed x stage x age)');

const exhaustive = [];
for (const breed of BREEDS) {
  exhaustive.push({ mode: 'breed', breedSlug: breed.slug, lifeStage: 'adult' });
  exhaustive.push({ mode: 'breed', breedSlug: breed.slug, lifeStage: 'senior' });
  for (let m = RULES.puppy.minMonths; m <= RULES.puppy.maxMonths; m += 1) {
    exhaustive.push({ mode: 'breed', breedSlug: breed.slug, lifeStage: 'puppy', puppyMonths: m });
  }
}
for (const id of BAND_ORDER) {
  exhaustive.push({ mode: 'energy', bandId: id, lifeStage: 'adult' });
  exhaustive.push({ mode: 'energy', bandId: id, lifeStage: 'senior' });
  for (let m = RULES.puppy.minMonths; m <= RULES.puppy.maxMonths; m += 1) {
    exhaustive.push({ mode: 'energy', bandId: id, lifeStage: 'puppy', puppyMonths: m });
  }
}
console.log(`  (${exhaustive.length} combinations)`);

forAll('every combination validates and calculates without throwing', exhaustive, (input) => {
  const r = calculate(input);
  return Boolean(r && r.headline);
});

forAll('headline min never exceeds max', exhaustive, (input) => {
  const r = calculate(input);
  return r.headline.minMinutes <= r.headline.maxMinutes;
});

forAll('headline minutes are always positive', exhaustive, (input) => calculate(input).headline.minMinutes > 0);

forAll('headline minutes are always whole numbers', exhaustive, (input) => {
  const r = calculate(input);
  return Number.isInteger(r.headline.minMinutes) && Number.isInteger(r.headline.maxMinutes);
});

forAll('no result ever produces NaN', exhaustive, (input) => {
  const r = calculate(input);
  return Number.isFinite(r.headline.minMinutes) && Number.isFinite(r.headline.maxMinutes);
});

forAll('a puppy is never told to do more than an adult of the same breed', exhaustive.filter((i) => i.lifeStage === 'puppy'), (input) => {
  const r = calculate(input);
  return r.headline.maxMinutes <= r.adultBaseline.maxMinutes;
});

forAll('a senior is never told to do more than an adult of the same breed', exhaustive.filter((i) => i.lifeStage === 'senior'), (input) => {
  const r = calculate(input);
  return r.headline.maxMinutes <= r.adultBaseline.maxMinutes;
});

forAll('every caution id has copy defined', exhaustive, (input) => calculate(input).cautions.every((c) => c.id && typeof c.id === 'string'));

/* Flag-driven cautions must actually fire. */
const brachyBreeds = BREEDS.filter((b) => b.brachycephalic);
check('the dataset contains flat-faced breeds', brachyBreeds.length > 0, `${brachyBreeds.length} found`);
forAll('flat-faced breeds always raise the breathing caution', brachyBreeds, (b) =>
  calculate({ mode: 'breed', breedSlug: b.slug, lifeStage: 'adult' }).cautions.some((c) => c.id === 'brachycephalic-breathing')
);

const giantBreeds = BREEDS.filter((b) => b.giantGrowth);
check('the dataset contains slow-growing large breeds', giantBreeds.length > 0, `${giantBreeds.length} found`);
forAll('slow-growing breeds raise the growth caution as puppies', giantBreeds, (b) =>
  calculate({ mode: 'breed', breedSlug: b.slug, lifeStage: 'puppy', puppyMonths: 6 }).cautions.some((c) => c.id === 'puppy-giant-growth')
);
forAll('the growth caution does not fire for adults', giantBreeds, (b) =>
  !calculate({ mode: 'breed', breedSlug: b.slug, lifeStage: 'adult' }).cautions.some((c) => c.id === 'puppy-giant-growth')
);

/* ===========================================================================
   7. Mode isolation (reference defects D-02 / D-03)
   =========================================================================== */

group('7. Mode isolation');

const workingBreed = BREEDS.find((b) => b.band === 'working');
const lowBand = 'low';

if (workingBreed) {
  const asEnergy = calculate({ mode: 'energy', bandId: lowBand, breedSlug: workingBreed.slug, lifeStage: 'adult' });
  eq('in energy mode the chosen band wins, not a retained breed', asEnergy.band.id, lowBand);
  eq('in energy mode no breed is attached to the result', asEnergy.breed, null);

  const asBreed = calculate({ mode: 'breed', bandId: lowBand, breedSlug: workingBreed.slug, lifeStage: 'adult' });
  eq('in breed mode the breed’s own band wins, not a retained card choice', asBreed.band.id, workingBreed.band);
} else {
  check('a working-band breed exists to test mode isolation', false, 'none found');
}

/* ===========================================================================
   8. Deep links
   =========================================================================== */

group('8. Deep links');

const dl = parseQuery(`?breed=${sample.slug}&stage=puppy&months=6`);
eq('deep link sets the breed', dl.breedSlug, sample.slug);
eq('deep link sets the mode', dl.mode, 'breed');
eq('deep link sets the stage', dl.lifeStage, 'puppy');
eq('deep link sets the age', dl.puppyMonths, 6);

eq('deep link accepts a human-typed breed name', parseQuery(`?breed=${encodeURIComponent(sample.name)}`).breedSlug, sample.slug);
eq('deep link ignores an unknown breed', parseQuery('?breed=not-a-real-dog').breedSlug, undefined);
eq('deep link ignores an unknown stage', parseQuery('?stage=elderly').lifeStage, undefined);
eq('deep link ignores an unknown energy band', parseQuery('?energy=turbo').bandId, undefined);
eq('deep link clamps an out-of-range age', parseQuery('?months=999').puppyMonths, RULES.puppy.maxMonths);
eq('deep link clamps a negative age', parseQuery('?months=-4').puppyMonths, RULES.puppy.minMonths);
check('a malformed query string does not throw', (() => { try { parseQuery('?%%%'); return true; } catch { return false; } })());
eq('an empty query string yields no prefill', Object.keys(parseQuery('')).length, 0);

const roundTrip = { mode: 'breed', breedSlug: sample.slug, bandId: null, lifeStage: 'puppy', puppyMonths: 7 };
const rebuilt = parseQuery(buildQuery(roundTrip));
check('a built query round-trips', rebuilt.breedSlug === sample.slug && rebuilt.lifeStage === 'puppy' && rebuilt.puppyMonths === 7, JSON.stringify(rebuilt));

const energyRoundTrip = parseQuery(buildQuery({ mode: 'energy', breedSlug: null, bandId: 'high', lifeStage: 'adult', puppyMonths: null }));
eq('an energy-mode query round-trips', energyRoundTrip.bandId, 'high');

/* ===========================================================================
   Summary
   =========================================================================== */

console.log(`\n${'='.repeat(70)}`);
if (failures.length === 0) {
  console.log(`ALL PASS — ${passed} assertions, ${BREEDS.length} breeds, ${exhaustive.length} calculated combinations.`);
  process.exit(0);
} else {
  console.log(`${failures.length} FAILURE(S) out of ${passed + failures.length} assertions:\n`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
