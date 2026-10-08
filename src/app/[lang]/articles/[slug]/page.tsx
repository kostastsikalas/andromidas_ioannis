import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhoneIcon } from "@/components/Icons";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { articles, getArticle } from "@/content/articles";
import { getDictionary } from "@/content/dictionary";
import { hasLocale, locales, site } from "@/content/site";
import { paths } from "@/lib/paths";

export function generateStaticParams() {
  return locales.flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/articles/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!hasLocale(lang) || !article) return {};
  return {
    title: article.title[lang],
    description: article.excerpt,
    // The body is Greek in both locales, so point search engines at the Greek page.
    alternates: { canonical: paths.article("el", slug) },
    openGraph: { type: "article", images: [article.image] },
  };
}

// Every slug is prerendered, so serve the full page instead of a streamed skeleton (avoids layout shift).
export const instant = false;

export default async function ArticlePage({ params }: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!hasLocale(lang) || !article) notFound();
  const dict = getDictionary(lang);
  const more = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        title={article.title.el}
        crumbs={[
          { href: paths.home(lang), label: dict.nav.home },
          { href: paths.articles(lang), label: dict.nav.articles },
        ]}
      />
      <Container className="py-10 sm:py-14">
        <article lang="el" className="mx-auto max-w-3xl">
          {dict.articles.greekOnly && (
            <p lang={lang} className="mb-6 rounded-2xl bg-brand-50 p-4 text-brand-800">{dict.articles.greekOnly}</p>
          )}
          <figure className="overflow-hidden rounded-3xl bg-brand-50">
            <Image src={article.image} alt="" width={article.imageWidth} height={article.imageHeight} priority sizes="(min-width: 768px) 48rem, 100vw" className="max-h-[26rem] w-full object-cover" />
          </figure>
          <p className="mt-2 text-xs text-muted">{dict.articles.photoCredit}: {article.credit}</p>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
            {article.body.map((block, i) =>
              typeof block === "string" ? (
                <p key={i}>{block}</p>
              ) : (
                <ul key={i} className="space-y-2 rounded-2xl border border-line bg-white p-5">
                  {block.list.map((li) => (
                    <li key={li} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {li}
                    </li>
                  ))}
                </ul>
              ),
            )}
          </div>

          <p className="mt-10 border-t border-line pt-6 text-sm italic text-muted">{getDictionary("el").articles.disclaimer}</p>

          <div lang={lang} className="mt-8 flex flex-col gap-4 rounded-3xl bg-brand-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-lg font-bold">{dict.cta.bookAppointment}</p>
            <ButtonLink href={site.phones.mobile.href}>
              <PhoneIcon className="h-5 w-5" /> {site.phones.mobile.display}
            </ButtonLink>
          </div>
        </article>

        <div lang={lang} className="mx-auto mt-14 max-w-3xl">
          <p className="mb-4 font-display text-lg font-bold text-brand-900">{dict.cta.allArticles}</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {more.map((a) => (
              <li key={a.slug}>
                <Link href={paths.article(lang, a.slug)} className="block h-full rounded-2xl border border-line bg-white p-4 font-medium text-brand-900 transition hover:border-brand-200 hover:shadow">
                  {a.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
