import data from "./announcements.json";

/**
 * Short notices for the home page (holidays, changed hours, …), edited from the admin panel,
 * which rewrites announcements.json.
 */
export type Announcement = {
  id: string;
  /** ISO date (YYYY-MM-DD) it was published; newest first. */
  date: string;
  /** Last day it is shown (YYYY-MM-DD, Athens time); empty = until deleted. */
  until: string;
  /** Highlighted in the accent colour. */
  important: boolean;
  title: { el: string; en: string };
  text: { el: string; en: string };
};

export function sortAnnouncements(list: Announcement[]) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/** Today in Athens as YYYY-MM-DD, regardless of the visitor's timezone. */
export const athensToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());

export const isActive = (a: Announcement, today: string) => !a.until || a.until >= today;

export const announcements: Announcement[] = sortAnnouncements(data as Announcement[]);
