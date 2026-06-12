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

  // Corrected wa.me forms (live site's links are malformed — audit 2026-06-11)
  phones: {
    main: { label: 'Main line', display: '01424 300668', tel: 'tel:+441424300668', whatsapp: 'https://wa.me/441424300668' },
    textLine: { label: 'Text / WhatsApp line', display: '07842 116216', tel: 'tel:+447842116216', whatsapp: 'https://wa.me/447842116216' },
    emergency: { label: 'Emergency', display: '07517 405466', tel: 'tel:+447517405466' },
    opsManager: { label: 'Ops Manager', display: '07719 739556', tel: 'tel:+447719739556' },
    grooming: { label: 'Dog Grooming', display: '07355 878680', tel: 'tel:+447355878680' },
    training: { label: 'Dog Training', display: '07719 563524', tel: 'tel:+447719563524' },
    pickups: { label: 'Pick-up Enquiries', display: '07803 357262', tel: 'tel:+447803357262' },
  },

  emails: {
    info: 'info@thefairytails.co.uk',
    ops: 'opsmanager@thefairytails.co.uk',
  },

  socials: {
    facebook: 'https://facebook.com/thefairytails',
    instagram: 'https://www.instagram.com/fairytails_dogschool/',
  },

  acuity: {
    main: 'https://app.acuityscheduling.com/schedule.php?owner=13914499',
    freeConsult: 'https://app.acuityscheduling.com/schedule.php?owner=13914499&appointmentType=56694430',
    oneToOne: 'https://app.acuityscheduling.com/schedule.php?owner=13914499&appointmentType=51989230',
    puppyClassesCart: 'https://app.acuityscheduling.com/catalog.php?owner=13914499&action=addCart&clear=1&id=1469464',
    trainingClassesCart: 'https://app.acuityscheduling.com/catalog.php?owner=13914499&action=addCart&clear=1&id=1469467',
    grooming: 'https://thefairytailsdoggrooming.as.me/schedule.php',
  },

  groomingSite: 'https://fairytailsdoggrooming.co.uk/',

  tracking: {
    gtm: 'GTM-W93L9XK5',
    metaPixel: '612955530110673', // migrates into GTM at Stage 4 (consent-gated)
    adsConversion: 'AW-822632954',
    ga4: '', // created with the owner at Stage 4
  },

  // n8n "Website Enquiry" production webhook (workflow qVpPqijvyEqWiPwy) —
  // public by design; spam defence lives in n8n.
  enquiryWebhook: 'https://ftmanager.app.n8n.cloud/webhook/website-enquiry',
} as const;
