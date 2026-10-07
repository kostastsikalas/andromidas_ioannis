import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRightIcon, CalendarIcon, CheckIcon, PhoneIcon, ServiceGlyph } from "@/components/Icons";
import { ButtonLink, Container, PageHeader, PageSkeleton } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { getService, services } from "@/content/services";
import { hasLocale, locales, site } from "@/content/site";
import { paths } from "@/lib/paths";

export function generateStaticParams() {
  return locales.flatMap((lang) => services.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = getService(slug);
  if (!hasLocale(lang) || !service) return {};
  return {
    title: service.title[lang],
    description: `${service.summary[lang]} ${site.name[lang]}, ${site.address.city[lang]}.`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, paths.service(l, slug)])) },
  };
}

export default function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServicePageContent params={params} />
    </Suspense>
  );
}

async function ServicePageContent({ params }: Pick<PageProps<"/[lang]/services/[slug]">, "params">) {
  const { lang, slug } = await params;
  const service = getService(slug);
  if (!hasLocale(lang) || !service) notFound();
  const dict = getDictionary(lang);
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHeader
        title={service.title[lang]}
        intro={service.summary[lang]}
        crumbs={[
          { href: paths.home(lang), label: dict.nav.home },
          { href: paths.services(lang), label: dict.nav.services },
        ]}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <article className="min-w-0">
          <div className="space-y-4 text-lg leading-relaxed text-ink/85">
            {service.intro[lang].map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>

          {service.conditions && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-extrabold text-brand-900 sm:text-2xl">{dict.services.conditions}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.conditions[lang].map((c) => (
                  <li key={c} className="rounded-full border border-brand-100 bg-brand-50 px-3.5 py-2 text-[15px] text-brand-800">{c}</li>
                ))}
              </ul>
            </section>
          )}

          {service.procedures && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-extrabold text-brand-900 sm:text-2xl">{dict.services.procedures}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.procedures[lang].map((p) => (
                  <li key={p.title} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <span>
                      <span className="block font-medium text-ink">{p.title}</span>
                      {p.text && <span className="mt-1 block text-sm text-muted">{p.text}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {service.note && (
            <p className="mt-8 rounded-2xl border-l-4 border-brand-500 bg-brand-50 p-5 text-ink">{service.note[lang]}</p>
          )}

          {service.images && (
            <div className={`mt-10 grid gap-4 ${service.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {service.images.map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-3xl border border-line bg-white">
                  <Image src={img.src} alt={img.alt[lang]} width={img.width} height={img.height} sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full" />
                  <figcaption className="px-5 py-3 text-sm text-muted">{img.alt[lang]}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-brand-800 p-6 text-white">
            <p className="font-display text-lg font-bold">{dict.cta.bookAppointment}</p>
            <p className="mt-1 text-sm text-brand-200">{dict.hours.byAppointment}</p>
            <ButtonLink href={site.phones.mobile.href} className="mt-5 w-full">
              <PhoneIcon className="h-5 w-5" /> {site.phones.mobile.display}
            </ButtonLink>
            <ButtonLink href={paths.appointment(lang)} variant="ghost" className="mt-3 w-full">
              <CalendarIcon className="h-5 w-5" /> {dict.form.title}
            </ButtonLink>
          </div>
          <nav aria-label={dict.services.other}>
            <p className="mb-3 font-display font-bold text-brand-900">{dict.services.other}</p>
            <ul className="space-y-1">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={paths.service(lang, s.slug)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink/85 transition hover:bg-white hover:text-brand-700">
                    <ServiceGlyph icon={s.icon} className="h-5 w-5 text-brand-500" />
                    <span className="flex-1">{s.title[lang]}</span>
                    <ArrowRightIcon className="h-4 w-4 opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </Container>
    </>
  );
}
