import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckIcon, PhoneIcon } from "@/components/Icons";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { doctor } from "@/content/doctor";
import { hasLocale, site } from "@/content/site";
import { paths } from "@/lib/paths";

export async function generateMetadata({ params }: PageProps<"/[lang]/doctor">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).doctor.title, description: doctor.bio[lang][0] };
}

export default async function DoctorPage({ params }: PageProps<"/[lang]/doctor">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow={site.title[lang]} title={site.name[lang]} />
      <Container className="grid gap-8 py-8 sm:gap-10 sm:py-16 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-14">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[3/4] sm:max-w-xs bg-brand-100 shadow-lg md:max-w-none">
            <Image src="/images/doctor.jpg" alt={site.name[lang]} fill priority sizes="(min-width: 768px) 22rem, 80vw" className="object-cover object-[50%_30%]" />
          </div>
          <div className="hidden md:block">
          <ButtonLink href={site.phones.mobile.href} className="mt-6 w-full">
            <PhoneIcon className="h-5 w-5" /> {site.phones.mobile.display}
          </ButtonLink>
          <ButtonLink href={paths.appointment(lang)} variant="ghost" className="mt-3 w-full">
            {dict.cta.bookAppointment}
          </ButtonLink>
          </div>
        </div>

        <div>
          <div className="space-y-4 text-lg leading-relaxed text-ink/85">
            {doctor.bio[lang].map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          </div>

          <h2 className="mt-12 font-display text-2xl font-extrabold text-brand-900">{dict.doctor.education}</h2>
          <ol className="mt-6 space-y-0 border-l-2 border-brand-100">
            {doctor.education[lang].map((e) => (
              <li key={e.title} className="relative pb-7 pl-7 last:pb-0">
                <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-brand-500 shadow" />
                <p className="font-semibold text-ink">{e.title}</p>
                <p className="mt-1 text-muted">{e.text}</p>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 font-display text-2xl font-extrabold text-brand-900">{dict.doctor.memberships}</h2>
          <ul className="mt-5 space-y-3">
            {doctor.memberships[lang].map((m) => (
              <li key={m} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
