"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { athensToday, isActive, sortAnnouncements, type Announcement } from "@/content/announcements";
import { localeInfo, type Locale } from "@/content/site";
import { runtimeConfig } from "@/lib/runtime-config";
import { MegaphoneIcon } from "./Icons";

/** English (also on German pages) only when the doctor wrote an English title; otherwise the whole Greek notice. */
const inLang = (a: Announcement, lang: Locale) =>
  lang !== "el" && a.title.en ? { title: a.title.en, text: a.text.en } : { title: a.title.el, text: a.text.el };

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60 * 60_000);
  return () => clearInterval(id);
};

/**
 * Home-page notices, shown above the articles as cards. Build-time list first; the static PHP
 * version then swaps in the latest one saved from the admin. Expired notices are hidden in the
 * browser, so they disappear on their last day even without a rebuild. Renders nothing when there
 * are no current notices.
 */
export function AnnouncementsSection({ lang, initial, title }: { lang: Locale; initial: Announcement[]; title: ReactNode }) {
  const [list, setList] = useState(initial);
  const today = useSyncExternalStore(subscribe, athensToday, () => null);

  useEffect(() => {
    const endpoint = runtimeConfig.liveAnnouncementsEndpoint;
    if (!endpoint) return;
    let cancelled = false;
    fetch(endpoint, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { announcements?: Announcement[] }) => {
        if (!cancelled && Array.isArray(data.announcements)) setList(sortAnnouncements(data.announcements));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = today ? list.filter((a) => isActive(a, today)) : list;
  if (!visible.length) return null;

  return (
    <div className="mb-14 sm:mb-20">
      <h2 className="mb-8 font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">{title}</h2>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => {
          const { title: heading, text } = inLang(a, lang);
          return (
            <li
              key={a.id}
              className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white ${
                a.important ? "border-accent-500/30" : "border-line"
              }`}
            >
              <div className={`flex items-center gap-3 px-5 py-3 ${a.important ? "bg-accent-500 text-white" : "bg-brand-50 text-brand-700"}`}>
                <MegaphoneIcon className="h-5 w-5 shrink-0" />
                <time dateTime={a.date} className="text-sm font-semibold">
                  {new Date(a.date).toLocaleDateString(localeInfo[lang].tag, { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-bold leading-snug text-brand-900">{heading}</p>
                {text && <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-muted">{text}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
