// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL preservation IS the SEO migration (WEBSITE-PLAN.md):
// - format:'file' + trailingSlash:'never' => GH Pages serves every legacy
//   extensionless URL with a direct 200, no server redirects needed.
// - redirects below become meta-refresh stub pages for consolidated slugs.
// - site is the final custom domain (Hostinger); cutover is COMPLETE and the site
//   is LIVE + fully indexable (public/robots.txt = "Allow: /" + sitemap, no noindex).
//   Do NOT re-add a Disallow — that only applied to the pre-cutover preview.
export default defineConfig({
  site: 'https://www.thefairytails.co.uk',
  trailingSlash: 'never',
  // inlineStylesheets 'always': the site's whole CSS is ~12 KB per page — inlining it
  // removes a render-blocking round trip on 4G (2026-07-16 image batch, LCP work).
  build: { format: 'file', inlineStylesheets: 'always' },
  redirects: {
    '/puppy-classes': '/puppy-training-classes',
    '/training-stages': '/dog-boarding-school',
    '/admission-process': '/dog-day-school',
    '/boarding-information': '/dog-boarding-school',
    // Page 7 shipped 2026-07-12: the DIY-course stubs deep-link into their chapter
    // anchors on /puppycourse (ids exist on the page — keep them in sync).
    '/resources-collection': '/puppycourse',
    '/puppy-week-1': '/puppycourse#week-1',
    '/week-2-puppy': '/puppycourse#week-2',
    '/puppy-week-3': '/puppycourse#week-3',
    '/puppy-week-4': '/puppycourse#week-4',
    '/puppy-toilet-schdule': '/puppycourse#toilet-training',
  },
  integrations: [
    sitemap({
      // withastro/astro#15526: with format:'file' the sitemap emits .html URLs;
      // live URLs are extensionless, so strip the extension here.
      serialize(item) {
        item.url = item.url.replace(/\.html$/, '');
        return item;
      },
      // The Breed Matcher is a standalone public/ tool (not an Astro page), so the
      // integration can't discover it — list it so it's indexable too.
      customPages: ['https://www.thefairytails.co.uk/breed-matcher/'],
    }),
  ],
});
