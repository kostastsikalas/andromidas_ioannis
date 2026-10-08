import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HoursCard } from "@/components/HoursCard";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, PhoneIcon, ServiceGlyph } from "@/components/Icons";
import { OpenBadge } from "@/components/OpenStatus";
import { ButtonLink, Container, SectionTitle } from "@/components/ui";
import { articles } from "@/content/articles";
import { getDictionary } from "@/content/dictionary";
import { services } from "@/content/services";
import { hasLocale, mapsDirectionsUrl, mapsEmbedUrl, site } from "@/content/site";
import { paths } from "@/lib/paths";

const highlightIcons = ["child", "ear", "home"] as const;

const gallery = [
  { src: "/images/office.jpg", w: 1800, h: 1198, alt: { el: "Εξεταστήριο ιατρείου", en: "Examination room" } },
  { src: "/images/audiometer.jpg", w: 1800, h: 1350, alt: { el: "Ακοογράφος", en: "Audiometer" } },
  { src: "/images/ear-microscope.jpg", w: 1800, h: 1350, alt: { el: "Ωτομικροσκόπιο", en: "Ear microscope" } },
  { src: "/images/endoscopes.jpg", w: 1800, h: 1280, alt: { el: "Ενδοσκόπια", en: "Endoscopes" } },
];

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-100/60 via-brand-50/30 to-transparent">
        <Container className="grid items-center gap-8 pb-10 pt-4 sm:pt-12 md:grid-cols-[1.15fr_1fr] md:gap-12 md:pb-20 md:pt-16">
          <div className="min-w-0">
            {/* Phones: photo card with the name on top of it */}
            <div className="relative -mx-1 overflow-hidden rounded-[1.75rem] bg-brand-800 shadow-xl shadow-brand-900/20 ring-1 ring-brand-900/5 md:hidden">
              <div className="relative aspect-[1/1] max-h-[22rem] w-full">
                <Image
                  src="/images/doctor.jpg"
                  alt={site.name[lang]}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-[62%_38%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/95 from-10% via-brand-900/45 via-40% to-transparent to-65%" />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 p-0.5 shadow-sm backdrop-blur empty:hidden">
                  <OpenBadge openLabel={dict.hours.openNow} closedLabel={dict.hours.closedNow} />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200">
                    {site.shortTitle[lang]}
                  </p>
                  <h1 className="mt-1 font-display text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-white">
                    {site.name[lang]}
                  </h1>
                  <p className="mt-1 text-[14px] font-medium leading-snug text-brand-100">{site.title[lang]}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-brand-500">{t.eyebrow}</p>
              <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-brand-900 text-balance md:text-[3.4rem]">
                {site.name[lang]}
              </h1>
              <p className="mt-2 font-display text-xl font-semibold text-brand-600">{site.title[lang]}</p>
            </div>
            <p className="mt-5 max-w-xl px-1 text-[16px] leading-relaxed text-muted text-pretty sm:px-0 sm:text-lg">{t.heroText}</p>

            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
              <ButtonLink href={site.phones.mobile.href} className="py-3.5 text-base">
                <PhoneIcon className="h-5 w-5" />
                {dict.cta.callNow} · {site.phones.mobile.display}
              </ButtonLink>
              <ButtonLink href={paths.appointment(lang)} variant="ghost" className="py-3.5 text-base">
                <CalendarIcon className="h-5 w-5" />
                {dict.cta.bookAppointment}
              </ButtonLink>
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-6">
              {t.highlights.map((h, i) => (
                <li
                  key={h.title}
                  className="flex flex-col items-center rounded-2xl border border-white bg-white/70 px-2 py-3.5 text-center shadow-sm sm:items-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-left sm:shadow-none"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 sm:mb-2">
                    <ServiceGlyph icon={highlightIcons[i]} className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-[13px] font-semibold leading-tight text-ink sm:mt-0 sm:text-base">{h.title}</p>
                  <p className="hidden text-sm text-muted sm:block">{h.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative hidden md:block">
            <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-brand-100 shadow-xl shadow-brand-900/10 md:max-h-none md:max-w-none">
              <Image
                src="/images/doctor.jpg"
                alt={site.name[lang]}
                fill
                priority
                sizes="45vw"
                className="object-cover object-[50%_25%]"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 mx-auto flex max-w-xs items-center gap-3 rounded-2xl border border-line bg-white/95 p-3.5 shadow-lg backdrop-blur sm:left-auto sm:right-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <p className="text-sm leading-snug">
                <span className="font-semibold text-ink">{site.address.street[lang]}</span>
                <br />
                <span className="text-muted">{site.address.city[lang]}</span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionTitle
            title={t.servicesTitle}
            text={t.servicesText}
            action={
              <Link href={paths.services(lang)} className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-800">
                {dict.cta.allServices} <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={paths.service(lang, s.slug)}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5 sm:flex-row sm:gap-4 sm:p-5 lg:flex-col"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white sm:h-12 sm:w-12">
                    <ServiceGlyph icon={s.icon} className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-display text-[15px] font-bold leading-snug text-brand-900 sm:text-base">{s.title[lang]}</span>
                    <span className="mt-1 hidden text-sm leading-relaxed text-muted sm:block">{s.summary[lang]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* About + hours */}
      <section className="bg-band py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <SectionTitle title={t.aboutTitle} />
            <div className="space-y-4 text-lg leading-relaxed text-ink/85">
              {t.aboutText.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <ButtonLink href={paths.doctor(lang)} variant="secondary" className="mt-7">
              {dict.cta.aboutDoctor} <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>

            <h3 className="mt-12 font-display text-lg font-bold text-brand-900">{t.officeTitle}</h3>
            <div className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
              {gallery.map((g) => (
                <div key={g.src} className="relative aspect-[4/3] w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-brand-50 sm:w-auto">
                  <Image src={g.src} alt={g.alt[lang]} fill sizes="(min-width: 640px) 16vw, 256px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <HoursCard lang={lang} dict={dict} className="self-start" />
        </Container>
      </section>

      {/* Articles */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionTitle
            title={t.articlesTitle}
            text={dict.articles.greekOnly || dict.articles.intro}
            action={
              <Link href={paths.articles(lang)} className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-800">
                {dict.cta.allArticles} <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
          <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {articles.slice(0, 3).map((a) => (
              <li key={a.slug} className="w-72 shrink-0 snap-start md:w-auto">
                <Link href={paths.article(lang, a.slug)} className="group block h-full overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-lg hover:shadow-brand-900/5">
                  <div className="relative aspect-[16/10] bg-brand-50">
                    <Image src={a.image} alt="" fill sizes="(min-width: 768px) 30vw, 288px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-5">
                    <p className="font-display font-bold text-brand-900">{a.title[lang]}</p>
                    {lang === "el" && <p className="mt-1.5 text-sm text-muted">{a.excerpt}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Visit */}
      <section className="bg-band py-14 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionTitle title={t.visitTitle} />
            <address className="not-italic text-lg">
              <p className="font-semibold text-ink">{site.address.street[lang]}</p>
              <p className="text-muted">
                {site.address.city[lang]} {site.address.postalCode}, {site.address.region[lang]}
              </p>
            </address>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
              <ButtonLink href={mapsDirectionsUrl} external variant="secondary">
                <MapPinIcon className="h-5 w-5" /> {dict.cta.directions}
              </ButtonLink>
              <ButtonLink href={site.phones.office.href} variant="ghost">
                <PhoneIcon className="h-5 w-5" /> {site.phones.office.display}
              </ButtonLink>
            </div>
            <h3 className="mt-10 font-display text-lg font-bold text-brand-900">{t.areasTitle}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.areas[lang].map((a) => (
                <li key={a} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-800">{a}</li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-brand-50">
            <iframe
              title={dict.contact.map}
              src={mapsEmbedUrl}
              className="h-80 w-full lg:h-full lg:min-h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
