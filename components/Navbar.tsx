"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogInIcon, Menu } from "lucide-react";
import { SignInButton, SignOutButton, UserButton, Show } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const navLink = [
    { name: "Home", hrefs: "/" },
    { name: "Listing", hrefs: "/listing" },
  ];

  return (
    <nav className="py-2 flex items-center justify-between mt-2 md:px-6 px-1 border-b ">
      {/* Logo and nav links */}
      <div className="flex items-center gap-6 ">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter capitalize">
            Hostel<span className="text-blue-500">Hub</span>
          </h1>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {navLink.map((link) => (
            <Link
              key={link.name}
              href={link.hrefs}
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* User auth buttons */}
      <div className="flex items-center gap-4">
        {/* Only visible when signed in */}
        <Show when="signed-in">
          <UserButton />
          <SignOutButton>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <LogInIcon className="h-4 w-4" />
              Logout
            </Button>
          </SignOutButton>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Menu />
            </SheetTrigger>
            <SheetContent className="w-84">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex flex-col gap-12 h-full pt-16">
                <nav className="flex flex-col items-start gap-5 text-zinc-950 pl-4 font-bold">
                  {navLink.map((links) => (
                    <a
                      href={links.hrefs}
                      key={links.name}
                      className="link-pirmary hover:text-accent-2"
                    >
                      {links.name}
                    </a>
                  ))}
                  <SignOutButton>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogInIcon className="h-4 w-4" />
                      Logout
                    </Button>
                  </SignOutButton>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </Show>

        {/* Only visible when signed out */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Login
            </Button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
