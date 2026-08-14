// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Everything canonical — Open Graph URLs, the sitemap, the RSS feed — is
  // derived from this. It is still the placeholder from the starter template
  // and MUST be set to the real domain before deploying, or every share card
  // and sitemap entry will point at example.com.
  site: "https://example.com",
  integrations: [
    mdx(),
    sitemap({
      // The manifest is a data route, not a page — keep it out of the sitemap.
      filter: (page) => !page.endsWith("/site.webmanifest"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // The front page is the entry point; listings update as content is
        // added; individual posts and events settle once published.
        if (item.url.endsWith("/")) {
          const path = new URL(item.url).pathname;
          if (path === "/") {
            return { ...item, changefreq: "daily", priority: 1.0 };
          }
          if (path === "/aktuelt/" || path === "/arrangement/") {
            return { ...item, changefreq: "daily", priority: 0.8 };
          }
        }
        return item;
      },
    }),
    react(),
  ],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
