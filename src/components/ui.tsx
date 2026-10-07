import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`} {...props} />;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-brand-100/60 to-transparent">
      <Container className="py-10 sm:py-14">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                <Link href={c.href} className="hover:text-brand-700">{c.label}</Link>
                {i < crumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-brand-900 text-balance sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted text-pretty">{intro}</p>}
      </Container>
    </section>
  );
}

export function SectionTitle({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">{title}</h2>
        {text && <p className="mt-2 max-w-xl text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

const buttonStyles = {
  primary: "bg-accent-500 text-white hover:bg-accent-600 shadow-sm",
  secondary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  ghost: "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  external,
  ...props
}: ComponentProps<"a"> & { variant?: keyof typeof buttonStyles; external?: boolean }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition ${buttonStyles[variant]} ${className}`;
  const href = props.href ?? "#";
  if (external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return <a {...props} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
  }
  return <Link {...props} href={href} className={cls} />;
}

/** Placeholder shown during client navigation while a page's content streams in. */
export function PageSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="border-b border-line bg-brand-100/40">
        <Container className="py-10 sm:py-14">
          <div className="h-4 w-40 rounded bg-brand-100" />
          <div className="mt-4 h-10 w-3/4 max-w-lg rounded-lg bg-brand-100" />
          <div className="mt-4 h-5 w-2/3 max-w-md rounded bg-brand-100" />
        </Container>
      </div>
      <Container className="space-y-3 py-12">
        <div className="h-4 w-full max-w-2xl rounded bg-line" />
        <div className="h-4 w-11/12 max-w-2xl rounded bg-line" />
        <div className="h-4 w-4/5 max-w-2xl rounded bg-line" />
      </Container>
    </div>
  );
}
