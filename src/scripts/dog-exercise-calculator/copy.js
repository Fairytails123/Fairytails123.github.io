/* ===========================================================================
   Dog Walking Calculator — USER-FACING COPY
   ---------------------------------------------------------------------------
   Every string a visitor can read lives here. Nothing in this file affects a
   calculation, so it can be rewritten freely at integration to match the site's
   tone of voice without any risk to the maths.

   British English throughout.

   SOURCING DISCIPLINE (please preserve this when rewording)
   ---------------------------------------------------------------------------
   The research behind this tool drew a hard line between what is PUBLISHED by a
   named authority and what is our own editorial judgement. Three things in this
   tool are OURS, not sourced, and the copy says so plainly:

     1. The senior reduction factor. No UK or international authority publishes
        any percentage or fraction for reducing an older dog's exercise. PDSA
        says only "a little less"; Blue Cross's "2 x 30 min rather than an hour"
        is a REDISTRIBUTION at unchanged volume, not a cut.
     2. The puppy cap at the adult figure. Nobody publishes it. We apply it
        because the five-minute rule taken literally overshoots the adult figure
        for a small breed from about four months old.
     3. The band boundaries in minutes. The Royal Kennel Club publishes tiers
        ("Up to 1 hour per day"), PDSA publishes minimums (30 min / 1 hr / 2 hr).
        Neither publishes our four ranges.

   Two attribution traps that this copy deliberately avoids:
     - The five-minute rule is published by THE ROYAL KENNEL CLUB, not PDSA.
       PDSA criticises it. Attributing it to both, as some tools do, is wrong.
     - The widely quoted line about the rule being wrong for "toy breeds or
       brachycephalics" is Vet Help Direct, NOT PDSA. Do not merge the two.
   =========================================================================== */

import { RULES } from './data.js';

/* ===========================================================================
   Formatters
   =========================================================================== */

const EN_DASH = '–';

/**
 * Render a minute range for display.
 * A degenerate range (min === max, as produced for puppies) renders as a single
 * figure rather than "30-30".
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function formatRange(min, max) {
  if (min === max) return `${min} minutes`;
  return `${min}${EN_DASH}${max} minutes`;
}

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural]
 * @returns {string}
 */
function plural(count, singular, plural_ = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural_}`;
}

/**
 * @param {'puppy'|'adult'|'senior'} stage
 * @returns {string}
 */
export function formatStageNote(stage) {
  return COPY.stageNotes[stage] || '';
}

/** @returns {string} */
export function formatPuppyHint() {
  return `Between ${RULES.puppy.minMonths} and ${RULES.puppy.maxMonths} months. Older than that, choose Adult instead.`;
}

/* ===========================================================================
   The copy
   =========================================================================== */

export const COPY = {
  /* ---------- form ---------- */

  chosenBandSuffix: (bandLabel) => `(${bandLabel.toLowerCase()})`,

  search: {
    /** Shown when nothing matched literally and these are typo corrections. */
    didYouMean: 'No exact match. Did you mean one of these?',
    /** Shown when the list is truncated, so the cut is never silent. */
    showingSomeOfMany: (shown, total) => `Showing ${shown} of ${total} matches. Keep typing to narrow it down.`,
  },

  noMatch: (query) =>
    `We do not have ${query ? `"${query}"` : 'that one'} in our list. Try a different spelling, or switch to ` +
    `"Choose by energy level" instead. Cross-breeds usually sit somewhere between their parent breeds.`,

  stageNotes: {
    puppy:
      'Still growing. Their walking budget is worked out from their age, because too much formal ' +
      'exercise while the joints are developing can do lasting harm.',
    adult: 'Fully grown and in normal health.',
    senior:
      'Slowing down with age. Dogs are usually considered senior from around seven years old, earlier ' +
      'for large breeds and later for small ones.',
  },

  /* ---------- result ---------- */

  result: {
    eyebrow: (stage) =>
      ({
        puppy: 'Puppy walking plan',
        adult: 'Daily walking plan',
        senior: 'Senior walking plan',
      })[stage] || 'Daily walking plan',

    perDay: 'a day',

    adultBreakdown: (sessions) =>
      `Best split across ${plural(sessions, 'walk')} a day, with plenty of time to sniff and explore ` +
      `rather than route marching.`,

    /**
     * When the cap has bitten, the rule's own per-session figure no longer
     * matches the headline, so quoting it would contradict the big number
     * directly above it. Describe the shape of the day instead.
     */
    puppyBreakdown: (sessions, perSession, months, capped) =>
      (capped
        ? `Spread that across ${plural(sessions, 'short walk')} or so, at ${plural(months, 'month')} old. `
        : `That is ${plural(sessions, 'short walk')} of about ${perSession} minutes, at ${plural(months, 'month')} old. `) +
      `This is a budget for lead walks and other formal exercise only. Free play and pottering about at ` +
      `their own pace is separate, and puppies are good at stopping when they have had enough.`,

    puppyCapped: (uncapped, adultMax) =>
      `The five-minute rule alone would suggest ${uncapped} minutes at this age, which is more than a fully ` +
      `grown dog of this type needs. We have capped it at the adult figure of ${adultMax} minutes. That cap ` +
      `is our own judgement, not a published rule.`,

    seniorBreakdown: (sessions) =>
      `Little and often is the published advice, so aim to spread this across about ${plural(sessions, 'shorter walk')} ` +
      `rather than one long one. Joints stiffen up when they are not used, so keeping the routine going matters ` +
      `more than the total.`,

    adultBaseline: (range) => `For comparison, a fully grown dog of this type would typically need ${range} a day.`,

    cautionsTitle: 'Worth knowing',

    enrichmentTitle: 'Add brain work on top',
    enrichmentIntro:
      'Mental exercise tires a dog out much as physical exercise does, and it matters most when walks are ' +
      'shorter than usual. It is an addition to the walking time above, not a swap for it. PDSA and the ' +
      'Royal Kennel Club are both explicit that a garden or a puzzle feeder does not replace getting out.',
    enrichmentIdeas: [
      'Let them sniff properly on walks. A slow, meandering, nose-led walk does far more for them than a brisk lap.',
      'Scatter feeding, snuffle mats and puzzle feeders instead of a bowl.',
      'Short reward-based training sessions, a few minutes at a time.',
      'Vary the route and the surfaces rather than repeating the same loop.',
      'Chewing and licking, which are genuinely calming rather than just occupying.',
    ],
  },

  /* ---------- cautions (ids must match engine.js buildCautions) ---------- */

  cautions: {
    'puppy-growing-joints': {
      title: 'Growing joints.',
      body:
        'Keep it low impact. Avoid repeated jumping, sharp turns, hard ball chasing and long hikes until they ' +
        'are fully grown. Damage from over-exercise usually shows no signs until it is already done.',
    },
    'puppy-giant-growth': {
      title: 'A big breed grows for longer.',
      body:
        'Larger breeds can take eighteen months to two years to reach full size, so the careful period lasts ' +
        'well beyond a year. The published advice is a longer stretch of restraint, not a smaller daily figure.',
    },
    'puppy-reached-adult-level': {
      title: 'Nearly grown.',
      body: 'At this age the rule of thumb has caught up with the adult requirement, so follow the adult guidance.',
    },
    'senior-little-and-often': {
      title: 'Little and often.',
      body:
        'Shorter, more frequent walks suit an older dog better than one long outing, and keep stiffness at bay. ' +
        'Swimming is gentle on sore joints, and training keeps an older mind busy.',
    },
    'senior-vet-check': {
      title: 'Check in with your vet.',
      body:
        'Older dogs are more likely to have something going on that limits what they can do. If they tire ' +
        'quickly, move awkwardly or seem stiff, get them looked at rather than pushing on.',
    },
    'brachycephalic-breathing': {
      title: 'A flat face changes the rules.',
      body:
        'Flat-faced dogs overheat far more easily and can struggle to breathe if pushed. Build fitness slowly, ' +
        'use a harness rather than a collar, walk in the cool of the morning or evening, and stop at the first ' +
        'sign of laboured breathing.',
    },
    'sighthound-sprints': {
      title: 'Built for sprints, not distance.',
      body:
        'Sighthounds tend to want a short burst of hard running and then a long sleep. A couple of steady ' +
        'walks with a safe chance to stretch out suits them better than endless miles.',
    },
    'working-needs-a-job': {
      title: 'Walking alone will not be enough.',
      body:
        'Working and herding breeds need something to think about as well as distance to cover. Without a job ' +
        'they tend to invent one, and it is rarely one you would have chosen.',
    },
  },

  /* ---------- cross-link ---------- */

  crossLink: {
    href: '/breed-matcher/',
    text: 'Not sure a breed suits your life? Try our breed matcher',
  },

  /* ---------- sourcing + disclaimer ---------- */

  sourcing: {
    title: 'Where these figures come from',
    paragraphs: [
      'Breed exercise levels are based on published guidance from ' +
        '<a href="https://www.royalkennelclub.com/search/breeds-a-to-z/" rel="nofollow noopener" target="_blank">The Royal Kennel Club</a> ' +
        ", which lists a daily exercise tier for every breed it recognises, and " +
        '<a href="https://www.pdsa.org.uk/pet-help-and-advice/looking-after-your-pet/puppies-dogs" rel="nofollow noopener" target="_blank">PDSA</a>' +
        ', which publishes a minimum daily exercise figure on its breed pages. Where the two differ we have used our own judgement, ' +
        'and the ranges shown here are ours rather than either organisation&rsquo;s.',

      'The puppy figure uses the Royal Kennel Club&rsquo;s rule of thumb of five minutes of formal exercise per ' +
        'month of age, up to twice a day, until the puppy is fully grown. It is worth knowing that ' +
        '<strong>PDSA disagrees with it</strong>: they state that &ldquo;there&rsquo;s no scientific evidence behind this ' +
        'rule, and although it might work for some, it&rsquo;s not appropriate for most puppies&rdquo;. Treat it as a ' +
        'starting point and follow your puppy rather than the number. We cap the figure so it never exceeds what ' +
        'an adult of the same type would need; that cap is our own safety logic and is not published anywhere.',

      '<strong>No organisation publishes a numeric reduction for senior dogs.</strong> The published advice is ' +
        'qualitative: PDSA says an older dog may need &ldquo;a little less&rdquo; and that &ldquo;little and often is ' +
        'best&rdquo;. The reduction applied above is our own interpretation of that, offered as a starting point. ' +
        'The part that <em>is</em> well supported is splitting the time into shorter, more frequent walks.',

      'Exercise is also the single most common cause of heatstroke in dogs. The Royal Kennel Club reports that ' +
        'around three quarters of cases follow over-exercising or exercising on a hot day, so in warm weather ' +
        'walk early or late and cut the distance.',
    ],
  },

  disclaimer: {
    title: 'This is general guidance, not veterinary advice.',
    body:
      'Every dog is an individual, and breed is only one factor alongside age, weight, fitness and health. ' +
      'If your dog is unwell, recovering, overweight, or you are unsure how much exercise is safe for them, ' +
      'speak to your vet, whose advice should always come first.',
  },
};
