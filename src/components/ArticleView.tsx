"use client";

import Image from "next/image";
import Link from "next/link";
import { hasEnglishBody, localized, type Article } from "@/content/articles";
import type { Locale } from "@/content/site";
import { useLiveArticles } from "@/lib/use-live-articles";
import { paths } from "@/lib/paths";
import { ArticleBody } from "./ArticleBody";
import { PhoneIcon } from "./Icons";

export type ArticleViewLabels = {
  home: string;
  articles: string;
  greekOnly: string;
  photoCredit: string;
  disclaimerEl: string;
  disclaimerEn: string;
  bookAppointment: string;
  more: string;
  notFound: string;
  phone: { href: string; display: string };
};

type Props = {
  lang: Locale;
  slug: string;
  initial: Article[];
  labels: ArticleViewLabels;
};

export function ArticleView({ lang, slug, initial, labels }: Props) {
  const all = useLiveArticles(initial);
  const article = all.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="font-display text-2xl font-bold text-brand-900">{labels.notFound}</p>
        <Link href={paths.articles(lang)} className="mt-6 inline-block font-semibold text-brand-600">
          {labels.articles}
        </Link>
      </div>
    );
  }

  const english = lang === "en" && hasEnglishBody(article);
  const bodyLang: Locale = english ? "en" : "el";
  const more = all.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-brand-100/60 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
            <Link href={paths.home(lang)} className="hover:text-brand-700">{labels.home}</Link>
            <span className="mx-2">/</span>
            <Link href={paths.articles(lang)} className="hover:text-brand-700">{labels.articles}</Link>
          </nav>
          <h1 lang={bodyLang} className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brand-900 text-balance sm:text-4xl md:text-5xl">
            {localized(article.title, english ? "en" : "el")}
          </h1>
          {article.date && (
            <p className="mt-3 text-sm text-muted">
              {new Date(article.date).toLocaleDateString(lang === "el" ? "el-GR" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <article lang={bodyLang} className="mx-auto max-w-3xl">
          {lang === "en" && !english && (
            <p lang="en" className="mb-6 rounded-2xl bg-brand-50 p-4 text-brand-800">{labels.greekOnly}</p>
          )}
          <figure className="overflow-hidden rounded-3xl bg-brand-50">
            <Image
              src={article.image}
              alt=""
              width={article.imageWidth}
              height={article.imageHeight}
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className="max-h-[26rem] w-full object-cover"
            />
          </figure>
          {article.credit && (
            <p className="mt-2 text-xs text-muted">
              {labels.photoCredit}: {article.credit}
            </p>
          )}

          <div className="mt-8">
            <ArticleBody text={article.body[bodyLang]} />
          </div>

          <p className="mt-10 border-t border-line pt-6 text-sm italic text-muted">
            {english ? labels.disclaimerEn : labels.disclaimerEl}
          </p>

          <div lang={lang} className="mt-8 flex flex-col gap-4 rounded-3xl bg-brand-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-lg font-bold">{labels.bookAppointment}</p>
            <a
              href={labels.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-accent-600"
            >
              <PhoneIcon className="h-5 w-5" /> {labels.phone.display}
            </a>
          </div>
        </article>

        {more.length > 0 && (
          <div lang={lang} className="mx-auto mt-14 max-w-3xl">
            <p className="mb-4 font-display text-lg font-bold text-brand-900">{labels.more}</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {more.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={paths.article(lang, a.slug)}
                    className="block h-full rounded-2xl border border-line bg-white p-4 font-medium text-brand-900 transition hover:border-brand-200 hover:shadow"
                  >
                    {localized(a.title, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
