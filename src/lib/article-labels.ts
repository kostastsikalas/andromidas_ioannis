import { getDictionary } from "@/content/dictionary";
import type { Locale } from "@/content/site";

export function articleLabels(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    home: dict.nav.home,
    articles: dict.nav.articles,
    notTranslated: dict.articles.notTranslated,
    photoCredit: dict.articles.photoCredit,
    disclaimerEl: getDictionary("el").articles.disclaimer,
    disclaimerEn: getDictionary("en").articles.disclaimer,
    bookAppointment: dict.cta.bookAppointment,
    more: dict.cta.allArticles,
    notFound: dict.notFound.title,
  };
}
