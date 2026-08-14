import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const posts = await getCollection("blog");
  const events = await getCollection("event");

  const items = [
    ...posts.map((post) => ({
      ...post.data,
      link: `/aktuelt/${post.id}/`,
    })),
    ...events.map((event) => ({
      ...event.data,
      link: `/arrangement/${event.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
