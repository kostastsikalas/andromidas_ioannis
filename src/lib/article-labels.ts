import { getDictionary } from "@/content/dictionary";
import { site, type Locale } from "@/content/site";

export function articleLabels(lang: Locale) {
  const dict = getDictionary(lang);
  return {
    home: dict.nav.home,
    articles: dict.nav.articles,
    greekOnly: getDictionary("en").articles.greekOnly,
    photoCredit: dict.articles.photoCredit,
    disclaimerEl: getDictionary("el").articles.disclaimer,
    disclaimerEn: getDictionary("en").articles.disclaimer,
    bookAppointment: dict.cta.bookAppointment,
    more: dict.cta.allArticles,
    notFound: dict.notFound.title,
    phone: { href: site.phones.mobile.href, display: site.phones.mobile.display },
  };
}
