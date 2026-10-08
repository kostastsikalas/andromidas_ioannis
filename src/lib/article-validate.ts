import type { Article } from "@/content/articles";
import { isValidSlug, parseArticleText } from "./article-text";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Normalises an article coming from the admin panel; returns an error message if it's unusable. */
export function validateArticle(input: unknown): { article: Article } | { error: string } {
  const a = (input ?? {}) as Record<string, Record<string, unknown> | unknown>;
  const pick = (field: string, lang: "el" | "en", max: number) =>
    text((a[field] as Record<string, unknown> | undefined)?.[lang], max);

  const article: Article = {
    slug: text(a.slug, 80),
    date: text(a.date, 10),
    title: { el: pick("title", "el", 200), en: pick("title", "en", 200) },
    excerpt: { el: pick("excerpt", "el", 400), en: pick("excerpt", "en", 400) },
    body: { el: pick("body", "el", 40000), en: pick("body", "en", 40000) },
    image: text(a.image, 300),
    imageWidth: Math.round(Number(a.imageWidth)) || 1600,
    imageHeight: Math.round(Number(a.imageHeight)) || 1200,
    credit: text(a.credit, 200),
  };

  if (!isValidSlug(article.slug)) return { error: "invalid_slug" };
  if (article.date && !/^\d{4}-\d{2}-\d{2}$/.test(article.date)) return { error: "invalid_date" };
  if (!article.title.el) return { error: "missing_title" };
  if (!article.body.el) return { error: "missing_body" };
  if (!/^\/(images|storage\/uploads)\/[\w./-]+\.(jpe?g|png|webp)$/i.test(article.image)) return { error: "missing_image" };
  if (!article.excerpt.el) article.excerpt.el = plainExcerpt(article.body.el);
  if (article.body.en && !article.excerpt.en) article.excerpt.en = plainExcerpt(article.body.en);
  return { article };
}

/** First ~160 characters of the text, without formatting marks. */
function plainExcerpt(body: string) {
  const first = parseArticleText(body).find((b) => b.type === "p");
  const plain = (first && "text" in first ? first.text : "").replace(/\*\*/g, "");
  return plain.length > 160 ? `${plain.slice(0, 157).replace(/\s+\S*$/, "")}…` : plain;
}
