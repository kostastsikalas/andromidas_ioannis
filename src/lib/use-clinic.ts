"use client";

import { clinic, type ClinicInfo } from "@/content/clinic";
import { createLiveContent } from "./live-content";
import { runtimeConfig } from "./runtime-config";

/** Contact details for the visible UI (see createLiveContent). */
export const useClinic = createLiveContent<ClinicInfo>(
  clinic,
  () => runtimeConfig.liveClinicEndpoint,
  (data) => {
    const c = (data as { clinic?: ClinicInfo }).clinic;
    return c?.phones && Array.isArray(c.hours) ? { ...clinic, ...c } : null;
  },
);
