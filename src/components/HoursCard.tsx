import type { Dictionary } from "@/content/dictionary";
import { displayWeek, openingHours, site, weekdayNames, type Locale } from "@/content/site";
import { ClockIcon } from "./Icons";
import { OpenBadge, TodayMarker } from "./OpenStatus";

export function HoursCard({ lang, dict, className = "" }: { lang: Locale; dict: Dictionary; className?: string }) {
  return (
    <div className={`rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-7 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900">
          <ClockIcon className="h-5 w-5 text-brand-500" />
          {dict.hours.title}
        </h3>
        <OpenBadge openLabel={dict.hours.openNow} closedLabel={dict.hours.closedNow} />
      </div>
      <p className="mt-1 text-sm text-muted">{dict.hours.byAppointment}</p>

      <dl className="mt-5 divide-y divide-line text-[15px]">
        {displayWeek.map((day) => {
          const slots = openingHours[day];
          return (
            <div key={day} className="flex items-start justify-between gap-4 py-2.5">
              <dt className="font-medium text-ink">
                {weekdayNames[lang][day]}
                <TodayMarker day={day} label={dict.hours.today} />
              </dt>
              <dd className={`text-right tabular-nums ${slots ? "text-ink" : "text-muted"}`}>
                {slots ? slots.map(([a, b]) => <span key={a} className="block">{a} – {b}</span>) : dict.hours.closed}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-5 rounded-2xl bg-accent-500/[0.07] p-4 text-sm text-ink">
        {dict.hours.emergencies}{" "}
        <a href={site.phones.mobile.href} className="font-bold text-accent-600 underline-offset-2 hover:underline">
          {site.phones.mobile.display}
        </a>
      </p>
    </div>
  );
}
