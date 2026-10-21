"use client";

import { useSyncExternalStore } from "react";

/**
 * A value that starts with its build-time copy and, when `endpoint()` returns a URL (static PHP
 * version), is replaced once per page load by the latest copy saved from the admin. Every component
 * using the returned hook updates together.
 */
export function createLiveContent<T>(initial: T, endpoint: () => string | null, pick: (data: unknown) => T | null) {
  let current = initial;
  let started = false;
  const listeners = new Set<() => void>();

  function load() {
    const url = endpoint();
    if (!url) return;
    fetch(url, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: unknown) => {
        const next = pick(data);
        if (!next) return;
        current = next;
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

  return () =>
    useSyncExternalStore(
      subscribe,
      () => current,
      () => initial,
    );
}
