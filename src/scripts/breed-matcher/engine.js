/* ===========================================================================
   Breed Matcher — SCORING ENGINE
   ---------------------------------------------------------------------------
   Lifted VERBATIM from the standalone tool (public/breed-matcher/index.html,
   retired 2026-08-03 when the tool became the Astro page /breed-matcher/). The
   port moved this code into a module and changed NOTHING about how it scores.

   🔒 THE THREE SACRED RULES (tools/breed-matcher/CLAUDE.md §0). Simplify anything
   except these:
     1. The chosen breed stays the HERO of the results, always.
     2. HARD-NOS NEVER LIFT — `supported === base`, no gold bar, stated plainly.
        Faking a recovery on a genuine physical limit destroys the honesty that
        is the whole asset.
     3. The two-register tip voice: most tips calm and professional, the
        safety-critical ones blunt AND visually flagged. The contrast is the
        trick — keep most tips quiet so the loud ones mean something.

   The 92 cap on `supported` bounds the LIFT, not an already-excellent honest
   score. `npm run test:breed-matcher` asserts all of this.

   ⚠️ PLAIN JS ON PURPOSE — the node test harness imports this module directly.
   =========================================================================== */

import { svc } from './services.js';

export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/* ---------------------------------------------------------------------------
   Space available = home MINUS access.
   The point: the constraint is not the postcode. A high-energy breed in a flat
   with beaches nearby is a very different dog from the same breed in a flat with
   only pavement.
   --------------------------------------------------------------------------- */
export function effectiveSpace(a) {
  const home = { flat: 1, smallGarden: 3, largeGarden: 5 }[a.home];
  const boost = { parksOnly: 0, natureNearby: 1.5, willTravel: 1.5, privateLand: 2 }[a.access];
  return clamp(home + boost, 1, 5);
}

/**
 * Score one breed against one answer set.
 * Two layers: physical hard-nos cap the score with no lift; everything else is a
 * weighted gap. Bridgeable gaps (time/experience/drive/access/grooming) lift the
 * "with support" score; physical limits don't budge.
 *
 * @returns {{breed:object, base:number, supported:number, hardNo:object|null,
 *            steer:object|null, bridges:object[], cautions:string[],
 *            band:{k:string,t:string}, lift:number}}
 */
export function scoreBreed(breed, a) {
  let base = 100, recover = 0;
  const bridges = [];      // recoverable gaps -> service
  const cautions = [];     // soft, no-penalty nudges
  let hardNo = null;       // {reason}
  let steer = null;        // {text}
  const kids = a.household || [];
  const hasToddler = kids.includes("youngKids");

  // -- helper to log a bridgeable gap
  const gap = (penalty, frac, gapText, fixHtml, liftTag) => {
    base -= penalty; const r = penalty * frac; recover += r;
    bridges.push({ gap: gapText, fix: fixHtml, lift: liftTag || ("+" + Math.round(r)) });
  };

  /* ---- SPACE (giant-in-flat = hard no; high demand + poor access = bridgeable) ---- */
  if (breed.size === 5 && a.home === "flat") {
    hardNo = { reason: `A ${breed.name.toLowerCase()} simply needs more room than a flat can give — that's about the home itself, and no service or training changes it.` };
    base = Math.min(base, 36);
  } else {
    const space = effectiveSpace(a);
    if (breed.spaceNeed > space) {
      const g = breed.spaceNeed - space;
      const pen = g * 9;
      // access (not home size) is the solvable part
      // 🔒 Hiring a secure field is GENERIC advice here — deliberately unlinked and
      // never called "ours". ✅ OWNER CONFIRMED 2026-08-03: "we don't have secure
      // field service — we don't offer that." It had been presented as a Fairy Tails
      // service in this tool since ~June 2026. **Never re-link it, and never re-add a
      // `field:` key to services.js** — the moment it carries svc() it becomes a
      // product claim for a product that does not exist. Advice = fine; "our" = not.
      if (a.access === "parksOnly" && breed.size < 5) {
        gap(pen, 0.7, "Needs more space than parks alone provide",
          `Regular open space sorts this — hiring a secure field, or making the most of nearby beaches and countryside, plus our ${svc("walking", "dog walking")}.`);
      } else {
        gap(pen, 0.45, "On the demanding side for your space",
          `Hiring a secure field, plus our ${svc("walking", "walking team")}, takes the pressure off.`);
      }
    }
  }

  /* ---- ALLERGY (real allergy + non-allergy-friendly coat = hard no) ---- */
  if (a.coat === "needHypoallergenic" && !breed.lowAllergen) {
    if (!hardNo) hardNo = { reason: `With a real allergy in the home, this coat is a genuine no — that's biology, not something we'd ever paper over.` };
    base = Math.min(base, 38);
  } else if (a.coat === "preferLowShed" && breed.shed >= 4) {
    gap(8, 0.35, "A heavier shedder than you'd like",
      `Routine ${svc("grooming", "grooming")} keeps loose hair right down, though it won't make a shedder a non-shedder.`);
  }

  /* ---- HOURS ALONE (daycare bridges it) ---- */
  if (!hardNo) {
    if (a.alone === "mostDay" && breed.aloneTol <= 2) {
      gap(16, 0.85, "Not a breed that loves long days alone",
        `Our ${svc("daycare", "doggy daycare")} fills the gap completely — company and stimulation while you work.`);
    } else if (a.alone === "mostDay" && breed.aloneTol === 3) {
      gap(8, 0.85, "Long days alone need managing", `A few days of ${svc("daycare", "daycare")} a week keeps things balanced.`);
    } else if (a.alone === "fewHours" && breed.aloneTol <= 2) {
      gap(7, 0.8, "Happier with company than long stretches alone", `Half-day ${svc("daycare", "daycare")} or a midday visit covers it.`);
    }
  }

  /* ---- EXPERIENCE (puppy course bridges it) ---- */
  if (!hardNo && a.experience === "first" && breed.novice <= 2) {
    gap(15, 0.8, "A lot of dog for a first-timer",
      `Our ${svc("puppy", "puppy training course")} is exactly the leg-up that makes this work — you'll start right rather than firefight later.`);
  } else if (!hardNo && a.experience === "some" && breed.novice === 1) {
    gap(8, 0.75, "A genuinely challenging breed", `${svc("intensive", "Intensive training")} gives you the grounding this one demands.`);
  }

  /* ---- EXERCISE / DRIVE vs COMMITMENT ---- */
  const exLevel = { gentle: 1, moderate: 2, active: 4, working: 5 }[a.exercise];
  if (!hardNo && breed.energy > exLevel) {
    const g = breed.energy - exLevel;
    const pen = g * 7;
    if (breed.energy >= 5) {
      gap(pen, 0.6, "A working drive that needs an outlet",
        `Channel it properly with ${svc("intensive", "intensive training")} and burn it off through ${svc("daycare", "daycare")} — under-stimulation is where the trouble starts.`);
    } else {
      gap(pen, 0.55, "More energy than your routine plans for",
        `Our ${svc("walking", "walking")} and ${svc("daycare", "daycare")} top up what your day can't.`);
    }
  }

  /* ---- GROOMING vs WILLINGNESS ---- */
  if (!hardNo && breed.groom >= 4 && a.grooming === "minimal") {
    gap(11, 0.85, "A coat that needs proper upkeep",
      `Our ${svc("grooming", "grooming salon")} handles it — and early, regular handling builds a calmer dog (more on that below).`);
  } else if (!hardNo && breed.groom >= 4 && a.grooming === "brush") {
    gap(5, 0.8, "Brushing alone won't quite keep this coat", `Pair home brushing with regular ${svc("grooming", "salon")} visits.`);
  }

  /* ---- TODDLER SAFETY: strong steer (recoverable, always flagged) ---- */
  if (!hardNo && hasToddler && (breed.guard >= 4 || breed.kids <= 2)) {
    const pen = 14;
    base -= pen; recover += pen * 0.7;
    steer = { text: `With a toddler in the home, a ${breed.name.toLowerCase()}'s guarding and management needs are serious — not impossible, but they ask a lot. This is one to take on only with ${svc("intensive", "intensive training")}, professional behavioural guidance and careful day-to-day management. We won't pretend that's a small commitment.` };
  } else if (!hardNo && hasToddler && breed.size >= 4) {
    cautions.push("A big, bouncy dog and a tiny child is a lot to manage at once — many families find life easier with a smaller dog while the children are little. Not a no, just worth a thought.");
  }

  /* ---- SIZE PREFERENCE (their preference; mild, not recoverable) ---- */
  const wantSize = { small: [1, 2], medium: [2, 3, 4], large: [4, 5], any: null }[a.sizePref];
  if (wantSize && !wantSize.includes(breed.size)) {
    const dist = Math.min(...wantSize.map((s) => Math.abs(s - breed.size)));
    base -= dist * 5;
  }

  /* ---- BARKING ---- */
  if (!hardNo && a.barking === "quiet" && breed.bark >= 4) {
    gap(6, 0.45, "On the vocal side", `Training curbs nuisance barking, though some breeds will always have plenty to say.`);
  }

  base = clamp(Math.round(base), 5, 97);
  const supported = hardNo ? base : clamp(Math.round(base + recover), base, 92);

  // band keys off the best honest score available
  const headline = hardNo ? base : supported;
  let band;
  if (hardNo) band = { k: "honest", t: "Be honest with yourself" };
  else if (headline >= 82) band = { k: "great", t: "A great fit" };
  else if (headline >= 65) band = { k: "support", t: "A great fit — with the right support" };
  else band = { k: "demand", t: "Doable, but demanding" };

  return { breed, base, supported, hardNo, steer, bridges, cautions, band, lift: supported - base };
}

/** One-line plain-English summary of fit. */
export function whyLine(r, a) {
  const b = r.breed;
  if (r.hardNo) return `On paper a wonderful breed — but for your circumstances, the honest answer matters more than the dream.`;
  const pos = [];
  if (b.kids >= 5 && (a.household || []).includes("youngKids")) pos.push("brilliant with young children");
  if (b.train >= 4) pos.push("genuinely trainable");
  if (b.aloneTol >= 4) pos.push("easy-going about time alone");
  if (b.novice >= 4 && a.experience === "first") pos.push("forgiving for a first dog");
  if (b.groom <= 1) pos.push("wonderfully low-maintenance");
  if (b.energy <= 2 && a.exercise === "gentle") pos.push("happy with a gentler pace");
  let s;
  if (r.lift >= 12) s = `A real possibility for you — the gaps are the kind we're built to close, not dealbreakers.`;
  else if (r.supported >= 82) s = `A natural match for the life you've described` + (pos.length ? `: ${pos.slice(0, 2).join(" and ")}.` : ".");
  else s = `A fair fit, with a few things to weigh up` + (pos.length ? ` — ${pos[0]} on the plus side.` : ".");
  return s;
}

/* ===========================================================================
   TIPS — universal + triggered, with promotion ("say it louder")
   Voice: neutral by default; safety-critical points shift to a plainer, direct
   register and get visually flagged. Promotion pulls a tip to the top and flags
   it for the users most likely to underestimate it.
   =========================================================================== */
export function buildTips(r, a) {
  const b = r.breed;
  const tips = [];

  // 1. ALWAYS FIRST — breeder vetting (firm, but neutral register)
  tips.push({ key: "breeder", first: true, order: 0,
    head: "Where you get your dog matters more than the breed",
    body: `Whatever you choose, this is the single biggest lever on temperament, health and trainability. Buy from a council-licensed, inspected breeder, always see the pup with its mother, and walk away from anything sold purely online. A well-bred, well-started dog is a different animal — and it's what keeps every tip below within reach.` });

  // 2. Grooming-handling / bite prevention — direct voice, ALWAYS shown,
  //    PROMOTED + louder for low-maintenance coats (the ones who skip it)
  const skipRisk = (a.grooming === "minimal") || (b.groom <= 2);
  tips.push({ key: "handling", flag: true, promote: skipRisk, order: skipRisk ? 1 : 5,
    head: "Get them used to the groomer early — even a low-maintenance breed",
    body: skipRisk
      ? `Here's something most people get wrong: a low-upkeep coat tempts you to skip the groomer entirely. That's the very mistake that shows up in bite cases later. Dogs handled by groomers from a young age learn to accept being touched and restrained by people — the ones that bite are very often the ones that never went. Book early, low-maintenance or not. ${svc("grooming", "Our salon")} starts pups gently.`
      : `Early, regular professional handling does more than keep a coat tidy — it teaches a dog to accept being touched and worked on by people, which is a thread running through bite prevention. Start young with ${svc("grooming", "our salon")}.` });

  // 3. Day-one separation training — direct + PROMOTED for long-alone profiles
  const aloneRisk = a.alone === "mostDay" || a.alone === "fewHours";
  tips.push({ key: "separation", flag: aloneRisk, promote: aloneRisk, order: aloneRisk ? 2 : 6,
    head: "Start separation training on day one — not day seven",
    body: aloneRisk
      ? `Everyone's instinct is to be glued to a new pup those first unsettled days — and that's exactly how you build the clinginess you'll then spend months undoing. From hour one, build short, calm absences so being alone is simply normal. It's prevention; leave it a week and it becomes treatment, which is far harder. ${svc("daycare", "Daycare")} fits naturally into a healthy routine.`
      : `Even with someone usually home, teach short calm absences from the very first day so alone-time never becomes a worry. Prevention is far easier than fixing it later.` });

  // 4. Early socialisation window — direct + PROMOTED for first-timers
  const newOwner = a.experience === "first";
  tips.push({ key: "social", flag: newOwner, promote: newOwner, order: newOwner ? 3 : 7,
    head: "Socialise before the jabs are finished — the window's already open",
    body: newOwner
      ? `The instinct is "not fully vaccinated, keep them in" — and people miss the critical window that never reopens. Carry your pup or use a sling: feet off the ground for safety, senses wide open to traffic, crowds, hoovers, umbrellas, all the everyday chaos. Done now, it's worth more than any class later.`
      : `The critical socialisation window runs before the vaccination course ends. Carry them or use a sling to safely expose them to noise, traffic and bustle now — it's a head start you can't get back.` });

  // 5. Triggered: working/high drive -> mental stimulation
  if (b.energy >= 4) {
    const under = ({ gentle: 1, moderate: 2, active: 4, working: 5 }[a.exercise]) < b.energy;
    tips.push({ key: "stim", flag: under && b.energy >= 5, promote: under, order: under ? 4 : 8,
      head: "Tire the brain, not just the legs",
      body: `A bright, driven breed that's bored doesn't relax — it invents jobs you won't like. Scent games, training, puzzle work and structured outlets matter as much as the walk. ${svc("intensive", "Training")} gives you the toolkit; ${svc("daycare", "daycare")} burns the rest.` });
  }

  // 6. Triggered: heavy coat prep
  if (b.groom >= 4 && !skipRisk) {
    tips.push({ key: "coatprep", order: 9,
      head: "Build a grooming routine before the coat needs it",
      body: `This coat takes real upkeep. Get pup comfortable with brushing and the ${svc("grooming", "salon")} early, so grooming is a calm habit rather than a battle once the adult coat arrives.` });
  }

  // sort: first, then promoted (by order), then the rest
  tips.sort((x, y) => (y.first ? 1 : 0) - (x.first ? 1 : 0) || x.order - y.order);
  return tips.slice(0, 5);
}
