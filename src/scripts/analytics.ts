/**
 * GA4 measurement — dataLayer pushes that GTM (container GTM-W93L9XK5) consumes.
 *
 * The GA4 config tag lives in GTM, not here. This file only reports the things GTM
 * cannot see on its own.
 *
 * ⚠️ THE <ClientRouter /> TRAP — the whole reason this file exists.
 * The site uses Astro view transitions, so navigation is client-side. GTM's Google Tag
 * fires only on Initialization (i.e. a hard page load), and GA4's Enhanced Measurement
 * option "page changes based on browser history events" is deliberately DISABLED on the
 * data stream — it fires mid-swap and records the PREVIOUS page's <title>. So a naive
 * GA4 install sends page_view ONCE and then goes silent: it *looks* installed while
 * under-reporting massively. Client-side navigations are therefore reported here, on
 * `astro:page-load` — the only moment at which the new DOM (and its <title>) is live.
 *
 * The FIRST `astro:page-load` is skipped on purpose: the hard page load already produced
 * a page_view via the Google Tag. Skipping it is what keeps the count at exactly one per
 * page view instead of two.
 *
 * Consent: Consent Mode v2 defaults to DENIED in Base.astro *before* GTM loads (UK PECR).
 * These pushes queue and only reach GA4 once the visitor grants consent via the banner.
 *
 * State is held on `window`, not in module scope, so that a re-executed module (a bundler
 * or ClientRouter edge case) can never double-register the listeners and double-count.
 */

type DL = Record<string, unknown>;

interface AnalyticsState {
  ready: boolean;
  hardLoadCounted: boolean;
  toolsSeen: Set<string>;
}

const w = window as unknown as { dataLayer?: DL[]; __ftAnalytics?: AnalyticsState };

const push = (payload: DL) => {
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
};

/** Tools whose first interaction is worth a `tool_engagement` event. */
const TOOLS: ReadonlyArray<readonly [selector: string, tool: string]> = [
  ['[data-estimator]', 'day-school-estimator'],
  ['[data-section="toilet"]', 'puppy-toilet-schedule'],
];

export function initAnalytics() {
  const state: AnalyticsState = (w.__ftAnalytics ??= {
    ready: false,
    hardLoadCounted: false,
    toolsSeen: new Set<string>(),
  });
  if (state.ready) return;
  state.ready = true;

  /* --- page_view for client-side navigations (see the ClientRouter note above) --- */
  document.addEventListener('astro:page-load', () => {
    if (!state.hardLoadCounted) {
      state.hardLoadCounted = true; // the Google Tag already counted the hard load
      return;
    }
    // No page_location/page_title passed: the GA4 tag reads them from the live DOM at
    // fire time, which is now correct because the swap has completed.
    push({ event: 'ft_page_view' });
  });

  /* --- contact_click: tap-to-call and WhatsApp, otherwise invisible to GA4 --- */
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const method = href.startsWith('tel:')
        ? 'phone'
        : /wa\.me|whatsapp\.com/i.test(href)
          ? 'whatsapp'
          : href.startsWith('mailto:')
            ? 'email'
            : '';
      if (method) push({ event: 'contact_click', method });
    },
    { capture: true },
  );

  /* --- tool_engagement: once per tool, per page view, on first real interaction --- */
  const onInteract = (e: Event) => {
    const target = e.target as Element | null;
    if (!target?.closest) return;
    for (const [selector, tool] of TOOLS) {
      if (target.closest(selector) && !state.toolsSeen.has(tool)) {
        state.toolsSeen.add(tool);
        push({ event: 'tool_engagement', tool });
      }
    }
  };
  document.addEventListener('change', onInteract, { capture: true });
  document.addEventListener('click', onInteract, { capture: true });

  // A view transition is a new page view, so let each tool report again on the next page.
  document.addEventListener('astro:before-swap', () => state.toolsSeen.clear());
}

/**
 * Reduce a "Postcode or area" entry to something safe for analytics.
 *
 * 🔒 LOCKED PRIVACY DECISION #6: only the DISTRICT (the outward code, e.g. "SW1A", "TN35")
 * may ever reach dataLayer/analytics. The FULL postcode identifies a household and stays
 * exclusively in the private n8n path. A free-text area ("Hastings") is not identifying
 * and passes through as typed.
 */
export function toAreaDistrict(raw: string): string {
  const value = (raw || '').trim();
  if (!value) return '';
  const outward = value
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)(?:\s?\d[A-Z]{2})?$/);
  return outward ? outward[1] : value.slice(0, 32);
}
