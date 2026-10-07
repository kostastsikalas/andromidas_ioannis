"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";
import { site, type Locale } from "@/content/site";
import { CheckIcon } from "./Icons";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink shadow-sm outline-none transition placeholder:text-muted/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export function AppointmentForm({ lang, t }: { lang: Locale; t: Dictionary["form"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckIcon className="h-6 w-6 shrink-0" />
        <p>{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          {t.name} *
          <input name="name" required autoComplete="name" maxLength={100} className={field} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.phone} *
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+\s()\-]{8,20}"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.email}
          <input name="email" type="email" autoComplete="email" maxLength={120} className={field} />
        </label>
        <label className="block text-sm font-medium text-ink">
          {t.date}
          <input name="date" type="date" className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium text-ink">
        {t.message}
        <textarea name="message" rows={4} maxLength={1500} className={field} />
      </label>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input name="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600" />
        {t.consent}
      </label>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-accent-500/10 p-4 text-sm text-accent-600">
          {t.error}{" "}
          <a href={site.phones.mobile.href} className="font-bold underline">
            {site.phones.mobile.display}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
      <p className="text-xs text-muted">{t.note}</p>
    </form>
  );
}
