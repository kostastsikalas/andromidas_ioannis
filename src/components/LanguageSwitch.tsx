"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/site";
import { otherLocale, paths } from "@/lib/paths";
import { GlobeIcon } from "./Icons";

const className =
  "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-medium text-ink/80 transition hover:border-brand-200 hover:bg-brand-50";

function swapLocale(pathname: string, to: Locale) {
  const [, , ...rest] = pathname.split("/");
  return `/${[to, ...rest].join("/")}`.replace(/\/$/, "");
}

export function LanguageSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname();
  const to = otherLocale(lang);
  return (
    <Link href={swapLocale(pathname, to)} hrefLang={to} lang={to} className={className}>
      <GlobeIcon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function LanguageSwitchFallback({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const to = otherLocale(lang);
  return (
    <Link href={paths.home(to)} hrefLang={to} lang={to} className={className}>
      <GlobeIcon className="h-4 w-4" />
      {label}
    </Link>
  );
}
