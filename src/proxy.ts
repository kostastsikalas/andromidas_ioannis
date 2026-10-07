import { NextResponse, type NextRequest } from "next/server";
import { locales, type Locale } from "@/content/site";

/** Old WordPress `?page_id=` URLs → new paths, so existing Google results and bookmarks keep working. */
const legacyPages: Record<string, string> = {
  // Greek
  "11": "/el/doctor",
  "13": "/el/services",
  "17": "/el/services/paediatric-ent",
  "2274": "/el/services/newborn-hearing-screening",
  "23": "/el/services/pharyngology-laryngology",
  "21": "/el/services/rhinology",
  "19": "/el/services/audiology-otology",
  "27": "/el/services/surgical-procedures",
  "93": "/el/services/e-prescriptions",
  "1768": "/el/services/home-visits",
  "15": "/el/contact",
  "1661": "/el/contact",
  "1455": "/el/contact",
  "1652": "/el/terms",
  "1741": "/el/articles",
  "1716": "/el/articles/amygdales-kreatakia",
  "1714": "/el/articles/amygdalektomi-adenoeidektomi",
  "1729": "/el/articles/xena-somata-aftiou",
  "1757": "/el/articles/epiplokes-mesis-otitidas",
  "1772": "/el/articles/akoustika-varikoias",
  "1802": "/el/articles/osfrisi",
  "1824": "/el/articles/rinokolpitides",
  // English
  "1575": "/en",
  "1598": "/en/doctor",
  "1615": "/en/services",
  "1602": "/en/services/paediatric-ent",
  "1618": "/en/services/pharyngology-laryngology",
  "1605": "/en/services/rhinology",
  "1581": "/en/services/audiology-otology",
  "1587": "/en/services/surgical-procedures",
  "1594": "/en/services/e-prescriptions",
  "1591": "/en/contact",
  "1663": "/en/contact",
  "1621": "/en/contact",
  "1655": "/en/terms",
};

function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((r) => (locales as readonly string[]).includes(r.lang));
  // Greek is the default; visitors whose browser prefers another language get English.
  if (match) return match.lang as Locale;
  return ranked.length && ranked[0].lang ? "en" : "el";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const pageId = searchParams.get("page_id");
  if (pageId) {
    const target = legacyPages[pageId] ?? (searchParams.get("lang") === "en" ? "/en" : "/el");
    return NextResponse.redirect(new URL(target, request.url), 308);
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const locale = searchParams.get("lang") === "en" ? "en" : preferredLocale(request);
  const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url);
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API, static images and metadata files.
  matcher: ["/((?!_next|api|images|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)"],
};
