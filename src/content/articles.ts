import { elEn, type Locale } from "./site";
import data from "./articles.json";

/**
 * Articles are edited from the admin panel (/admin), which rewrites articles.json.
 * Bodies use a tiny text format — see src/lib/article-text.ts.
 */
export type Article = {
  slug: string;
  /** ISO date (YYYY-MM-DD); empty for articles migrated from the old site. */
  date: string;
  title: { el: string; en: string };
  excerpt: { el: string; en: string };
  body: { el: string; en: string };
  image: string;
  imageWidth: number;
  imageHeight: number;
  credit: string;
};

/** Newest first; undated (migrated) articles keep their original order at the end. */
export function sortArticles(list: Article[]) {
  return list
    .map((a, i) => ({ a, i }))
    .sort((x, y) => (y.a.date || "").localeCompare(x.a.date || "") || x.i - y.i)
    .map(({ a }) => a);
}

export const articles: Article[] = sortArticles(data as Article[]);

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Text for a page in `lang`: Greek, or the English text (falling back to Greek) on English and German pages. */
export const localized = (field: { el: string; en: string }, lang: Locale) => elEn(field, lang);

export const hasEnglishBody = (a: Article) => a.body.en.trim().length > 0;
