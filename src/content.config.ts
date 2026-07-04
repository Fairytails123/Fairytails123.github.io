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
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['Puppies', 'Behaviour', 'Training Methods', 'Health & Care']),
      heroImage: image(),
      heroAlt: z.string().default(''),
    }),
});

export const collections = { blog };
