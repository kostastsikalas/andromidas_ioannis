import type { Locale } from "@/content/site";

export const paths = {
  home: (l: Locale) => `/${l}`,
  doctor: (l: Locale) => `/${l}/doctor`,
  services: (l: Locale) => `/${l}/services`,
  service: (l: Locale, slug: string) => `/${l}/services/${slug}`,
  articles: (l: Locale) => `/${l}/articles`,
  article: (l: Locale, slug: string) => `/${l}/articles/${slug}`,
  contact: (l: Locale) => `/${l}/contact`,
  appointment: (l: Locale) => `/${l}/contact#appointment`,
  terms: (l: Locale) => `/${l}/terms`,
};

export const otherLocale = (l: Locale): Locale => (l === "el" ? "en" : "el");
