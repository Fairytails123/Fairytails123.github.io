/* ===========================================================================
   Breed Matcher — SERVICE LINKS
   ---------------------------------------------------------------------------
   The bridges and tips in engine.js name the service that closes each gap, so
   the engine builds anchor HTML through svc(). This module holds those links.

   ⚠️ PLAIN JS ON PURPOSE — no imports from src/data/business.ts. The node test
   harness imports engine.js (which imports this file) directly, and node cannot
   load a .ts module.

   Two consequences of that constraint, both deliberate:

   1. INTERNAL links are RELATIVE PATHS, not absolute URLs. They are our own
      slugs, they resolve identically on the live site, the preview and inside
      the homepage iframe, and there is no domain literal to go stale.
   2. The GROOMING link is a SISTER SITE — an external URL, which is business
      data (`business.groomingSite`). It is therefore NOT hard-coded here: the
      Astro page renders it onto #bm-root as data-grooming-url and ui.js calls
      setGroomingUrl() at init, so src/data/business.ts stays the single source
      of truth. If that ever fails to arrive the link falls back to /contact —
      a real page that gets the enquiry to the same place — rather than a dead
      href or a second copy of the URL living in this file.

   🔒 EVERY KEY BELOW MUST BE A SERVICE WE ACTUALLY SELL (src/data/pricing.json).
   A key here becomes a sentence that says "our <thing>" with a link on it, which
   is a product claim — the honesty gate applies to it exactly as it does to page
   copy. Do not add a key for something we might do, or that a page merely
   mentions; add it after it exists in pricing.json.

   ✅ SECURE FIELD HIRE — ANSWERED BY THE OWNER 2026-08-03: **WE DO NOT OFFER IT.**
   "We don't have secure field service — we don't offer that." So the `field:` key
   that used to sit here ("secure field hire", linked to /contact as an ask-us) was
   a product claim for a product that does not exist, and it had been live in this
   tool since ~June 2026. It is GONE and **must never be re-added.**

   🔒 What is still allowed, and why: the two space bridges in engine.js suggest
   hiring a field as GENERIC advice — unlinked, unclaimed, not attributed to us.
   That is honest (plenty of owners do hire one) and useful to a reader whose dog
   needs more space than their garden gives. `data.js` also keeps "I'd happily
   travel or hire a secure field" as an ANSWER OPTION — that is the visitor
   describing their own access, not us offering anything, and it feeds
   effectiveSpace(). Neither is a claim. **The line is: describing a thing the
   owner might do = fine; presenting it as "our <thing>" with a link = a product
   claim, and it needs a pricing.json entry first.**
   =========================================================================== */

export const FT = {
  daycare:    { label: "doggy daycare",             url: "/dog-day-school" },
  puppy:      { label: "puppy training course",     url: "/puppy-training-classes" },
  intensive:  { label: "intensive training",        url: "/intensive-dog-training" },
  grooming:   { label: "grooming salon",            url: "/contact", external: true }, // set by setGroomingUrl()
  walking:    { label: "dog walking",               url: "/dog-day-school" }, // day-school add-on: pricing.json day-full/day-half-am features
  boarding:   { label: "boarding",                  url: "/dog-boarding-school" },
  chat:       { label: "a “thinking of getting a dog” chat", url: "/contact" },
};

/**
 * Point the grooming bridge at the salon's sister site.
 * @param {string|undefined|null} url from business.groomingSite, via the page.
 */
export function setGroomingUrl(url) {
  if (typeof url === "string" && /^https?:\/\//.test(url)) FT.grooming.url = url;
}

/**
 * Render a service link. External (sister-site) links open in a new tab; our own
 * pages navigate normally so they behave like ordinary internal links — ui.js
 * retargets them to _top when the page is running inside the homepage iframe.
 * @param {keyof typeof FT} key
 * @param {string} [text] link text, defaults to the service label
 */
export function svc(key, text) {
  const s = FT[key];
  if (!s) return text || "";
  const attrs = s.external ? ' target="_blank" rel="noopener"' : "";
  return `<a href="${s.url}"${attrs}>${text || s.label}</a>`;
}
