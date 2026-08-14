import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/aktuelt/` directory.
  loader: glob({ base: "./src/content/aktuelt", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
    }),
});

const event = defineCollection({
  // Load Markdown and MDX files in the `src/content/event/` directory.
  loader: glob({ base: "./src/content/event", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      startDate: z.coerce.date(),
      venue: z.string(),
      endDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
    }),
});

// Standalone pages whose body is edited in PagesCMS. One entry per page, keyed
// by filename: `om.md` backs `/om`.
const page = defineCollection({
  // Load Markdown and MDX files in the `src/content/page/` directory.
  loader: glob({ base: "./src/content/page", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, event, page };
