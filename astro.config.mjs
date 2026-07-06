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
  build: { format: 'file' },
  redirects: {
    // ⚠ TEMP targets (owner 2026-07-04): /puppycourse is not built yet, so its six
    // legacy stub URLs would land on a 404. FLIP BACK when page 7 ships: the six
    // '/blog' stubs below -> '/puppycourse'.
    '/puppy-classes': '/puppy-training-classes',
    '/training-stages': '/dog-boarding-school',
    '/admission-process': '/dog-day-school',
    '/boarding-information': '/dog-boarding-school',
    '/resources-collection': '/blog',
    '/puppy-week-1': '/blog',
    '/week-2-puppy': '/blog',
    '/puppy-week-3': '/blog',
    '/puppy-week-4': '/blog',
    '/puppy-toilet-schdule': '/blog',
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
