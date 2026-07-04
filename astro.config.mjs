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
    // ⚠ TEMP targets (owner 2026-07-04): the real targets /puppy-training-classes
    // and /puppycourse are not built yet, so these legacy URLs would land on a 404.
    // FLIP BACK when pages 4-7 ship: '/puppy-classes' -> '/puppy-training-classes',
    // and the six stubs below -> '/puppycourse'.
    '/puppy-classes': '/#Trainingplans',
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
