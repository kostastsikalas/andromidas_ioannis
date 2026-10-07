import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { services } from "@/content/services";
import { locales, site } from "@/content/site";
import { paths } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = (build: (l: (typeof locales)[number]) => string, priority: number) =>
    locales.map((l) => ({
      url: `${site.url}${build(l)}`,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}${build(x)}`])) },
    }));

  return [
    ...entries(paths.home, 1),
    ...entries(paths.contact, 0.9),
    ...entries(paths.doctor, 0.8),
    ...entries(paths.services, 0.8),
    ...services.flatMap((s) => entries((l) => paths.service(l, s.slug), 0.7)),
    ...entries(paths.articles, 0.5),
    ...articles.map((a) => ({ url: `${site.url}${paths.article("el", a.slug)}`, priority: 0.5 })),
  ];
}
