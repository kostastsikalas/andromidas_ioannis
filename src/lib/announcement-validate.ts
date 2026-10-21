import type { Announcement } from "@/content/announcements";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Normalises an announcement coming from the admin panel; returns an error code if it's unusable. */
export function validateAnnouncement(input: unknown): { announcement: Announcement } | { error: string } {
  const a = (input ?? {}) as Record<string, Record<string, unknown> | unknown>;
  const pick = (field: string, lang: "el" | "en", max: number) =>
    text((a[field] as Record<string, unknown> | undefined)?.[lang], max);

  const announcement: Announcement = {
    id: text(a.id, 40),
    date: text(a.date, 10),
    until: text(a.until, 10),
    important: a.important === true,
    title: { el: pick("title", "el", 150), en: pick("title", "en", 150) },
    text: { el: pick("text", "el", 1000), en: pick("text", "en", 1000) },
  };

  if (!/^[a-z0-9-]{4,40}$/.test(announcement.id)) return { error: "invalid_id" };
  if (!isDate(announcement.date) || (announcement.until && !isDate(announcement.until))) return { error: "invalid_date" };
  if (!announcement.title.el) return { error: "missing_title" };
  return { announcement };
}
