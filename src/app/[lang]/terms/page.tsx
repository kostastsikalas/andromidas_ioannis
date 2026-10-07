import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { hasLocale } from "@/content/site";
import { terms } from "@/content/terms";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).footer.terms, robots: { index: false } };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <PageHeader title={getDictionary(lang).footer.terms} />
      <Container className="py-10 sm:py-14">
        <div className="max-w-3xl space-y-5 leading-relaxed text-ink/85">
          {terms[lang].map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
        </div>
      </Container>
    </>
  );
}
