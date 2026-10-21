import { clinic, telHref } from "./clinic";

export const locales = ["el", "en"] as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export type Localized<T = string> = Record<Locale, T>;

export const site = {
  url: "https://ioannisandromidas.gr",
  name: {
    el: "Ιωάννης Ν. Ανδρομιδάς",
    en: "Ioannis N. Andromidas",
  },
  title: {
    el: "Χειρουργός Ωτορινολαρυγγολόγος Ενηλίκων & Παίδων",
    en: "ENT Surgeon – Adults & Children",
  },
  shortTitle: {
    el: "Ωτορινολαρυγγολόγος · Χερσόνησος",
    en: "ENT Surgeon · Hersonissos",
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
};

/** Monday-first order for display. */
export const displayWeek = [1, 2, 3, 4, 5, 6, 0];
