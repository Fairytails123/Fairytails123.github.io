import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Legacy blog migration (WEBSITE-PLAN.md page 8): filename = legacy root-level
// slug, pubDate/updatedDate = the ORIGINAL Duda-site dates (the posts were
// written 2020-2025 and must keep that history — SEO + honesty).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Optional <title>-tag override (used verbatim, no brand suffix) for posts
      // whose display title exceeds ~60 chars — keeps the SERP title tidy while
      // the visible H1 (title) stays as the original. Added 2026-07-14 (Ahrefs
      // "Title too long" batch). Falls back to `${title} | The Fairy Tails K9 Centre`.
      seoTitle: z.string().optional(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['Puppies', 'Behaviour', 'Training Methods', 'Health & Care', 'Careers']),
      // Optional per-post override for the foot-of-post service CTA card. Replaces
      // the category-default CTA (ctas[category] in [slug].astro) so a post can be
      // routed into a more relevant money funnel than its category implies — e.g.
      // the London dog-parks post (category Health & Care, which defaults to day
      // school) routes to /london instead. Added 2026-07-15 (SEO money-funnel
      // routing); mirrors the seoTitle override pattern. All four fields required.
      ctaOverride: z
        .object({
          heading: z.string(),
          line: z.string(),
          href: z.string(),
          label: z.string(),
        })
        .optional(),
      heroImage: image(),
      heroAlt: z.string().default(''),
    }),
});

export const collections = { blog };
