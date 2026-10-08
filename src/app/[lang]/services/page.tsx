import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ServiceGlyph } from "@/components/Icons";
import { Container, PageHeader } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { services } from "@/content/services";
import { hasLocale } from "@/content/site";
import { paths } from "@/lib/paths";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return { title: d.services.title, description: d.home.servicesText };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageHeader title={dict.services.title} intro={dict.services.intro} />
      <Container className="py-8 sm:py-16">
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={paths.service(lang, s.slug)}
                className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-4 transition sm:gap-5 sm:rounded-3xl sm:p-6 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <ServiceGlyph icon={s.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[17px] font-bold text-brand-900 sm:text-lg">{s.title[lang]}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted sm:text-base">{s.summary[lang]}</span>
                  <span className="mt-3 hidden items-center gap-1.5 sm:inline-flex text-sm font-semibold text-brand-600">
                    {dict.cta.learnMore} <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
