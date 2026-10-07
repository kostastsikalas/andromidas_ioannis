"use client";

import { useSyncExternalStore } from "react";
import { openingHours } from "@/content/site";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Current weekday and minutes-since-midnight in Athens, regardless of the visitor's timezone. */
function athensNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function computeStatus() {
  const { day, minutes } = athensNow();
  const open = (openingHours[day] ?? []).some(
    ([from, to]) => minutes >= toMinutes(from) && minutes < toMinutes(to),
  );
  return `${day}:${open ? 1 : 0}`;
}

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};

function useStatus() {
  const snapshot = useSyncExternalStore(subscribe, computeStatus, () => null);
  if (!snapshot) return null;
  const [day, open] = snapshot.split(":");
  return { day: Number(day), open: open === "1" };
}

export function OpenBadge({ openLabel, closedLabel }: { openLabel: string; closedLabel: string }) {
  const status = useStatus();
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        status.open ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-500" : "bg-zinc-400"}`} />
      {status.open ? openLabel : closedLabel}
    </span>
  );
}

/** Highlights today's row in a server-rendered hours table. */
export function TodayMarker({ day, label }: { day: number; label: string }) {
  const status = useStatus();
  if (status?.day !== day) return null;
  return (
    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
      {label}
    </span>
  );
}
