import type { HomeContent } from "@/content/home";
import { locales, type Locale } from "@/content/site";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Normalises the home-page texts coming from the admin panel; every field is required in every language. */
export function validateHome(input: unknown): { home: Record<Locale, HomeContent> } | { error: string } {
  const all = (input ?? {}) as Record<string, Record<string, unknown>>;
  const home = {} as Record<Locale, HomeContent>;
  for (const lang of locales) {
    const h = all[lang] ?? {};
    const highlights = (Array.isArray(h.highlights) ? h.highlights : []).slice(0, 3).map((x) => {
      const o = (x ?? {}) as Record<string, unknown>;
      return { title: text(o.title, 60), text: text(o.text, 160) };
    });
    const aboutText = (Array.isArray(h.aboutText) ? h.aboutText : []).map((p) => text(p, 1200)).filter(Boolean).slice(0, 6);
    const value: HomeContent = {
      eyebrow: text(h.eyebrow, 120),
      heroText: text(h.heroText, 400),
      highlights,
      servicesTitle: text(h.servicesTitle, 80),
      servicesText: text(h.servicesText, 300),
      aboutTitle: text(h.aboutTitle, 80),
      aboutText,
      officeTitle: text(h.officeTitle, 80),
      announcements: text(h.announcements, 80),
      articlesTitle: text(h.articlesTitle, 80),
      areasTitle: text(h.areasTitle, 80),
      visitTitle: text(h.visitTitle, 80),
    };
    const strings = Object.values(value).filter((v): v is string => typeof v === "string");
    if (strings.some((v) => !v) || highlights.length !== 3 || highlights.some((x) => !x.title || !x.text) || !aboutText.length) {
      return { error: `missing_home_text_${lang}` };
    }
    home[lang] = value;
  }
  return { home };
}
