#!/usr/bin/env node
/* =====================================================================
   Breed Matcher — engine regression harness (no framework, per brief §13)

   Loads ../../public/breed-matcher/index.html, stubs the DOM, evaluates
   the inline <script>, then asserts the §6.6 "verified behaviour" plus
   structural invariants that must hold for EVERY breed.

   Run:  npm run test:breed-matcher
         (or)  node tools/breed-matcher/test/engine.test.mjs

   Gotchas this harness deliberately handles (see brief §13):
   - Extract the script with lastIndexOf('<script>') — a CSS comment could
     contain the literal "<script>" and break a naive split.
   - Strip the boot call renderIntro(); so nothing renders under the stub.
   - Use indirect eval (0,eval) and put the assertions INSIDE the evaluated
     string — eval'd `const`s (BREEDS, scoreBreed) don't leak to module scope.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const TOOL = join(here, '..', '..', '..', 'public', 'breed-matcher', 'index.html');

const html = readFileSync(TOOL, 'utf8');

// --- extract the inline script (lastIndexOf guards the CSS-comment gotcha) ---
const open = html.lastIndexOf('<script>');
const close = html.lastIndexOf('</script>');
if (open < 0 || close < 0) {
  console.error('Could not locate the <script> block in', TOOL);
  process.exit(2);
}
let js = html.substring(open + '<script>'.length, close);
js = js.replace('renderIntro();', ''); // don't boot the UI under the DOM stub

// --- DOM / browser stubs (just enough for the script to evaluate) ---
globalThis.document = {
  getElementById: () => ({ innerHTML: '', classList: { add() {}, remove() {} }, offsetWidth: 0 }),
  querySelector: () => ({ innerHTML: '' }),
  querySelectorAll: () => [],
};
globalThis.window = { scrollTo() {} };
globalThis.requestAnimationFrame = (f) => f();
globalThis.setTimeout = (f) => f();

// --- reporter (referenced by bare name from inside the eval'd string) ---
let failures = 0;
const results = [];
globalThis.report = (name, cond, detail = '') => {
  results.push([!!cond, name, detail]);
  if (!cond) failures++;
};

// --- assertions live in the SAME eval string so they see BREEDS/scoreBreed ---
const tests = `
;(function () {
  const find = (n) => {
    const b = BREEDS.find((x) => x.name === n);
    if (!b) throw new Error('breed not found in dataset: ' + n);
    return b;
  };
  // a neutral, fully-specified baseline answer set
  const baseA = {
    home: 'smallGarden', access: 'natureNearby', exercise: 'active', alone: 'rarely',
    experience: 'some', grooming: 'professional', coat: 'sheddingFine',
    household: ['adultsOnly'], sizePref: 'any', barking: 'fine',
  };

  // 1. Great Dane in a flat -> hard-no, base 36, no lift
  const gd = scoreBreed(find('Great Dane'), {
    ...baseA, home: 'flat', access: 'parksOnly', exercise: 'gentle', sizePref: 'any',
  });
  report('Great Dane / flat is a hard-no', !!gd.hardNo);
  report('Great Dane / flat base == 36', gd.base === 36, 'got ' + gd.base);
  report('Great Dane / flat supported == base (no lift)', gd.supported === gd.base, 'got ' + gd.supported);
  report('Great Dane / flat lift == 0', gd.lift === 0, 'got ' + gd.lift);

  // 2. Border Collie dramatic bridge: flat + parks + first-timer + most-day + gentle -> 14 -> 75
  const bc = scoreBreed(find('Border Collie'), {
    home: 'flat', access: 'parksOnly', exercise: 'gentle', alone: 'mostDay', experience: 'first',
    grooming: 'minimal', coat: 'sheddingFine', household: ['adultsOnly'], sizePref: 'any', barking: 'some',
  });
  report('Border Collie dramatic base == 14', bc.base === 14, 'got ' + bc.base);
  report('Border Collie dramatic supported == 75', bc.supported === 75, 'got ' + bc.supported);
  report('Border Collie dramatic is not a hard-no', !bc.hardNo);
  report('Border Collie dramatic shows a big lift', bc.lift >= 40, 'got ' + bc.lift);

  // 3. Rottweiler + toddler -> strong steer, recovers, capped <= 92, NOT a hard-no
  const rw = scoreBreed(find('Rottweiler'), {
    home: 'largeGarden', access: 'privateLand', exercise: 'active', alone: 'rarely', experience: 'expert',
    grooming: 'professional', coat: 'sheddingFine', household: ['youngKids'], sizePref: 'large', barking: 'fine',
  });
  report('Rottweiler + toddler raises a strong steer', !!rw.steer);
  report('Rottweiler + toddler is not a hard-no', !rw.hardNo);
  report('Rottweiler + toddler supported <= 92', rw.supported <= 92, 'got ' + rw.supported);
  report('Rottweiler + toddler recovers (supported >= base)', rw.supported >= rw.base);

  // 4. Allergy: hard-no ONLY on non-low-allergen coats
  const lab = scoreBreed(find('Labrador Retriever'), { ...baseA, coat: 'needHypoallergenic' });
  report('Labrador / allergy home is a hard-no', !!lab.hardNo);
  const poodle = scoreBreed(find('Standard Poodle'), { ...baseA, coat: 'needHypoallergenic' });
  report('Standard Poodle / allergy home is NOT a hard-no', !poodle.hardNo);

  // 5. Global invariants across EVERY breed x a few answer sets
  const sets = [
    baseA,
    { home: 'flat', access: 'parksOnly', exercise: 'gentle', alone: 'mostDay', experience: 'first',
      grooming: 'minimal', coat: 'preferLowShed', household: ['youngKids', 'otherPets'], sizePref: 'small', barking: 'quiet' },
    { home: 'largeGarden', access: 'privateLand', exercise: 'working', alone: 'rarely', experience: 'expert',
      grooming: 'professional', coat: 'needHypoallergenic', household: ['adultsOnly'], sizePref: 'large', barking: 'fine' },
  ];
  let invOk = true, invDetail = '';
  for (const a of sets) {
    for (const b of BREEDS) {
      const r = scoreBreed(b, a);
      if (!(r.base >= 5 && r.base <= 97)) { invOk = false; invDetail = b.name + ' base ' + r.base; break; }
      // The honesty cap bounds the LIFT, not an already-excellent honest score:
      // a lift never pushes a bridgeable score above 92 (when base>92 there's no lift).
      if (!(r.lift === 0 || r.supported <= 92)) { invOk = false; invDetail = b.name + ' lift>0 but supported ' + r.supported; break; }
      if (!(r.supported >= r.base)) { invOk = false; invDetail = b.name + ' supported < base'; break; }
      if (r.hardNo && !(r.supported === r.base && r.lift === 0)) { invOk = false; invDetail = b.name + ' hard-no has a lift'; break; }
    }
    if (!invOk) break;
  }
  report('Invariants hold for all breeds x answer sets (base 5..97; lift never exceeds the 92 cap; supported >= base; hard-no has no lift)', invOk, invDetail);

  // 6. Dataset sanity: the documented count + no malformed rows
  report('Dataset has 96 breeds', BREEDS.length === 96, 'got ' + BREEDS.length);
  const badRows = BREEDS.filter((b) =>
    !b.name || !b.group ||
    [b.size, b.energy, b.spaceNeed, b.aloneTol, b.novice, b.groom, b.shed, b.kids, b.guard, b.bark, b.train]
      .some((n) => typeof n !== 'number' || n < 1 || n > 5) ||
    typeof b.lowAllergen !== 'boolean');
  report('Every breed row is well-formed (1..5 scales, boolean lowAllergen)', badRows.length === 0,
    badRows.map((b) => b.name).join(', '));
})();
`;

// indirect eval: global (sloppy) scope; eval'd consts shared with the appended tests
(0, eval)(js + tests);

// --- report ---
for (const [ok, name, detail] of results) {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? '  — ' + detail : ''}`);
}
console.log(`\n${results.length} checks — ${failures} failure${failures === 1 ? '' : 's'}.`);
process.exit(failures > 0 ? 1 : 0);
