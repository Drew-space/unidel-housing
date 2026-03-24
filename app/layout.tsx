import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import "./globals.css";
import { Metadata } from "next";
import { Mona_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

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

// in your html tag:

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={` ${mona_sans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ConvexClientProvider>
          <main className="pt-16">{children}</main>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
