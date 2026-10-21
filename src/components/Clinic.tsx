"use client";

import type { ComponentProps, ReactNode } from "react";
import { directionsUrl, mapEmbedUrl, telHref } from "@/content/clinic";
import type { Locale } from "@/content/site";
import { useClinic } from "@/lib/use-clinic";
import { ButtonLink } from "./ui";

/**
 * Small client pieces that show the editable contact details (see useClinic), so server-rendered
 * pages stay server components and only these spots update when the details change.
 */

type Phone = "mobile" | "office";

export function PhoneText({ which = "mobile" }: { which?: Phone }) {
  return <>{useClinic().phones[which]}</>;
}

/** Plain link to call; children come before the number, which is left out with `hideNumber`. */
export function PhoneLink({
  which = "mobile",
  hideNumber,
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { which?: Phone; hideNumber?: boolean }) {
  const display = useClinic().phones[which];
  return (
    <a href={telHref(display)} {...props}>
      {children}
      {!hideNumber && display}
    </a>
  );
}

export function PhoneButton({
  which = "mobile",
  children,
  ...props
}: Omit<ComponentProps<typeof ButtonLink>, "href"> & { which?: Phone }) {
  const display = useClinic().phones[which];
  return (
    <ButtonLink href={telHref(display)} {...props}>
      {children}
      {display}
    </ButtonLink>
  );
}

export function EmailLink(props: Omit<ComponentProps<"a">, "href" | "children">) {
  const { email } = useClinic();
  return (
    <a href={`mailto:${email}`} {...props}>
      {email}
    </a>
  );
}

type AddressPart = "street" | "city" | "region" | "postalCode";

export function AddressText({ lang, part }: { lang: Locale; part: AddressPart }) {
  const { address } = useClinic();
  return <>{part === "postalCode" ? address.postalCode : address[part][lang]}</>;
}

export function DirectionsLink(props: Omit<ComponentProps<"a">, "href" | "target" | "rel">) {
  return <a href={directionsUrl(useClinic())} target="_blank" rel="noopener noreferrer" {...props} />;
}

export function DirectionsButton(props: Omit<ComponentProps<typeof ButtonLink>, "href" | "external">) {
  return <ButtonLink href={directionsUrl(useClinic())} external {...props} />;
}

export function MapEmbed({ title, className }: { title: string; className: string }) {
  return (
    <iframe
      title={title}
      src={mapEmbedUrl(useClinic())}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function AreasText({ lang }: { lang: Locale }) {
  return <>{useClinic().areas[lang].join(", ")}</>;
}

export function AreaChips({ lang, className }: { lang: Locale; className: string }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {useClinic().areas[lang].map((a) => (
        <li key={a} className={className}>
          {a}
        </li>
      ))}
    </ul>
  );
}

/** Contact-page cards: mobile, office, email, address. */
export function ContactCards({
  lang,
  labels,
  icons,
}: {
  lang: Locale;
  labels: { mobile: string; office: string; email: string; address: string };
  icons: { phone: ReactNode; mail: ReactNode; pin: ReactNode };
}) {
  const c = useClinic();
  const cards = [
    { icon: icons.phone, label: labels.mobile, value: c.phones.mobile, href: telHref(c.phones.mobile) },
    { icon: icons.phone, label: labels.office, value: c.phones.office, href: telHref(c.phones.office) },
    { icon: icons.mail, label: labels.email, value: c.email, href: `mailto:${c.email}`, wide: true },
    {
      icon: icons.pin,
      label: labels.address,
      value: `${c.address.street[lang]}, ${c.address.city[lang]} ${c.address.postalCode}`,
      href: directionsUrl(c),
      wide: true,
    },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <li key={card.label} className={card.wide ? "col-span-2 sm:col-span-1" : ""}>
          <a
            href={card.href}
            {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex h-full flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 transition sm:flex-row sm:gap-4 sm:p-5 hover:border-brand-200 hover:shadow"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              {card.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-muted">{card.label}</span>
              <span className="block break-words font-semibold text-ink">{card.value}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
