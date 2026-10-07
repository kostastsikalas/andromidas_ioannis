import type { Metadata, Viewport } from "next";
import { Commissioner, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MobileActionBar } from "@/components/MobileActionBar";
import { getDictionary } from "@/content/dictionary";
import { hasLocale, locales, site } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"], display: "swap" });
const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin", "greek"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const name = site.name[lang];
  const description =
    lang === "el"
      ? "Ωτορινολαρυγγολόγος ενηλίκων & παίδων στον Λιμένα Χερσονήσου Ηρακλείου. Ενδοσκόπηση, ακοομετρία, νεογνικός έλεγχος ακοής, επεμβάσεις, επισκέψεις κατ’ οίκον. Τηλ. 697 370 1243."
      : "ENT surgeon (Otolaryngologist) for adults & children in Hersonissos, Crete. Endoscopy, hearing tests, newborn hearing screening, minor surgery, home visits. Tel. +30 697 370 1243.";
  return {
    metadataBase: new URL(site.url),
    title: { default: `${name} – ${site.title[lang]} | ${lang === "el" ? "Χερσόνησος" : "Hersonissos"}`, template: `%s | ${name}` },
    description,
    openGraph: {
      type: "website",
      locale: lang === "el" ? "el_GR" : "en_US",
      siteName: name,
      images: [{ url: "/images/office.jpg", width: 1800, height: 1198 }],
    },
    formatDetection: { telephone: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${inter.variable} ${commissioner.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          {lang === "el" ? "Μετάβαση στο περιεχόμενο" : "Skip to content"}
        </a>
        <JsonLd lang={lang} />
        <Header lang={lang} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <MobileActionBar lang={lang} dict={dict} />
      </body>
    </html>
  );
}
