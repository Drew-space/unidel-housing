import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { cn } from "@/lib/utils";

import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "Ruum – Student Housing Made Easy",
  description:
    "Find verified hostels and apartments near campus. Browse listings in Owa-Alero, Alihame, and Owo-Yibo with smart filters for room types and pricing.",
  keywords: [
    "student housing",
    "hostels near campus",
    "Owa-Alero hostels",
    "Alihame apartments",
    "Owo-Yibo housing",
  ],
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("h-full antialiased ")}>
      <main className="flex-1">{children}</main>

      <Toaster />
    </div>
  );
}
