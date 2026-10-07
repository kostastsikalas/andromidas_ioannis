import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/ui";
import { articles } from "@/content/articles";
import { getDictionary } from "@/content/dictionary";
import { hasLocale } from "@/content/site";
import { paths } from "@/lib/paths";

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
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={paths.article(lang, a.slug)} className="group block h-full overflow-hidden rounded-3xl border border-line bg-white transition hover:shadow-lg hover:shadow-brand-900/5">
                <div className="relative aspect-[16/10] bg-brand-50">
                  <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-lg font-bold text-brand-900">{a.title[lang]}</h2>
                  <p className="mt-1.5 text-[15px] text-muted" lang="el">{a.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
