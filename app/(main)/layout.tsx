import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Mona_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const mona_sans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona", // unique name
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // unique name
  weight: ["400", "700"],
});

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
    <div
      className={cn(
        inter.variable,
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
