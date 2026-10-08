"use client";

import { useEffect, useState } from "react";
import { sortArticles, type Article } from "@/content/articles";
import { runtimeConfig } from "./runtime-config";

/**
 * Returns the build-time articles, then — when a live endpoint is configured (static PHP
 * version) — swaps in the latest list so articles added from the admin appear immediately.
 */
export function useLiveArticles(initial: Article[]) {
  const [list, setList] = useState(initial);
  useEffect(() => {
    const endpoint = runtimeConfig.liveArticlesEndpoint;
    if (!endpoint) return;
    let cancelled = false;
    fetch(endpoint, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { articles?: Article[] }) => {
        if (!cancelled && Array.isArray(data.articles)) setList(sortArticles(data.articles));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return list;
}
