// Structured-data (JSON-LD) builders — the site's schema foundation.
//
// WHY THIS EXISTS. Before 2026-07-16 the site emitted four JSON-LD nodes that
// each restated the business from scratch and none of which carried an @id:
// a LocalBusiness on /, a second (subtly different) LocalBusiness on /contact,
// an Organization stub as the blog's publisher, and another as the course's
// provider. To Google that reads as up to four separate organisations, so none
// of them accumulates entity authority. GSC confirmed the cost: every URL
// inspected reported "no enhancements" — zero structured data being picked up.
//
// THE RULE: there is exactly ONE business entity, ORG_ID, emitted once per page
// by Base.astro. Everything else — a page's Service, the blog's publisher, the
// course's provider — REFERENCES it with { '@id': ORG_ID } and never restates it.
// Add a node? Reference the @id. Never inline a second copy of the business.
//
// Facts come from business.ts / pricing.json. Never hard-code them here — the
// same rule CouncilRating.astro follows.

import { business } from './business';

/** The one canonical business entity. Reference this; never restate it. */
export const ORG_ID = `${business.domain}/#organization`;
export const WEBSITE_ID = `${business.domain}/#website`;
const LOGO_ID = `${business.domain}/#logo`;

/** Absolute URL for a site path, matching Base.astro's canonical rule exactly
 *  (build.format:'file' + trailingSlash:'never' => no trailing slash, ever). */
export const absUrl = (path: string) => `${business.domain}${path === '/' ? '' : path}`;

/** An offering as it exists in pricing.json. `unit` is human prose ("per day",
 *  "for 4 weeks"), NOT machine-parseable — it goes in the Offer description. */
export interface Offering {
  id: string;
  name: string;
  price: number;
  unit: string;
  eligibility?: string | null;
  largeDogSurcharge?: number | null;
  weeklyDiscountPrice?: number | null;
  acuityUrl?: string | null;
}

/** Money formatter — matches the local gbp() every page uses. */
const gbp = (n: number) =>
  Number.isInteger(n) ? `£${n.toLocaleString('en-GB')}` : `£${n.toFixed(2)}`;

/**
 * An Offer's human description, built as whole sentences.
 *
 * `unit` is prose ("for 4 weeks", "per day"), so the price is rendered as
 * "£1,200 for 4 weeks." rather than modelled as a priceSpecification — there is
 * no unitCode for "for 8–10 weeks". Every clause is terminated, because these
 * strings concatenate: an earlier version emitted the run-on
 * "Puppies 12–16 weeks old Price is for 4 weeks." — ungrammatical, and it named
 * no price at all on the one node whose job is to state the price.
 */
function offerDescription(o: Offering): string {
  const parts: string[] = [];
  if (o.eligibility) parts.push(o.eligibility.trim().replace(/[.;,]+$/, '') + '.');
  // price 0 is the free phone consultation, whose unit is literally "free".
  parts.push(o.price === 0 ? 'Free.' : `${gbp(o.price)} ${o.unit}.`);
  if (o.weeklyDiscountPrice) parts.push(`${gbp(o.weeklyDiscountPrice)} ${o.unit} booked weekly.`);
  if (o.largeDogSurcharge) parts.push(`Large dogs +${gbp(o.largeDogSurcharge)}.`);
  return parts.join(' ');
}

/** Where we actually serve, per track (SEO.md §1 two-track model).
 *  Board & Train travels — the £2/mile collection service reaches the whole
 *  South of England, London-led. Day-to-day services are Hastings-local. */
export const AREA_DESTINATION = ['London', 'South East England', 'South of England'];
export const AREA_LOCAL = ['Hastings', 'St Leonards-on-Sea', 'East Sussex'];

/**
 * The site-wide @graph: the business + the website, @id-anchored.
 * Emitted ONCE per page from Base.astro's <head>.
 */
export function buildSiteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': ORG_ID,
        name: business.name,
        url: business.domain,
        logo: {
          '@type': 'ImageObject',
          '@id': LOGO_ID,
          url: absUrl('/icon-512.png'),
          width: 512,
          height: 512,
          caption: business.name,
        },
        image: { '@id': LOGO_ID },
        telephone: business.phones.main.tel.replace('tel:', ''),
        email: business.emails.info,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${business.address.line1}, ${business.address.line2}`,
          addressLocality: business.address.town,
          postalCode: business.address.postcode,
          addressCountry: business.address.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: business.geo.lat,
          longitude: business.geo.lng,
        },
        hasMap: business.mapsUrl,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [...business.hours.jsonLd.days],
            opens: business.hours.jsonLd.opens,
            closes: business.hours.jsonLd.closes,
          },
        ],
        sameAs: [business.socials.facebook, business.socials.instagram],
        areaServed: [...AREA_LOCAL, ...AREA_DESTINATION],
        priceRange: '££',
        // The Hastings Borough Council animal-activity licence — a real,
        // publicly verifiable credential, and the strongest trust signal we own.
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'license',
          identifier: business.licence.number,
          name: `Animal activity licence ${business.licence.number} — ${business.licence.rating}-star rating`,
          recognizedBy: {
            '@type': 'GovernmentOrganization',
            name: business.licence.authority,
          },
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: business.domain,
        name: business.name,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-GB',
      },
    ],
  };
}

/**
 * A money page's Service + its Offer catalogue, sourced from pricing.json.
 * `provider` is a reference to ORG_ID — never a restated organisation.
 */
export function buildServiceSchema(opts: {
  /** Page path, e.g. '/dog-boarding-school' — becomes the @id and url. */
  path: string;
  name: string;
  description: string;
  serviceType: string;
  offerings: readonly Offering[];
  /** AREA_DESTINATION for Board & Train, AREA_LOCAL for day-to-day services. */
  areaServed: readonly string[];
}) {
  const url = absUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url,
    provider: { '@id': ORG_ID },
    areaServed: opts.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.name,
      itemListElement: opts.offerings.map((o) => ({
        '@type': 'Offer',
        name: o.name,
        description: offerDescription(o),
        price: o.price,
        priceCurrency: 'GBP',
        url: o.acuityUrl ?? url,
        availability: 'https://schema.org/InStock',
      })),
    },
  };
}

/**
 * FAQPage from a page's REAL rendered Q&A.
 *
 * ⚠️ Only ever pass questions that are genuinely rendered on the page as
 * question-and-answer pairs. Do NOT harvest the kit-list / entry-criteria
 * <details> blocks — they are labels, not questions, and putting them in a
 * FAQPage breaches Google's structured-data guidelines.
 */
export function buildFaqSchema(path: string, faqs: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absUrl(path)}#faq`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
