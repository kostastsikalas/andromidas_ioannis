import Link from "next/link";
import type { Dictionary } from "@/content/dictionary";
import { site, type Locale } from "@/content/site";
import { services } from "@/content/services";
import { paths } from "@/lib/paths";
import { navItems } from "./Header";
import { MailIcon, MapPinIcon, PhoneIcon } from "./Icons";
import { LogoMark } from "./Logo";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-auto bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] md:gap-10 md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="font-display font-bold text-white">{site.name[lang]}</p>
              <p className="text-sm text-brand-200">{site.title[lang]}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-[15px]">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
              <span>
                {site.address.street[lang]}, {site.address.city[lang]} {site.address.postalCode}
                <br />
                {site.address.region[lang]}
              </span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
              <span>
                <a href={site.phones.mobile.href} className="hover:text-white">{site.phones.mobile.display}</a>
                {" · "}
                <a href={site.phones.office.href} className="hover:text-white">{site.phones.office.display}</a>
              </span>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-white">{site.email}</a>
            </li>
          </ul>
        </div>

        <div className="hidden md:block">
          <p className="font-display font-semibold text-white">{dict.nav.services}</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={paths.service(lang, s.slug)} className="hover:text-white">{s.title[lang]}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="hidden font-display font-semibold text-white md:block">Menu</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] md:mt-4 md:block md:space-y-2">
            {navItems(lang, dict).map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white">{i.label}</Link>
              </li>
            ))}
            <li>
              <Link href={paths.terms(lang)} className="hover:text-white">{dict.footer.terms}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-brand-300 sm:px-6">
          © {site.name[lang]}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
