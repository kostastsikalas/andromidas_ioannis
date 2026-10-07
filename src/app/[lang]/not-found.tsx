import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-brand-900">Η σελίδα δεν βρέθηκε · Page not found</h1>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/el" className="rounded-full bg-brand-600 px-5 py-3 font-semibold text-white">Αρχική</Link>
        <Link href="/en" className="rounded-full border border-brand-200 bg-white px-5 py-3 font-semibold text-brand-700">Home</Link>
      </div>
    </Container>
  );
}
