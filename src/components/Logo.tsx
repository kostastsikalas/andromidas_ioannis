import type { Locale } from "@/content/site";
import { site } from "@/content/site";

/** Simplified vector version of the clinic's cross-and-circles mark. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M17 3h14a2 2 0 0 1 2 2v10h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H33v10a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V33H5a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h10V5a2 2 0 0 1 2-2Z"
        fill="var(--color-accent-500)"
      />
      <g fill="#dbe6ee" fillOpacity="0.92" stroke="#fff" strokeWidth="1.5">
        <circle cx="19" cy="19.5" r="8" />
        <circle cx="29" cy="19.5" r="8" />
        <circle cx="24" cy="28.5" r="9" />
      </g>
      <g fill="none" stroke="var(--color-brand-900)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M16.5 22a3.5 3.5 0 1 1 5-3c0 1.6-1.6 2-1.6 3.4" />
        <path d="M30 14c0 2-1.5 3.5-1 5l1.6 1.4-1.3.6" />
        <path d="M19.5 31c2 2.2 5 3 8.5 1.5" />
      </g>
    </svg>
  );
}

export function Logo({ lang }: { lang: Locale }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="min-w-0 leading-tight">
        <span className="block font-display text-[15px] font-bold text-brand-900 sm:text-base">
          {site.name[lang]}
        </span>
        <span className="block truncate text-[12px] text-muted sm:hidden">{site.shortTitle[lang]}</span>
        <span className="hidden text-xs text-muted sm:block">{site.title[lang]}</span>
      </span>
    </span>
  );
}
