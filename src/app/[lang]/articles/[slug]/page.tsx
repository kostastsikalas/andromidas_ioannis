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
    // Title and description follow the language the article text is shown in.
    title: localized(article.title, translated ? lang : "el"),
    description: localized(article.excerpt, translated ? lang : "el"),
    // Articles exist in Greek and sometimes English; German pages show one of those, so they point
    // search engines at the page with the original text instead of competing with it.
    alternates: !translated
      ? { canonical: paths.article("el", slug) }
      : lang === "de"
        ? { canonical: paths.article("en", slug) }
        : { languages: { el: paths.article("el", slug), en: paths.article("en", slug) } },
    openGraph: { type: "article", images: [article.image] },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !getArticle(slug)) notFound();
  return <ArticleView lang={lang} slug={slug} initial={articles} labels={articleLabels(lang)} />;
}
