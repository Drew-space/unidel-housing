import type { Metadata } from "next";
import { Geist, Geist_Mono, Mona_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const mona_sans = Mona_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <div
      className={cn(
        geistSans.variable,
        geistMono.variable,
        mona_sans.variable,
        "h-full antialiased font-sans",
      )}
    >
      <Navbar />
      <TooltipProvider>
        <main className="flex-1">{children}</main>
      </TooltipProvider>
    </div>
  );
}
