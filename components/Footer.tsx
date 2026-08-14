"use client";

import { Separator } from "./ui/separator";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Home, Heart, LayoutDashboard, UserPlus } from "lucide-react";

const Footer = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role || "user";
  const isAgentOrAdmin = role === "agent" || role === "admin";

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    {
      name: isAgentOrAdmin ? "Dashboard" : "Become an Agent",
      href: isAgentOrAdmin ? "/dashboard" : isSignedIn ? "/become-agent" : "#",
      icon: isAgentOrAdmin ? LayoutDashboard : UserPlus,
      requiresAuth: !isSignedIn && !isAgentOrAdmin,
    },
    { name: "Saved", href: "/favourites", icon: Heart },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand + tagline */}
          <div className="space-y-3 max-w-xs">
            <h2 className="text-2xl font-extrabold tracking-tighter">
              RU<span className="text-[#7c3aed]">UM</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Find student housing in Agbor and nearby communities. Verified
              agents, real listings.
            </p>
            {/* Locations */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Boji-Boji",
                "Agbor-Obi",
                "Aliokpu",
                "Alihame",
                "Owa-Alero",
              ].map((loc) => (
                <span
                  key={loc}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Navigate
            </p>
            {navLinks.map((link) =>
              link.requiresAuth ? (
                <SignInButton key={link.name} mode="modal">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors w-full">
                    {link.name}
                  </button>
                </SignInButton>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors"
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* Become an agent CTA */}
          {!isAgentOrAdmin && (
            <div className="space-y-3 max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Are you an agent?
              </p>
              <p className="text-sm text-gray-500">
                List your properties and reach thousands of students looking for
                housing.
              </p>
              {isSignedIn ? (
                <Link href="/become-agent">
                  <Button
                    size="sm"
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white mt-1"
                  >
                    Get verified
                  </Button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white mt-1"
                  >
                    Get verified
                  </Button>
                </SignInButton>
              )}
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ruum. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="">
              <p>
                Built with <span className="text-red-400">♥</span> by{" "}
                <Link
                  href="https://github.com/Drew-space"
                  target="_blank"
                  className="underline underline-offset-2 hover:text-[#7c3aed] transition-colors"
                >
                  Drew
                </Link>
              </p>
            </div>
            <div className="">
              <p>
                Contact/supportus:{" "}
                <Link
                  className="underline"
                  href={"mailto:supportruum@gmail.com"}
                >
                  supportruum@gmail.com
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
