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
    '/puppy-classes': '/puppy-training-classes',
    '/training-stages': '/dog-boarding-school',
    '/admission-process': '/dog-day-school',
    '/boarding-information': '/dog-day-school',
    '/resources-collection': '/puppycourse',
    '/puppy-week-1': '/puppycourse',
    '/week-2-puppy': '/puppycourse',
    '/puppy-week-3': '/puppycourse',
    '/puppy-week-4': '/puppycourse',
    '/puppy-toilet-schdule': '/puppycourse',
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
