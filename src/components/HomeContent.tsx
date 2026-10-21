"use client";

import type { HomeContent } from "@/content/home";
import type { Locale } from "@/content/site";
import { useHome } from "@/lib/use-home";
import { ServiceGlyph } from "./Icons";

/**
 * Editable home-page texts (see useHome). Each piece is a small client component so the page itself
 * stays server-rendered.
 */

type TextField = { [K in keyof HomeContent]: HomeContent[K] extends string ? K : never }[keyof HomeContent];

export function HomeText({ lang, field }: { lang: Locale; field: TextField }) {
  return <>{useHome(lang)[field]}</>;
}

const highlightIcons = ["child", "ear", "home"] as const;

export function HomeHighlights({ lang }: { lang: Locale }) {
  return (
    <ul className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-6">
      {useHome(lang).highlights.map((h, i) => (
        <li
          key={i}
          className="flex flex-col items-center rounded-2xl border border-white bg-white/70 px-2 py-3.5 text-center shadow-sm sm:items-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-left sm:shadow-none"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 sm:mb-2">
            <ServiceGlyph icon={highlightIcons[i % highlightIcons.length]} className="h-5 w-5" />
          </span>
          <p className="mt-2 text-[13px] font-semibold leading-tight text-ink sm:mt-0 sm:text-base">{h.title}</p>
          <p className="hidden text-sm text-muted sm:block">{h.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function HomeAbout({ lang }: { lang: Locale }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-ink/85">
      {useHome(lang).aboutText.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
