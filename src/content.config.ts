import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// A note on body content: the schemas below describe *frontmatter only*. The
// markdown body — the `body` rich-text field in .pages.yml — is not a
// frontmatter key, so it must not be declared here; Astro carries it on the
// entry itself and it comes out of `render(entry)` as `<Content />`. Adding a
// `body: z.string()` would fail validation on every file.

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  // Note the folder is `blog` while the route is /aktuelt/ — the collection name
  // and the URL are independent, and .pages.yml points PagesCMS at this path.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
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
      endDate: z.coerce.date().optional(),
      venue: z.string(),
      heroImage: z.optional(image()),
    }),
});

// Standalone pages whose body is edited in PagesCMS. One entry per page, keyed
// by filename: `om.mdx` backs `/om`.
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
