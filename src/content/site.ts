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
  phones: {
    mobile: { display: "697 370 1243", href: "tel:+306973701243" },
    office: { display: "28970 24664", href: "tel:+302897024664" },
  },
  email: "ioannisandromidas@gmail.com",
  address: {
    street: { el: "Δασκαλογιάννη 4", en: "4 Daskalogianni Str." },
    city: { el: "Λιμένας Χερσονήσου", en: "Limenas Hersonissos" },
    region: { el: "Ηράκλειο Κρήτης", en: "Heraklion, Crete" },
    postalCode: "70014",
    country: "GR",
  },
  mapsQuery: "Δασκαλογιάννη 4, Λιμένας Χερσονήσου 700 14",
  areas: {
    el: [
      "Λιμένας Χερσονήσου",
      "Άνω Χερσόνησος",
      "Πισκοπιανό",
      "Κουτουλουφάρι",
      "Ανάληψη",
      "Επισκοπή",
      "Ελαία",
      "Μάλια",
      "Μοχός",
      "Σταλίδα",
      "Γούβες",
      "Κοκκίνη Χάνι",
      "Ανώπολη",
      "Σίσι",
    ],
    en: [
      "Limenas Hersonissos",
      "Ano Hersonissos",
      "Piskopiano",
      "Koutouloufari",
      "Analipsi",
      "Episkopi",
      "Elaia",
      "Malia",
      "Mochos",
      "Stalis",
      "Gouves",
      "Kokkini Hani",
      "Anopolis",
      "Sissi",
    ],
  },
} as const;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`;
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&z=16&output=embed`;

/** Opening hours, keyed by JS weekday (0 = Sunday). Times are Europe/Athens. */
export const openingHours: Record<number, [string, string][]> = {
  1: [["09:00", "14:00"], ["16:00", "19:00"]],
  2: [["09:00", "14:00"], ["16:00", "19:00"]],
  3: [["09:00", "13:30"]],
  4: [["09:00", "14:00"], ["16:00", "19:00"]],
  5: [["09:00", "14:00"], ["16:00", "19:00"]],
};

export const weekdayNames: Localized<string[]> = {
  el: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/** Monday-first order for display. */
export const displayWeek = [1, 2, 3, 4, 5, 6, 0];
