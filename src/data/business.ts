// Single source of truth for NAP, contact directory, booking links, tracking IDs.
// Fix facts HERE, never in page copy. (WEBSITE-PLAN.md "Single sources of data")
// Acuity URLs are byte-for-byte from the live site — NEVER normalise or rewrite them.

export const business = {
  name: 'The Fairy Tails K9 Centre',
  domain: 'https://www.thefairytails.co.uk',

  address: {
    line1: 'Near the Milking Parlour, The Barn',
    line2: 'Fairlight Place, Barley Lane',
    town: 'Hastings',
    postcode: 'TN35 5DT',
    countryCode: 'GB',
  },
  geo: { lat: 50.8708, lng: 0.62896 },
  mapsUrl:
    'https://maps.google.com/maps?q=The+Fairy+Tails+%28The+Barn%29%2C+Fairlight+Place+Hastings+Hastings+TN35+5DT+United+Kingdom',

  hours: {
    display: 'Mon to Fri 8.00 am – 5.30 pm · Sat, Sun & Bank Holidays closed',
    jsonLd: { opens: '08:00', closes: '17:30', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  },

  // Corrected wa.me form (live site's links are malformed — audit 2026-06-11).
  // ⚠️ TWO public phone numbers only (owner, 2026-07-12): the main line, plus
  // the out-of-hours EMERGENCY number ("out-of-hours numbers stays for
  // emergency contact only. only other number than the main line"). The old
  // direct lines (ops manager, grooming, training, pick-ups) are GONE — never
  // re-add another number here or render one anywhere without asking first.
  phones: {
    main: { label: 'Main line', display: '01424 300668', tel: 'tel:+441424300668', whatsapp: 'https://wa.me/441424300668' },
    emergency: { label: 'Out-of-hours emergency', display: '07517 405466', tel: 'tel:+447517405466' },
  },

  emails: {
    info: 'info@thefairytails.co.uk',
    ops: 'opsmanager@thefairytails.co.uk',
  },

  socials: {
    facebook: 'https://facebook.com/thefairytails',
    instagram: 'https://www.instagram.com/fairytails_dogschool/',
  },

  // Directory profiles emitted as schema.org `sameAs` — they tell Google "these
  // listings are the same business as this website", which strengthens the entity.
  //
  // ⚠️ ONLY ADD A LISTING HERE ONCE ITS NAP HAS BEEN READ AND VERIFIED CORRECT.
  // `sameAs` is an endorsement: publishing a listing that still carries the dead
  // grooming-era mobile (07842 116216) or a Grooming primary category would tell
  // Google our own NAP is inconsistent — worse than not linking it at all. This
  // is why the field sat empty and gated from 2026-07-18 (SEO.md §7 P 2.4).
  //
  // cylex — VERIFIED 2026-07-21 against business.ts, field by field: name ✓,
  // full address + TN35 5DT ✓, phone 01424 300668 ✓ (the dead mobile is GONE),
  // website ✓, hours Mon–Fri 08:00–17:30 + Sat/Sun closed ✓, primary category
  // Pets & Animals → Pet Services → Dog Training ✓. Page reads "Verified Listing,
  // updated 17/07/2026". NOTE the PUBLIC profile lives on the TOWN SUBDOMAIN
  // (hastings.cylex-uk.co.uk) — www.cylex-uk.co.uk 403s/404s, which is what
  // blocked this for days. Residual (owner, ~1 min, does NOT block sameAs): three
  // grooming keyword chips still sit in its secondary keyword list.
  directoryProfiles: {
    cylex: 'https://hastings.cylex-uk.co.uk/company/the-fairy-tails-k9-centre-27356248.html',
  },

  // The site's byline identity. Every blog post is written under this name, so
  // it belongs in the data layer rather than hard-coded in the post template —
  // and it is emitted with a stable @id (see data/schema.ts) so the posts
  // resolve to ONE person rather than one anonymous Person node per post.
  // No `url` yet: there is no author page to point at, and Google's Rich
  // Results Test treats author.url as optional. Don't invent one.
  author: {
    name: 'Kamal Singh',
  },

  // Council licensing under the Animal Welfare (Licensing of Activities
  // Involving Animals) (England) Regulations 2018. Displaying the licence
  // number is a legal requirement for a licensed premises — it lives in the
  // site-wide footer. 5 stars = the highest rating a council can award.
  licence: {
    number: 'WK/202503477',
    authority: 'Hastings Borough Council',
    rating: 5,
  },

  acuity: {
    main: 'https://app.acuityscheduling.com/schedule.php?owner=13914499',
    // Header "Book Appointment" — the old site's prominent CTA for returning regulars
    bookAppointment: 'https://app.acuityscheduling.com/schedule/be03d6bc',
    freeConsult: 'https://app.acuityscheduling.com/schedule.php?owner=13914499&appointmentType=56694430',
    oneToOne: 'https://app.acuityscheduling.com/schedule.php?owner=13914499&appointmentType=51989230',
    puppyClassesCart: 'https://app.acuityscheduling.com/catalog.php?owner=13914499&action=addCart&clear=1&id=1469464',
    trainingClassesCart: 'https://app.acuityscheduling.com/catalog.php?owner=13914499&action=addCart&clear=1&id=1469467',
    // ⚠️ Not Acuity any more: the grooming Acuity account was DISABLED and bookings
    // moved to the salon's JotForm system (owner, 2026-07-11). Key kept for stability.
    grooming: 'https://pci.jotform.com/form/251190647924057',
  },

  groomingSite: 'https://fairytailsdoggrooming.co.uk/',

  tracking: {
    gtm: 'GTM-W93L9XK5',
    metaPixel: '612955530110673', // NOT on the site — adding it would turn Meta tracking ON (owner: no, 2026-07-14)
    adsConversion: 'AW-822632954',
    // GA4 property "The Fairy Tails — Website" (2026-07-14, owner-approved): UK tz, GBP,
    // 14-month retention. The tag itself is fired by GTM, not from this id — it is recorded
    // here as the source of truth. See src/scripts/analytics.ts for the ClientRouter trap.
    ga4: 'G-TPBSKV29CJ',
  },

  // n8n "Website Enquiry" production webhook (workflow qVpPqijvyEqWiPwy) —
  // public by design; spam defence lives in n8n.
  enquiryWebhook: 'https://auto.thefairytails.co.uk/webhook/website-enquiry',
} as const;
