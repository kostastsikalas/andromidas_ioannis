import Link from "next/link";
import type { Dictionary } from "@/content/dictionary";
import { mapsDirectionsUrl, site, type Locale } from "@/content/site";
import { paths } from "@/lib/paths";
import { CalendarIcon, MapPinIcon, PhoneIcon } from "./Icons";

/** Thumb-reachable quick actions, shown on phones only. */
export function MobileActionBar({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[12px] font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(16,40,56,0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto flex h-[4.5rem] max-w-md items-stretch gap-2 px-3 py-2">
        <a href={site.phones.mobile.href} className={`${item} rounded-2xl bg-accent-500 text-white`}>
          <PhoneIcon className="h-5 w-5" />
          {dict.cta.call}
        </a>
        <Link href={paths.appointment(lang)} className={`${item} rounded-2xl text-brand-700 hover:bg-brand-50`}>
          <CalendarIcon className="h-5 w-5" />
          {dict.cta.appointment}
        </Link>
        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} rounded-2xl text-brand-700 hover:bg-brand-50`}
        >
          <MapPinIcon className="h-5 w-5" />
          {dict.cta.directions}
        </a>
      </div>
    </nav>
  );
}
