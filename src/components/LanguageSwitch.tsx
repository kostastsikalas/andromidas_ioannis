"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeInfo, locales, type Locale } from "@/content/site";
import { paths } from "@/lib/paths";
import { GlobeIcon } from "./Icons";

function swapLocale(pathname: string, to: Locale) {
  const [, , ...rest] = pathname.split("/");
  return `/${[to, ...rest].join("/")}`.replace(/\/$/, "");
}

/** EL · EN · DE, with the current language highlighted. */
function Switch({ lang, label, href }: { lang: Locale; label: string; href: (to: Locale) => string }) {
  return (
    <nav
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-full border border-line p-1 text-sm font-semibold text-ink/70"
    >
      <GlobeIcon className="mx-1 hidden h-4 w-4 text-ink/50 xl:block" />
      {locales.map((l) =>
        l === lang ? (
          <span key={l} aria-current="true" className="rounded-full bg-brand-600 px-2.5 py-1 text-white">
            {localeInfo[l].short}
          </span>
        ) : (
          <Link
            key={l}
            href={href(l)}
            hrefLang={l}
            lang={l}
            title={localeInfo[l].label}
            aria-label={localeInfo[l].label}
            className="rounded-full px-2.5 py-1 transition hover:bg-brand-50 hover:text-brand-700"
          >
            {localeInfo[l].short}
          </Link>
        ),
      )}
    </nav>
  );
}

export function LanguageSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname();
  return <Switch lang={lang} label={label} href={(to) => swapLocale(pathname, to)} />;
}

export function LanguageSwitchFallback({ lang, label }: { lang: Locale; label: string }) {
  return <Switch lang={lang} label={label} href={paths.home} />;
}
