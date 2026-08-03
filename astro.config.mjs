// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// ── sitemap <lastmod> ────────────────────────────────────────────────────────────────
// Derived from each page's OWN hand-set `updated` prop — the very same date that renders
// the visible "This page was last reviewed and updated <Month Year>" line and the
// WebPage.dateModified node. The page IS the source, so there is no second list to drift
// out of sync, and no page edit was needed to turn this on.
//
// 🔒 NEVER derive lastmod from the build clock or file mtime. That would stamp the same
//    lie on every URL at once, which is the exact failure CLAUDE.md already bans for the
//    visible date — and it trains Google to ignore the field entirely.
//
// Pages with no `updated` prop deliberately get NO lastmod (/, /contact, /gallery, /blog,
// /terms-and-conditions, every blog post). A partial-but-TRUE sitemap is worth more than a
// complete-but-fabricated one. Blog posts are excluded on purpose: their `updatedDate`
// frontmatter is stale (the London parks post still says 2023 despite being edited since),
// so emitting it would assert "unchanged since 2023" for a page that changed this month.
const PAGES_DIR = 'src/pages';
const walkPages = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walkPages(p);
    return e.isFile() && p.endsWith('.astro') ? [p] : [];
  });

/** @type {Map<string, string>} public pathname -> YYYY-MM-DD */
const lastmodByPath = new Map();
for (const file of walkPages(PAGES_DIR)) {
  const m = readFileSync(file, 'utf8').match(/^\s*updated="(\d{4}-\d{2}-\d{2})"/m);
  if (!m) continue;
  const rel = relative(PAGES_DIR, file).split(sep).join('/').replace(/\.astro$/, '');
  // Under build.format:'file', "<dir>/index" is the route for "<dir>", and bare "index"
  // is the site root. Mirrors the /breed-matcher/ rewrite in serialize() below so the key
  // matches the URL we actually publish.
  let route = rel === 'index' ? '/' : '/' + rel.replace(/\/index$/, '');
  route = route.replace(/\/breed-matcher\/index$/, '/breed-matcher/');
  lastmodByPath.set(route, m[1]);
}

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
        // /breed-matcher/ is the ONE page on the site whose canonical URL keeps a
        // trailing slash, because it is a real directory (dist/breed-matcher/index.html)
        // and has been since the tool shipped. Under build.format:'file' the only source
        // path that emits that directory is src/pages/breed-matcher/index/index.astro —
        // read the header comment in that file before changing either end of this. Its
        // route is therefore /breed-matcher/index, which .htaccess rule 2a 301s onto
        // /breed-matcher/; map it here so the sitemap advertises the URL we actually
        // serve rather than one that redirects.
        item.url = item.url.replace(/\/breed-matcher\/index$/, '/breed-matcher/');
        // Attach lastmod ONLY where a real, hand-maintained date exists (see the map built
        // at the top of this file). Silence is correct for everything else.
        const lastmod = lastmodByPath.get(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
      // (The Breed Matcher used to need a customPages entry because it was a bare
      // public/ file the integration could not discover. It is an Astro page as of
      // 2026-08-03, so it is discovered like every other page — listing it again here
      // would put the same page in the sitemap twice.)
    }),
  ],
});
