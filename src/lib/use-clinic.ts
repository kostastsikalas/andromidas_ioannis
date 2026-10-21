"use client";

import { useSyncExternalStore } from "react";
import { clinic, type ClinicInfo } from "@/content/clinic";
import { runtimeConfig } from "./runtime-config";

/**
 * Contact details for the visible UI. Starts with the build-time values; when a live endpoint is
 * configured (static PHP version) the latest values saved from the admin are fetched once per page
 * load and every component using this hook updates.
 */
let current: ClinicInfo = clinic;
let started = false;
const listeners = new Set<() => void>();

function load() {
  const endpoint = runtimeConfig.liveClinicEndpoint;
  if (!endpoint) return;
  fetch(endpoint, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data: { clinic?: ClinicInfo }) => {
      if (!data.clinic?.phones || !Array.isArray(data.clinic.hours)) return;
      current = data.clinic;
      listeners.forEach((l) => l());
    })
    .catch(() => {});
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    load();
  }
  return () => listeners.delete(listener);
}

export const useClinic = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => clinic,
  );
