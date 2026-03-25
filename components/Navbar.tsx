"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogInIcon, Menu } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
  Show,
} from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  // Get user role
  const role = user?.publicMetadata?.role || "user"; // default to normal user
  const isAgentOrAdmin = role === "agent" || role === "admin";

  // const navLink = [
  //   { name: "Home", hrefs: "/" },
  //   {
  //     name: isAgentOrAdmin ? "Dashboard" : "Become an Agent",
  //     hrefs: isAgentOrAdmin ? "/dashboard" : "/become-agent",
  //   },
  //   { name: "Saved", hrefs: "/favourites" },
  // ];

  const navLink = [
    { name: "Home", hrefs: "/" },
    {
      name: isAgentOrAdmin ? "Dashboard" : "Become an Agent",
      hrefs: isAgentOrAdmin ? "/dashboard" : isSignedIn ? "/become-agent" : "#", // 👈 important
      requiresAuth: !isSignedIn && !isAgentOrAdmin,
    },
    { name: "Saved", hrefs: "/favourites" },
  ];

  return (
    <nav
      className="py-2 px-4 fixed top-0 w-full z-50 flex items-center justify-between md:px-6 
bg-white/10 backdrop-blur-md border-b border-white/20"
    >
      {/* Logo and nav links */}
      <div className="flex items-center gap-6">
        <Link href="/">
          <h1 className="text-2xl font-sans font-extrabold md:text-3xl tracking-tighter">
            RU<span className="text-[#7c3aed]">UM</span>
          </h1>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {/* {navLink.map((link) => (
            <Link
              key={link.name}
              href={link.hrefs}
              className="text-sm font-medium hover:text-[#7c3aed] transition-colors"
            >
              {link.name}
            </Link>
          ))} */}

          {navLink.map((link) =>
            link.requiresAuth ? (
              <SignInButton key={link.name} mode="modal">
                <span className="text-md     font-medium hover:text-[#7c3aed]   cursor-pointer">
                  {link.name}
                </span>
              </SignInButton>
            ) : (
              <Link
                key={link.name}
                href={link.hrefs}
                className="text-sm font-medium hover:text-[#7c3aed] transition-colors"
              >
                {link.name}
              </Link>
            ),
          )}
        </div>
      </div>

      {/* User auth buttons */}
      <div className="flex items-center gap-4">
        <Show when="signed-in">
          <UserButton />
          <SignOutButton>
            <Button
              variant="outline"
              size="sm"
              className="hidden text-white bg-[#7c3aed] sm:flex items-center gap-2"
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
                    <Link
                      key={links.name}
                      href={links.hrefs}
                      className="link-primary text-md hover:text-accent-2"
                    >
                      {links.name}
                    </Link>
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

        <Show when="signed-out">
          <>
            {/* Mobile: Become an Agent */}
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="flex lg:hidden  hover:bg-[#7c3aed] hover:text-white items-center text-white bg-[#7c3aed] gap-2"
              >
                Become an Agent
              </Button>
            </SignInButton>

            {/* Desktop: Login */}
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className="hidden bg-[#7c3aed] hover:bg-[#7c3aed]  hover:text-white text-white lg:flex items-center gap-2"
              >
                Login
              </Button>
            </SignInButton>
          </>
        </Show>

        {/* <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center text-white bg-[#7c3aed] gap-2"
            >
              Become an Agent
            </Button>
          </SignInButton>
        </Show> */}
      </div>
    </nav>
  );
};

export default Navbar;
