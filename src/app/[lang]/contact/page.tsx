import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HoursCard } from "@/components/HoursCard";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/Icons";
import { AreasText, ContactCards, DirectionsButton, MapEmbed } from "@/components/Clinic";
import { Container, PageHeader } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { elEn, hasLocale, site } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang);
  return {
    title: d.contact.title,
    description: `${elEn(site.address.street, lang)}, ${elEn(site.address.city, lang)} · ${site.phones.mobile.display} · ${site.phones.office.display}`,
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.contact;

  return (
    <>
      <PageHeader title={t.title} intro={t.intro} />
      <Container className="py-8 sm:py-14">
        <ContactCards
          lang={lang}
          labels={{ mobile: t.mobile, office: t.office, email: t.email, address: t.address }}
          icons={{
            phone: <PhoneIcon className="h-5 w-5" />,
            mail: <MailIcon className="h-5 w-5" />,
            pin: <MapPinIcon className="h-5 w-5" />,
          }}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <HoursCard lang={lang} dict={dict} className="self-start" />
          <section className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
            <MapEmbed title={t.map} className="h-80 w-full flex-1 lg:min-h-[24rem]" />
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted">
                {dict.home.areasTitle}: <AreasText lang={lang} />
              </p>
              <DirectionsButton variant="secondary" className="shrink-0">
                <MapPinIcon className="h-5 w-5" /> {dict.cta.directions}
              </DirectionsButton>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
