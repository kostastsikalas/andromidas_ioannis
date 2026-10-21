import data from "./clinic.json";

/**
 * Contact details and opening hours, edited from the admin panel (/admin → «Στοιχεία ιατρείου»),
 * which rewrites clinic.json. Components read them through useClinic() (src/lib/use-clinic.ts)
 * so the static version can show the latest saved values without a rebuild.
 */
export type ClinicInfo = {
  phones: { mobile: string; office: string };
  email: string;
  address: {
    street: { el: string; en: string };
    city: { el: string; en: string };
    region: { el: string; en: string };
    postalCode: string;
  };
  /** Opening hours per JS weekday (0 = Sunday), as [from, to] pairs in Europe/Athens time; [] = closed. */
  hours: [string, string][][];
  areas: { el: string[]; en: string[] };
};

export const clinic = data as ClinicInfo;

/** "697 370 1243" → "tel:+306973701243" (Greek numbers without a country code get +30). */
export function telHref(display: string) {
  const digits = display.replace(/\D/g, "");
  return `tel:+${display.trim().startsWith("+") || digits.length > 10 ? digits : `30${digits}`}`;
}

const mapsQuery = (c: ClinicInfo) =>
  `${c.address.street.el}, ${c.address.city.el} ${c.address.postalCode.replace(/^(\d{3})(\d{2})$/, "$1 $2")}`;

export const directionsUrl = (c: ClinicInfo) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery(c))}`;

export const mapEmbedUrl = (c: ClinicInfo) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery(c))}&z=16&output=embed`;
