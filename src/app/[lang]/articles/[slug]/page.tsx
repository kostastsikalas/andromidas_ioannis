import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { articles, getArticle, hasEnglishBody, localized } from "@/content/articles";
import { hasLocale, locales } from "@/content/site";
import { articleLabels } from "@/lib/article-labels";
import { paths } from "@/lib/paths";

// Every slug is prerendered, so serve the full page instead of a streamed skeleton (avoids layout shift).
export const instant = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/articles/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!hasLocale(lang) || !article) return {};
  const translated = hasEnglishBody(article);
  return {
    title: localized(article.title, lang),
    description: localized(article.excerpt, lang),
    // Without an English body both locales show the Greek text, so point search engines at the Greek page.
    alternates: translated
      ? { languages: Object.fromEntries(locales.map((l) => [l, paths.article(l, slug)])) }
      : { canonical: paths.article("el", slug) },
    openGraph: { type: "article", images: [article.image] },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !getArticle(slug)) notFound();
  return <ArticleView lang={lang} slug={slug} initial={articles} labels={articleLabels(lang)} />;
}
