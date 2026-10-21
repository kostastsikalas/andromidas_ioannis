"use client";

import { homeContent, type HomeContent } from "@/content/home";
import type { Locale } from "@/content/site";
import { createLiveContent } from "./live-content";
import { runtimeConfig } from "./runtime-config";

const useAllHome = createLiveContent<Record<Locale, HomeContent>>(
  homeContent,
  () => runtimeConfig.liveHomeEndpoint,
  (data) => {
    const h = (data as { home?: Record<Locale, HomeContent> }).home;
    return h?.el?.heroText ? { ...homeContent, ...h } : null;
  },
);

/** Home-page texts for the visible UI (see createLiveContent). */
export const useHome = (lang: Locale) => useAllHome()[lang];
