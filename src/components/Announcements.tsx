"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { athensToday, isActive, sortAnnouncements, type Announcement } from "@/content/announcements";
import type { Locale } from "@/content/site";
import { runtimeConfig } from "@/lib/runtime-config";
import { MegaphoneIcon } from "./Icons";
import { Container } from "./ui";

/** English (also on German pages) only when the doctor wrote an English title; otherwise the whole Greek notice. */
const inLang = (a: Announcement, lang: Locale) =>
  lang !== "el" && a.title.en ? { title: a.title.en, text: a.text.en } : { title: a.title.el, text: a.text.el };

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60 * 60_000);
  return () => clearInterval(id);
};

/**
 * Home-page notices. Build-time list first; the static PHP version then swaps in the latest
 * one saved from the admin. Expired notices are hidden in the browser, so they disappear on
 * their last day even without a rebuild.
 */
export function Announcements({ lang, initial, label }: { lang: Locale; initial: Announcement[]; label: string }) {
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
    <section aria-label={label} className="pt-4 sm:pt-8">
      <Container>
        <ul className="space-y-3">
          {visible.map((a) => {
            const { title, text } = inLang(a, lang);
            return (
              <li
                key={a.id}
                className={`flex gap-3.5 rounded-2xl border p-4 sm:gap-4 sm:p-5 ${
                  a.important ? "border-accent-500/25 bg-accent-500/10" : "border-brand-100 bg-white/90"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    a.important ? "bg-accent-500 text-white" : "bg-white text-brand-600 ring-1 ring-brand-100"
                  }`}
                >
                  <MegaphoneIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 self-center">
                  <p className={`font-display font-bold leading-snug ${a.important ? "text-accent-600" : "text-brand-900"}`}>
                    {title}
                  </p>
                  {text && <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{text}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
