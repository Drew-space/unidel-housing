import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Mona_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Ruum – Student Housing Made Easy",
  description: "Find verified hostels and apartments near campus...",
  keywords: [
    "student housing",
    "hostels near campus",
    "Owa-Alero hostels",
    "Alihame apartments",
    "Owo-Yibo housing",
  ],
  openGraph: {
    title: "Ruum – Student Housing Made Easy",
    description: "Find verified hostels and apartments near campus...",
    url: "https://ruum-nine.vercel.app",
    siteName: "Ruum",
    type: "website",
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("h-full antialiased font-sans")}>
      <Navbar />
      <TooltipProvider>
        <main className="flex-1   ">{children}</main>
      </TooltipProvider>
    </div>
  );
}
