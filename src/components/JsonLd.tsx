import { openingHours, site, type Locale } from "@/content/site";
import { services } from "@/content/services";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org data so Google can show the clinic's hours, phone and address. */
export function JsonLd({ lang }: { lang: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalClinic"],
    "@id": `${site.url}/#clinic`,
    name: site.name[lang],
    description: site.title[lang],
    url: `${site.url}/${lang}`,
    image: `${site.url}/images/doctor.jpg`,
    telephone: ["+30 697 370 1243", "+30 2897 024664"],
    email: site.email,
    medicalSpecialty: "Otolaryngologic",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street[lang],
      addressLocality: site.address.city[lang],
      addressRegion: site.address.region[lang],
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: site.areas[lang],
    availableService: services.map((s) => ({ "@type": "MedicalProcedure", name: s.title[lang] })),
    openingHoursSpecification: Object.entries(openingHours).flatMap(([day, slots]) =>
      slots.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${dayNames[Number(day)]}`,
        opens,
        closes,
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
