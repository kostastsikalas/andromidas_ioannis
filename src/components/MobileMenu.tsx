"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, MenuIcon } from "./Icons";

type Props = {
  items: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  languageSwitch: ReactNode;
  footer: ReactNode;
};

const noopSubscribe = () => () => {};

export function MobileMenu({ items, openLabel, closeLabel, languageSwitch, footer }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // The header's backdrop-filter would trap a fixed drawer inside it, so render the drawer into <body>.
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Close the drawer after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:bg-brand-50"
      >
        <MenuIcon />
      </button>

      {isClient && createPortal(
      <div
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden transition ${open ? "visible" : "invisible"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-brand-900/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-brand-50"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4" aria-label="Mobile">
            <ul className="space-y-1">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl px-4 py-3.5 font-display text-lg font-semibold transition ${active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-brand-50"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 px-4">{languageSwitch}</div>
          </nav>
          <div className="border-t border-line p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">{footer}</div>
        </div>
      </div>,
      document.body,
      )}
    </div>
  );
}
