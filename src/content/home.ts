import data from "./home.json";
import type { Locale } from "./site";

/**
 * Home-page texts per language, edited from the admin panel (/admin → «Αρχική»), which rewrites
 * home.json. Visible text is read through useHome() so the static version shows saved changes
 * without a rebuild.
 */
export type HomeContent = (typeof data)["el"];

export const homeContent: Record<Locale, HomeContent> = data;
