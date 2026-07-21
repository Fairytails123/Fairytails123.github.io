/* ===========================================================================
   Dog Walking Calculator — CALCULATION ENGINE
   ---------------------------------------------------------------------------
   PURE LOGIC. This module must never touch the DOM, `window`, `document`,
   timers, or the network. Everything it needs arrives as arguments or comes
   from `data.js`. That is what makes it testable in plain node and safe to
   restyle without fear.

   Public API
     normaliseInput(raw)        -> Input          (coerce loose values)
     validate(input)            -> {ok, errors[]}
     calculate(input)           -> Result         (throws on invalid input)
     searchBreeds(query, limit) -> Breed[]
     getBreedBySlug(slug)       -> Breed | null
     getBand(bandId)            -> Band  | null
     parseQuery(searchString)   -> Partial<Input> (for ?breed= deep links)

   British English throughout.
   =========================================================================== */

import { BANDS, BAND_ORDER, BREEDS, RULES } from './data.js';

/* ---------------------------------------------------------------------------
   Types (JSDoc only — no build step, no TypeScript)
   ---------------------------------------------------------------------------
   @typedef {'breed'|'energy'} Mode
   @typedef {'puppy'|'adult'|'senior'} LifeStage
   @typedef {'low'|'moderate'|'high'|'working'} BandId

   @typedef {Object} Input
   @property {Mode} mode
   @property {string|null} breedSlug
   @property {BandId|null} bandId
   @property {LifeStage} lifeStage
   @property {number|null} puppyMonths
   --------------------------------------------------------------------------- */

export const MODES = /** @type {const} */ (['breed', 'energy']);
export const LIFE_STAGES = /** @type {const} */ (['puppy', 'adult', 'senior']);

/* ===========================================================================
   Lookup indexes — built once at module load
   =========================================================================== */

const BREEDS_BY_SLUG = new Map(BREEDS.map((b) => [b.slug, b]));

/**
 * Normalise a string for searching: lowercase, strip diacritics and any
 * character that is not a letter, digit or space, then collapse whitespace.
 * "Hungarian Puli" -> "hungarian puli"; "Shih-Tzu!" -> "shih tzu".
 * @param {unknown} value
 * @returns {string}
 */
export function normaliseText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // strip combining marks so "Lowchen" finds the accented name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Strip everything but letters and digits: "Shih Tzu" -> "shihtzu".
 * Lets no-space and hyphenated spellings match without needing an alias each
 * ("shihtzu", "bordercollie", "shar-pei", "flat-coat").
 * @param {unknown} value
 * @returns {string}
 */
export function compactText(value) {
  return normaliseText(value).replace(/ /g, '');
}

/**
 * Words people attach to a breed name that carry no identifying information.
 * Stripping them means "pug dog", "lab puppy" and "collie cross" all work
 * without a combinatorial explosion of aliases.
 */
const FILLER_WORDS = new Set([
  'dog', 'dogs', 'doggy', 'puppy', 'puppies', 'pup', 'pups',
  'cross', 'crossed', 'crossbreed', 'x', 'mix', 'mixed',
  'breed', 'breeds', 'type', 'rescue', 'my', 'a', 'an', 'the',
]);

/**
 * Singular forms of the last word of a query. Returns every plausible
 * candidate rather than guessing, because English plurals are irregular:
 * "collies" -> "collie", but "staffies" -> "staffy".
 * @param {string} phrase normalised
 * @returns {string[]}
 */
function singularForms(phrase) {
  const parts = phrase.split(' ');
  const last = parts[parts.length - 1];
  if (!last || last.length < 3) return [];

  const stems = [];
  if (/ies$/.test(last)) {
    stems.push(`${last.slice(0, -3)}ie`); // collies -> collie
    stems.push(`${last.slice(0, -3)}y`); // staffies -> staffy
  } else if (/(ch|sh|ss|x|z)es$/.test(last)) {
    stems.push(last.slice(0, -2)); // boxes -> box
  } else if (/[^s]s$/.test(last)) {
    stems.push(last.slice(0, -1)); // boxers -> boxer
  }

  return stems
    .filter((stem) => stem.length >= 2 && stem !== last)
    .map((stem) => [...parts.slice(0, -1), stem].join(' '));
}

/**
 * Every form of a query worth trying, best-known first.
 * @param {string} raw
 * @returns {string[]}
 */
function queryVariants(raw) {
  const base = normaliseText(raw);
  if (!base) return [];

  const variants = new Set([base]);

  const tokens = base.split(' ').filter(Boolean);
  const meaningful = tokens.filter((t) => !FILLER_WORDS.has(t));
  if (meaningful.length && meaningful.length !== tokens.length) {
    variants.add(meaningful.join(' '));
  }

  for (const v of [...variants]) {
    for (const s of singularForms(v)) variants.add(s);
  }

  return [...variants].filter(Boolean);
}

/** Pre-computed haystack per breed so search does no work per keystroke. */
const SEARCH_INDEX = BREEDS.map((breed) => {
  const name = normaliseText(breed.name);
  const aliases = (breed.aliases || []).map(normaliseText);
  return {
    breed,
    name,
    aliases,
    words: name.split(' ').filter(Boolean),
    compactName: name.replace(/ /g, ''),
    compactAliases: aliases.map((a) => a.replace(/ /g, '')),
  };
});

/* ===========================================================================
   Small numeric helpers
   =========================================================================== */

/**
 * Round to the nearest `step` (default 5) so users see natural figures
 * like "45 minutes" rather than "43 minutes".
 * @param {number} value
 * @param {number} [step]
 * @returns {number}
 */
export function roundTo(value, step = RULES.rounding.step) {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(step) || step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ===========================================================================
   Lookups
   =========================================================================== */

/**
 * @param {string|null|undefined} slug
 * @returns {object|null}
 */
export function getBreedBySlug(slug) {
  if (typeof slug !== 'string') return null;
  return BREEDS_BY_SLUG.get(slug.trim().toLowerCase()) || null;
}

/**
 * @param {string|null|undefined} bandId
 * @returns {object|null}
 */
export function getBand(bandId) {
  if (typeof bandId !== 'string') return null;
  return Object.prototype.hasOwnProperty.call(BANDS, bandId) ? BANDS[bandId] : null;
}

/* ===========================================================================
   Breed search
   ===========================================================================
   Matching is a case- and punctuation-insensitive substring test over the
   breed name AND its aliases, which is what every comparable tool does and
   what users expect ("staffy", "sausage dog", "gsd").

   Results are RANKED rather than returned in dataset order, because dataset
   order makes "lab" surface "Labradoodle" above "Labrador Retriever". Ranking:
     0  exact name match
     1  name starts with the query
     2  a word inside the name starts with the query
     3  exact alias match
     4  an alias starts with the query
     5  substring anywhere in the name
     6  substring anywhere in an alias
   Ties break alphabetically so the order is stable and deterministic.
   =========================================================================== */

/**
 * Rank one query variant against one breed. Lower is better.
 *
 * An EXACT ALIAS deliberately outranks "a word inside the name starts with the
 * query". That ordering is what makes family defaults work: "poodle" is an
 * exact alias of Standard Poodle, so it beats Miniature Poodle and Toy Poodle,
 * whose names merely contain the word. Same for "collie" (Border), "dachshund"
 * (Standard), "schnauzer" (Standard), "cocker" (English) and "king charles"
 * (Cavalier, which is what UK owners overwhelmingly mean).
 *
 * @param {object} entry SEARCH_INDEX row
 * @param {string} q normalised query variant
 * @returns {number} rank, or Infinity for no match
 */
function rankMatch(entry, q) {
  const qc = q.replace(/ /g, '');

  if (entry.name === q || entry.compactName === qc) return 0;
  if (entry.aliases.includes(q) || entry.compactAliases.includes(qc)) return 1;
  if (entry.name.startsWith(q) || entry.compactName.startsWith(qc)) return 2;
  if (entry.aliases.some((a) => a.startsWith(q))) return 3;
  if (entry.words.some((word) => word.startsWith(q))) return 4;
  if (entry.name.includes(q) || entry.compactName.includes(qc)) return 5;
  if (entry.aliases.some((a) => a.includes(q)) || entry.compactAliases.some((a) => a.includes(qc))) return 6;
  return Infinity;
}

/**
 * Best rank for a breed across every variant of the query.
 * @param {object} entry
 * @param {string[]} variants
 * @returns {number}
 */
function bestRank(entry, variants) {
  let best = Infinity;
  for (const v of variants) {
    const r = rankMatch(entry, v);
    if (r < best) best = r;
    if (best === 0) break;
  }
  return best;
}

/**
 * Levenshtein edit distance, capped for speed. Used only for typo tolerance
 * when a literal search finds nothing.
 * @param {string} a
 * @param {string} b
 * @param {number} max stop early once the distance provably exceeds this
 * @returns {number} the distance, or max + 1 when it exceeds the cap
 */
function editDistance(a, b, max) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    let rowBest = curr[0];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (curr[j] < rowBest) rowBest = curr[j];
    }
    if (rowBest > max) return max + 1;
    const swap = prev;
    prev = curr;
    curr = swap;
  }
  return prev[b.length];
}

/** Typo budget scales with word length: "lab" tolerates less than "rottweiler". */
function typoBudget(length) {
  if (length <= 4) return 1;
  if (length <= 8) return 2;
  return 3;
}

/**
 * Fuzzy fallback. Compares the query against each breed name, each individual
 * word of the name, and each alias, keeping the best distance per breed.
 * Deliberately only used when the literal search returns nothing, so it can
 * never push an exact match down the list.
 * @param {string} q normalised query
 * @returns {{breed: object, distance: number}[]}
 */
function fuzzyMatches(q) {
  const budget = typoBudget(q.length);
  const qc = q.replace(/ /g, '');
  const out = [];

  for (const entry of SEARCH_INDEX) {
    // Compare the spaced query against spaced forms and the compact query
    // against compact forms. Mixing them would spend the whole edit budget on
    // missing spaces: "cavalierkingcqarlesspaniel" is one typo away from the
    // compact name but four away from "cavalier king charles spaniel".
    let best = Infinity;

    for (const candidate of [entry.name, ...entry.words, ...entry.aliases]) {
      if (!candidate) continue;
      const d = editDistance(q, candidate, budget);
      if (d < best) best = d;
      if (best === 0) break;
    }

    if (best !== 0) {
      for (const candidate of [entry.compactName, ...entry.compactAliases]) {
        if (!candidate) continue;
        const d = editDistance(qc, candidate, budget);
        if (d < best) best = d;
        if (best === 0) break;
      }
    }

    if (best <= budget) out.push({ breed: entry.breed, distance: best });
  }

  out.sort((a, b) => (a.distance !== b.distance ? a.distance - b.distance : a.breed.name.localeCompare(b.breed.name, 'en-GB')));
  return out;
}

/**
 * Rank every literal (substring) match across all variants of a query.
 * @param {string[]} variants
 * @returns {object[]} breeds, best first
 */
function literalMatches(variants) {
  const hits = [];
  for (const entry of SEARCH_INDEX) {
    const rank = bestRank(entry, variants);
    if (rank !== Infinity) hits.push({ rank, breed: entry.breed });
  }
  hits.sort((a, b) => (a.rank !== b.rank ? a.rank - b.rank : a.breed.name.localeCompare(b.breed.name, 'en-GB')));
  return hits.map((h) => h.breed);
}

/**
 * Search breeds by name or alias, with metadata the UI needs.
 *
 * An empty or whitespace-only query returns nothing — we never dump the whole
 * list into an autocomplete panel.
 *
 * `total` is the number of matches BEFORE the limit, so the UI can say
 * "showing 8 of 36" rather than silently truncating.
 *
 * `isFuzzy` is true when nothing matched literally and these are typo-tolerant
 * suggestions instead, so the UI can label them "did you mean".
 *
 * @param {string} query
 * @param {number} [limit]
 * @returns {{results: object[], total: number, isFuzzy: boolean}}
 */
export function searchBreedsWithMeta(query, limit = RULES.search.maxSuggestions) {
  const variants = queryVariants(query);
  const max = Number.isFinite(limit) && limit > 0 ? limit : RULES.search.maxSuggestions;

  if (!variants.length) return { results: [], total: 0, isFuzzy: false };

  const literal = literalMatches(variants);
  if (literal.length) {
    return { results: literal.slice(0, max), total: literal.length, isFuzzy: false };
  }

  // Nothing matched literally. Only attempt typo correction on a query long
  // enough for the distance to mean anything — "lab" is not a misspelling.
  const longest = variants.reduce((a, b) => (b.length > a.length ? b : a), '');
  if (longest.length < RULES.search.minFuzzyLength) {
    return { results: [], total: 0, isFuzzy: false };
  }

  const fuzzy = fuzzyMatches(longest);
  return { results: fuzzy.slice(0, max).map((f) => f.breed), total: fuzzy.length, isFuzzy: fuzzy.length > 0 };
}

/**
 * Convenience wrapper returning just the breeds.
 * @param {string} query
 * @param {number} [limit]
 * @returns {object[]}
 */
export function searchBreeds(query, limit = RULES.search.maxSuggestions) {
  return searchBreedsWithMeta(query, limit).results;
}

/**
 * True when the query finds nothing at all, not even a typo-tolerant
 * suggestion — drives the "we don't have that one" helper message.
 * @param {string} query
 * @returns {boolean}
 */
export function hasNoMatches(query) {
  return normaliseText(query) !== '' && searchBreedsWithMeta(query, 1).results.length === 0;
}

/* ===========================================================================
   Input normalisation
   ===========================================================================
   Accepts loose values (from query strings, form fields, old saved state) and
   coerces them into the canonical Input shape WITHOUT deciding validity.
   Anything unrecognised becomes null so `validate` can report it precisely.
   =========================================================================== */

/**
 * @param {Record<string, unknown>} raw
 * @returns {Input}
 */
export function normaliseInput(raw = {}) {
  const mode = MODES.includes(/** @type {any} */ (raw.mode)) ? /** @type {Mode} */ (raw.mode) : 'breed';
  const lifeStage = LIFE_STAGES.includes(/** @type {any} */ (raw.lifeStage))
    ? /** @type {LifeStage} */ (raw.lifeStage)
    : 'adult';

  const breedSlug = typeof raw.breedSlug === 'string' && raw.breedSlug.trim() ? raw.breedSlug.trim().toLowerCase() : null;
  const bandId = typeof raw.bandId === 'string' && getBand(raw.bandId) ? raw.bandId : null;

  let puppyMonths = null;
  if (raw.puppyMonths !== null && raw.puppyMonths !== undefined && String(raw.puppyMonths).trim() !== '') {
    const parsed = Number(raw.puppyMonths);
    // NaN is preserved deliberately: validate() must be able to tell
    // "they typed nonsense" apart from "they left it blank".
    puppyMonths = Number.isNaN(parsed) ? NaN : parsed;
  }

  return { mode, breedSlug, bandId, lifeStage, puppyMonths };
}

/* ===========================================================================
   Validation
   =========================================================================== */

/**
 * @typedef {Object} ValidationError
 * @property {string} field
 * @property {string} code
 * @property {string} message
 */

/**
 * Validate a normalised Input. Returns every problem found, not just the first,
 * so the UI can mark up several fields at once.
 * @param {Input} input
 * @returns {{ok: boolean, errors: ValidationError[]}}
 */
export function validate(input) {
  /** @type {ValidationError[]} */
  const errors = [];
  const { minMonths, maxMonths } = RULES.puppy;

  if (!MODES.includes(input.mode)) {
    errors.push({ field: 'mode', code: 'MODE_INVALID', message: 'Choose whether to search by breed or pick an energy level.' });
  }

  if (input.mode === 'breed') {
    if (!input.breedSlug) {
      errors.push({ field: 'breed', code: 'BREED_REQUIRED', message: 'Pick a breed from the list to carry on.' });
    } else if (!getBreedBySlug(input.breedSlug)) {
      errors.push({ field: 'breed', code: 'BREED_UNKNOWN', message: 'We do not recognise that breed. Try searching again.' });
    }
  } else if (input.mode === 'energy') {
    if (!input.bandId) {
      errors.push({ field: 'band', code: 'BAND_REQUIRED', message: 'Choose the energy level that best describes your dog.' });
    } else if (!getBand(input.bandId)) {
      errors.push({ field: 'band', code: 'BAND_UNKNOWN', message: 'That energy level is not one we recognise.' });
    }
  }

  if (!LIFE_STAGES.includes(input.lifeStage)) {
    errors.push({ field: 'lifeStage', code: 'STAGE_INVALID', message: 'Choose a life stage: puppy, adult or senior.' });
  }

  if (input.lifeStage === 'puppy') {
    const m = input.puppyMonths;
    if (m === null || m === undefined) {
      errors.push({ field: 'puppyMonths', code: 'PUPPY_MONTHS_REQUIRED', message: 'Tell us how old your puppy is in months.' });
    } else if (!Number.isFinite(m)) {
      errors.push({ field: 'puppyMonths', code: 'PUPPY_MONTHS_NOT_A_NUMBER', message: 'Enter your puppy’s age as a number of months.' });
    } else if (m < minMonths) {
      errors.push({
        field: 'puppyMonths',
        code: 'PUPPY_MONTHS_TOO_LOW',
        message: `Enter an age of ${minMonths} months or more. Puppies younger than that should still be with their mother and litter.`,
      });
    } else if (m > maxMonths) {
      errors.push({
        field: 'puppyMonths',
        code: 'PUPPY_MONTHS_TOO_HIGH',
        message: `Enter an age up to ${maxMonths} months. Older than that, switch to Adult.`,
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

/* ===========================================================================
   Cautions
   ===========================================================================
   Advisory notes attached to a result. Each has a stable id so the UI can
   style or suppress individual ones, and so tests can assert on them without
   depending on wording.
   =========================================================================== */

/**
 * @param {object|null} breed
 * @param {object} band
 * @param {LifeStage} lifeStage
 * @param {{cappedAtAdult: boolean}} flags
 * @returns {{id:string, severity:'info'|'important', appliesTo:string}[]}
 */
function buildCautions(breed, band, lifeStage, flags) {
  const out = [];

  if (lifeStage === 'puppy') {
    out.push({ id: 'puppy-growing-joints', severity: 'important', appliesTo: 'puppy' });
    if (breed && breed.giantGrowth) out.push({ id: 'puppy-giant-growth', severity: 'important', appliesTo: 'puppy' });
    if (flags.cappedAtAdult) out.push({ id: 'puppy-reached-adult-level', severity: 'info', appliesTo: 'puppy' });
  }

  if (lifeStage === 'senior') {
    out.push({ id: 'senior-little-and-often', severity: 'info', appliesTo: 'senior' });
    out.push({ id: 'senior-vet-check', severity: 'important', appliesTo: 'senior' });
  }

  if (breed && breed.brachycephalic) {
    out.push({ id: 'brachycephalic-breathing', severity: 'important', appliesTo: 'breed' });
  }

  if (breed && breed.sighthound) {
    out.push({ id: 'sighthound-sprints', severity: 'info', appliesTo: 'breed' });
  }

  if (band.id === 'working') {
    out.push({ id: 'working-needs-a-job', severity: 'important', appliesTo: 'band' });
  }

  return out;
}

/* ===========================================================================
   Stage calculations
   =========================================================================== */

/**
 * Puppy: the widely used "five minutes of formal exercise per month of age,
 * up to twice a day" rule of thumb.
 *
 * Two deliberate corrections over the reference tool:
 *   1. The figure is CAPPED at the adult maximum. Without the cap an
 *      18-month "puppy" of a low-energy breed is told 180 minutes a day —
 *      four times what the same adult dog needs.
 *   2. The result is the HEADLINE, not a footnote under an adult range that
 *      does not apply yet.
 *
 * @param {number} months
 * @param {{minMinutes:number, maxMinutes:number}} adult
 * @returns {{perSession:number, sessionsPerDay:number, perDay:number, cappedAtAdult:boolean, uncappedPerDay:number}}
 */
export function calculatePuppy(months, adult) {
  const { minutesPerMonthOfAge, sessionsPerDay, capAtAdultMax } = RULES.puppy;
  const wholeMonths = Math.floor(months);

  const perSession = minutesPerMonthOfAge * wholeMonths;
  const uncappedPerDay = perSession * sessionsPerDay;

  let perDay = uncappedPerDay;
  let cappedAtAdult = false;
  if (capAtAdultMax && uncappedPerDay > adult.maxMinutes) {
    perDay = adult.maxMinutes;
    cappedAtAdult = true;
  }

  // `months` is the floored value actually used. The UI must display THIS, not
  // the raw input: the reference tool prints "At 4.5 months old ... 20 minutes",
  // showing an age it did not compute with.
  return { months: wholeMonths, perSession, sessionsPerDay, perDay, cappedAtAdult, uncappedPerDay };
}

/**
 * Senior: a proportional reduction of the adult range, presented as more,
 * shorter walks.
 *
 * IMPORTANT HONESTY NOTE: no UK authority publishes a numeric reduction for
 * senior dogs — the published guidance is qualitative ("little and often",
 * "shorter but more frequent"). `RULES.senior.factor` is therefore OUR
 * editorial interpretation of that qualitative guidance, and the UI must label
 * it as such rather than implying it is sourced. See copy.js `sourcing`.
 *
 * @param {{minMinutes:number, maxMinutes:number}} adult
 * @returns {{minMinutes:number, maxMinutes:number, sessionsPerDay:number}}
 */
export function calculateSenior(adult) {
  const { factor, sessionsPerDay, minimumMinutes } = RULES.senior;

  let minMinutes = Math.max(roundTo(adult.minMinutes * factor), minimumMinutes);
  let maxMinutes = Math.max(roundTo(adult.maxMinutes * factor), minimumMinutes);

  // Rounding and the floor can collapse a narrow band; keep a sane spread.
  if (maxMinutes <= minMinutes) maxMinutes = minMinutes + RULES.rounding.step;

  return { minMinutes, maxMinutes, sessionsPerDay };
}

/* ===========================================================================
   The main calculation
   =========================================================================== */

/**
 * @typedef {Object} Result
 * @property {Input} input            the exact input this result was built from
 * @property {object} band
 * @property {object|null} breed
 * @property {LifeStage} lifeStage
 * @property {{minMinutes:number, maxMinutes:number}} adultBaseline
 * @property {{minMinutes:number, maxMinutes:number, sessionsPerDay:number}} headline
 * @property {object|null} puppy      populated only for the puppy stage
 * @property {object|null} senior     populated only for the senior stage
 * @property {{id:string, severity:string, appliesTo:string}[]} cautions
 */

/**
 * Calculate the exercise recommendation.
 * @param {Input} rawInput
 * @returns {Result}
 * @throws {Error} if the input does not validate — call `validate` first.
 */
export function calculate(rawInput) {
  const input = normaliseInput(rawInput);
  const { ok, errors } = validate(input);
  if (!ok) {
    const err = new Error(`Invalid input: ${errors.map((e) => e.code).join(', ')}`);
    // @ts-ignore — attach for programmatic handling
    err.errors = errors;
    throw err;
  }

  const breed = input.mode === 'breed' ? getBreedBySlug(input.breedSlug) : null;
  const band = breed ? getBand(breed.band) : getBand(input.bandId);

  const adultBaseline = { minMinutes: band.minMinutes, maxMinutes: band.maxMinutes };

  /** @type {ReturnType<typeof calculatePuppy>|null} */
  let puppy = null;
  /** @type {ReturnType<typeof calculateSenior>|null} */
  let senior = null;
  let headline;

  if (input.lifeStage === 'puppy') {
    puppy = calculatePuppy(input.puppyMonths, adultBaseline);
    // A puppy figure is a single number, not a range — express it as a
    // degenerate range so the UI has one shape to render.
    headline = { minMinutes: puppy.perDay, maxMinutes: puppy.perDay, sessionsPerDay: puppy.sessionsPerDay };
  } else if (input.lifeStage === 'senior') {
    senior = calculateSenior(adultBaseline);
    headline = { minMinutes: senior.minMinutes, maxMinutes: senior.maxMinutes, sessionsPerDay: senior.sessionsPerDay };
  } else {
    headline = {
      minMinutes: adultBaseline.minMinutes,
      maxMinutes: adultBaseline.maxMinutes,
      sessionsPerDay: RULES.adult.sessionsPerDay,
    };
  }

  const cautions = buildCautions(breed, band, input.lifeStage, {
    cappedAtAdult: Boolean(puppy && puppy.cappedAtAdult),
  });

  return { input, band, breed, lifeStage: input.lifeStage, adultBaseline, headline, puppy, senior, cautions };
}

/* ===========================================================================
   Deep links  (?breed=border-collie&stage=puppy&months=6  |  ?energy=high)
   ===========================================================================
   The reference tool has no deep linking at all, which makes its results
   unshareable and stops its own breed pages from prefilling it. Ours supports
   it in both directions.
   =========================================================================== */

/**
 * Parse a location.search string into a partial Input. Unknown or malformed
 * values are ignored rather than throwing — a bad link should still open a
 * usable, empty calculator.
 * @param {string} searchString e.g. "?breed=labrador-retriever&stage=puppy&months=6"
 * @returns {Partial<Input>}
 */
export function parseQuery(searchString) {
  /** @type {Partial<Input>} */
  const out = {};
  let params;
  try {
    params = new URLSearchParams(searchString || '');
  } catch {
    return out;
  }

  const breedParam = params.get('breed');
  if (breedParam) {
    const slug = breedParam.trim().toLowerCase();
    // Accept either a slug or a human-typed breed name.
    const breed = getBreedBySlug(slug) || searchBreeds(breedParam, 1)[0] || null;
    if (breed) {
      out.mode = 'breed';
      out.breedSlug = breed.slug;
    }
  }

  const energyParam = params.get('energy');
  if (!out.breedSlug && energyParam && getBand(energyParam.trim().toLowerCase())) {
    out.mode = 'energy';
    out.bandId = energyParam.trim().toLowerCase();
  }

  const stageParam = params.get('stage');
  if (stageParam && LIFE_STAGES.includes(/** @type {any} */ (stageParam.trim().toLowerCase()))) {
    out.lifeStage = /** @type {LifeStage} */ (stageParam.trim().toLowerCase());
  }

  const monthsParam = params.get('months');
  if (monthsParam !== null && monthsParam.trim() !== '') {
    const m = Number(monthsParam);
    if (Number.isFinite(m)) {
      out.puppyMonths = clamp(Math.floor(m), RULES.puppy.minMonths, RULES.puppy.maxMonths);
    }
  }

  return out;
}

/**
 * Build the shareable query string for a result. Mirror image of parseQuery.
 * @param {Input} input
 * @returns {string} e.g. "?breed=border-collie&stage=adult"
 */
export function buildQuery(input) {
  const params = new URLSearchParams();
  if (input.mode === 'breed' && input.breedSlug) params.set('breed', input.breedSlug);
  else if (input.mode === 'energy' && input.bandId) params.set('energy', input.bandId);

  if (input.lifeStage && input.lifeStage !== 'adult') params.set('stage', input.lifeStage);
  if (input.lifeStage === 'puppy' && Number.isFinite(input.puppyMonths)) {
    params.set('months', String(Math.floor(input.puppyMonths)));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/* ===========================================================================
   Re-exports so consumers need only import from the engine
   =========================================================================== */
export { BANDS, BAND_ORDER, BREEDS, RULES };
