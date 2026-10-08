"use client";

import Image from "next/image";
import Link from "next/link";
import { localized, type Article } from "@/content/articles";
import type { Locale } from "@/content/site";
import { useLiveArticles } from "@/lib/use-live-articles";
import { paths } from "@/lib/paths";

type Props = { lang: Locale; initial: Article[]; variant: "home" | "list" };

export function ArticleCards({ lang, initial, variant }: Props) {
  const all = useLiveArticles(initial);

  if (variant === "home") {
    return (
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:scroll-px-0 md:px-0">
        {all.slice(0, 3).map((a) => (
          <li key={a.slug} className="w-72 shrink-0 snap-start md:w-auto">
            <Link
              href={paths.article(lang, a.slug)}
              className="group block h-full overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div className="relative aspect-[16/10] bg-brand-50">
                <Image src={a.image} alt="" fill sizes="(min-width: 768px) 30vw, 288px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <p className="font-display font-bold text-brand-900">{localized(a.title, lang)}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{localized(a.excerpt, lang)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {all.map((a) => (
        <li key={a.slug}>
          <Link
            href={paths.article(lang, a.slug)}
            className="group block h-full overflow-hidden rounded-3xl border border-line bg-white transition hover:shadow-lg hover:shadow-brand-900/5"
          >
            <div className="relative aspect-[16/10] bg-brand-50">
              <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="p-5">
              <h2 className="font-display text-lg font-bold text-brand-900">{localized(a.title, lang)}</h2>
              <p className="mt-1.5 line-clamp-3 text-[15px] text-muted">{localized(a.excerpt, lang)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
