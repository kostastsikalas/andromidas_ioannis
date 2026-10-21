import type { Metadata } from "next";
import { Commissioner, Inter } from "next/font/google";
import "../[lang]/globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"], display: "swap" });
const commissioner = Commissioner({ variable: "--font-commissioner", subsets: ["latin", "greek"], weight: ["700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: "Διαχείριση site",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${inter.variable} ${commissioner.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
