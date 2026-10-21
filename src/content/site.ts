import { clinic, telHref } from "./clinic";

export const locales = ["el", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized<T = string> = Record<Locale, T>;

/** Names and tags per language: `short` for the switcher, `tag` for dates, `og` for Open Graph. */
export const localeInfo: Record<Locale, { label: string; short: string; tag: string; og: string }> = {
  el: { label: "Ελληνικά", short: "EL", tag: "el-GR", og: "el_GR" },
  en: { label: "English", short: "EN", tag: "en-GB", og: "en_GB" },
  de: { label: "Deutsch", short: "DE", tag: "de-DE", og: "de_DE" },
};

/**
 * Content edited in the admin (articles, announcements, address) has Greek and English only.
 * English and German pages show the English text when there is one, otherwise the Greek.
 */
export function elEn<T extends string | string[]>(field: { el: T; en: T }, lang: Locale): T {
  if (lang === "el") return field.el;
  return field.en.length && (typeof field.en !== "string" || field.en.trim()) ? field.en : field.el;
}

/** Which language admin-edited text is actually shown in on a page of language `lang`. */
export const elEnShown = (field: { el: string; en: string }, lang: Locale): "el" | "en" =>
  lang !== "el" && field.en.trim() ? "en" : "el";

export const site = {
  url: "https://ioannisandromidas.gr",
  name: {
    el: "Ιωάννης Ν. Ανδρομιδάς",
    en: "Ioannis N. Andromidas",
    de: "Ioannis N. Andromidas",
  },
  title: {
    el: "Χειρουργός Ωτορινολαρυγγολόγος Ενηλίκων & Παίδων",
    en: "ENT Surgeon – Adults & Children",
    de: "Facharzt für HNO-Heilkunde – Erwachsene & Kinder",
  },
  shortTitle: {
    el: "Ωτορινολαρυγγολόγος · Χερσόνησος",
    en: "ENT Surgeon · Hersonissos",
    de: "HNO-Arzt · Chersonissos",
  },
  /**
   * Build-time copy of the editable contact details (src/content/clinic.json), for metadata,
   * structured data and emails. Visible UI reads them through useClinic() instead.
   */
  phones: {
    mobile: { display: clinic.phones.mobile, href: telHref(clinic.phones.mobile) },
    office: { display: clinic.phones.office, href: telHref(clinic.phones.office) },
  },
  email: clinic.email,
  address: { ...clinic.address, country: "GR" },
  areas: clinic.areas,
} as const;

/** Opening hours, keyed by JS weekday (0 = Sunday). Times are Europe/Athens. */
export const openingHours: Record<number, [string, string][]> = Object.fromEntries(
  clinic.hours.map((slots, day) => [day, slots] as const).filter(([, slots]) => slots.length > 0),
);

export const weekdayNames: Localized<string[]> = {
  el: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
};

/** Monday-first order for display. */
export const displayWeek = [1, 2, 3, 4, 5, 6, 0];
