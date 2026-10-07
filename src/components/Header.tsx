import Link from "next/link";
import { Suspense } from "react";
import type { Dictionary } from "@/content/dictionary";
import { site, type Locale } from "@/content/site";
import { paths } from "@/lib/paths";
import { PhoneIcon } from "./Icons";
import { LanguageSwitch, LanguageSwitchFallback } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function navItems(lang: Locale, dict: Dictionary) {
  return [
    { href: paths.home(lang), label: dict.nav.home },
    { href: paths.doctor(lang), label: dict.nav.doctor },
    { href: paths.services(lang), label: dict.nav.services },
    { href: paths.articles(lang), label: dict.nav.articles },
    { href: paths.contact(lang), label: dict.nav.contact },
  ];
}

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items = navItems(lang, dict);
  const fallbackSwitch = (
    <LanguageSwitchFallback lang={lang} label={dict.language.switchTo} />
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href={paths.home(lang)} className="min-w-0" aria-label={site.name[lang]}>
          <Logo lang={lang} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {items.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[15px] font-medium text-ink/80 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <Suspense fallback={fallbackSwitch}>
              <LanguageSwitch lang={lang} label={dict.language.switchTo} />
            </Suspense>
          </div>
          <a
            href={site.phones.mobile.href}
            className="hidden items-center gap-2 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 md:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phones.mobile.display}
          </a>
          <MobileMenu
            items={items}
            openLabel={dict.menu.open}
            closeLabel={dict.menu.close}
            languageSwitch={
              <Suspense fallback={fallbackSwitch}>
                <LanguageSwitch lang={lang} label={dict.language.switchTo} />
              </Suspense>
            }
            footer={
              <div className="space-y-1 text-sm text-muted">
                <p className="font-semibold text-ink">{dict.hours.title}</p>
                <p>{dict.hours.byAppointment}</p>
                <a href={site.phones.mobile.href} className="block font-semibold text-brand-700">
                  {site.phones.mobile.display}
                </a>
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
