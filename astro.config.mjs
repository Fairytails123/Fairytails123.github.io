// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL preservation IS the SEO migration (WEBSITE-PLAN.md):
// - format:'file' + trailingSlash:'never' => GH Pages serves every legacy
//   extensionless URL with a direct 200, no server redirects needed.
// - redirects below become meta-refresh stub pages for consolidated slugs.
// - site stays the final custom domain; preview indexing is blocked by robots.txt
//   until cutover (Stage 5).
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
    }),
  ],
});
