import { parseMapPoint, type ClinicInfo } from "@/content/clinic";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const pair = (v: unknown, max: number) => {
  const o = (v ?? {}) as Record<string, unknown>;
  return { el: text(o.el, max), en: text(o.en, max) };
};
const list = (v: unknown) =>
  (Array.isArray(v) ? v : [])
    .map((item) => text(item, 60))
    .filter(Boolean)
    .slice(0, 40);

const time = /^([01]\d|2[0-3]):[0-5]\d$/;
/** Greek phone: 10 digits, optionally with +30 / 0030 in front. */
const isPhone = (v: string) => /^\d{10}$/.test(v.replace(/\D/g, "").replace(/^(0030|30)(?=\d{10}$)/, ""));

/** Normalises the contact details coming from the admin panel; returns an error code if they're unusable. */
export function validateClinic(input: unknown): { clinic: ClinicInfo } | { error: string } {
  const c = (input ?? {}) as Record<string, unknown>;
  const phones = (c.phones ?? {}) as Record<string, unknown>;
  const address = (c.address ?? {}) as Record<string, unknown>;
  const areas = (c.areas ?? {}) as Record<string, unknown>;
  const hours = Array.isArray(c.hours) ? c.hours : [];

  const clinic: ClinicInfo = {
    phones: { mobile: text(phones.mobile, 30), office: text(phones.office, 30) },
    email: text(c.email, 120),
    address: {
      street: pair(address.street, 120),
      city: pair(address.city, 120),
      region: pair(address.region, 120),
      postalCode: text(address.postalCode, 10).replace(/\s/g, ""),
    },
    mapPoint: parseMapPoint(text(c.mapPoint, 2000)) ?? "invalid",
    hours: Array.from({ length: 7 }, (_, day) =>
      (Array.isArray(hours[day]) ? (hours[day] as unknown[]) : [])
        .map((slot) => (Array.isArray(slot) ? [text(slot[0], 5), text(slot[1], 5)] : ["", ""]) as [string, string])
        .slice(0, 3)
        .sort((a, b) => a[0].localeCompare(b[0])),
    ),
    areas: { el: list(areas.el), en: list(areas.en) },
  };

  if (!isPhone(clinic.phones.mobile) || !isPhone(clinic.phones.office)) return { error: "invalid_phone" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clinic.email)) return { error: "invalid_email" };
  if (!clinic.address.street.el || !clinic.address.city.el || !clinic.address.region.el) return { error: "missing_address" };
  if (!/^\d{5}$/.test(clinic.address.postalCode)) return { error: "invalid_postal_code" };
  if (clinic.mapPoint === "invalid") return { error: "invalid_map_point" };
  for (const slots of clinic.hours) {
    for (const [from, to] of slots) if (!time.test(from) || !time.test(to) || from >= to) return { error: "invalid_hours" };
  }
  // English fields fall back to Greek, so the English pages never show blanks.
  for (const key of ["street", "city", "region"] as const) {
    clinic.address[key].en ||= clinic.address[key].el;
  }
  if (!clinic.areas.en.length) clinic.areas.en = clinic.areas.el;
  return { clinic };
}
