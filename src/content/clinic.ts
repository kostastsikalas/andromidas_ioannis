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
  /** Exact map pin as "lat,lng"; when empty the map searches for the address instead. */
  mapPoint: string;
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
  c.mapPoint || `${c.address.street.el}, ${c.address.city.el} ${c.address.postalCode.replace(/^(\d{3})(\d{2})$/, "$1 $2")}`;

/** Finds "lat,lng" in pasted coordinates or a full Google Maps link (…/@lat,lng… or …!3dlat!4dlng…). */
export function parseMapPoint(input: string): string | null {
  const s = input.trim();
  if (!s) return "";
  const pin = s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ?? s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ?? s.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (!pin) return null;
  const [lat, lng] = [Number(pin[1]), Number(pin[2])];
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return `${lat},${lng}`;
}

export const directionsUrl = (c: ClinicInfo) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery(c))}`;

export const mapEmbedUrl = (c: ClinicInfo) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery(c))}&z=17&output=embed`;
