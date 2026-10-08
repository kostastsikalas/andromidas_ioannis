import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/AppointmentForm";
import { HoursCard } from "@/components/HoursCard";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/Icons";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { hasLocale, mapsDirectionsUrl, mapsEmbedUrl, site } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: d.contact.title,
    description: `${site.address.street[lang]}, ${site.address.city[lang]} · ${site.phones.mobile.display} · ${site.phones.office.display}`,
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.contact;

  const cards = [
    {
      icon: PhoneIcon,
      label: t.mobile,
      value: site.phones.mobile.display,
      href: site.phones.mobile.href,
    },
    {
      icon: PhoneIcon,
      label: t.office,
      value: site.phones.office.display,
      href: site.phones.office.href,
    },
    { icon: MailIcon, label: t.email, value: site.email, href: `mailto:${site.email}`, wide: true },
    {
      icon: MapPinIcon,
      label: t.address,
      value: `${site.address.street[lang]}, ${site.address.city[lang]} ${site.address.postalCode}`,
      href: mapsDirectionsUrl,
      wide: true,
    },
  ];

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Container className="py-8 sm:py-14">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {cards.map(({ icon: Icon, ...c }) => (
            <li key={c.label} className={c.wide ? "col-span-2 sm:col-span-1" : ""}>
              <a
                href={c.href}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-full flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 transition sm:flex-row sm:gap-4 sm:p-5 hover:border-brand-200 hover:shadow"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted">{c.label}</span>
                  <span className="block break-words font-semibold text-ink">{c.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <section id="appointment" className="scroll-mt-28 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl font-extrabold text-brand-900">{dict.form.title}</h2>
            <p className="mb-6 mt-1 text-muted">{t.intro}</p>
            <AppointmentForm lang={lang} t={dict.form} />
          </section>
          <HoursCard lang={lang} dict={dict} className="self-start" />
        </div>

        <section className="mt-10 overflow-hidden rounded-3xl border border-line bg-white">
          <iframe title={t.map} src={mapsEmbedUrl} className="h-80 w-full sm:h-[26rem]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">
              {dict.home.areasTitle}: {site.areas[lang].join(", ")}
            </p>
            <ButtonLink href={mapsDirectionsUrl} external variant="secondary" className="shrink-0">
              <MapPinIcon className="h-5 w-5" /> {dict.cta.directions}
            </ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}
