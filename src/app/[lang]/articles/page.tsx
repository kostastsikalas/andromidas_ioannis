import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCards } from "@/components/ArticleCards";
import { Container, PageHeader } from "@/components/ui";
import { articles } from "@/content/articles";
import { getDictionary } from "@/content/dictionary";
import { hasLocale } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/articles">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return { title: d.articles.title, description: d.articles.intro };
}

export default async function ArticlesPage({ params }: PageProps<"/[lang]/articles">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageHeader title={dict.articles.title} intro={dict.articles.intro} />
      <Container className="py-12 sm:py-16">
        {dict.articles.greekOnly && (
          <p className="mb-8 rounded-2xl bg-brand-50 p-4 text-brand-800">{dict.articles.greekOnly}</p>
        )}
        <ArticleCards lang={lang} initial={articles} variant="list" />
      </Container>
    </>
  );
}
