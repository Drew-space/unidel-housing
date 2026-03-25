"use client";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Show, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Footer = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;

  // Get user role
  const role = user?.publicMetadata?.role || "user"; // default to normal user
  const isAgentOrAdmin = role === "agent" || role === "admin";

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
    <footer className="mx-auto container py-10  ">
      <div className="flex flex-col md:flex-row mx-auto justify-between items-center gap-6">
        <h1 className="text-2xl font-sans font-extrabold md:text-3xl tracking-tighter">
          RU<span className="text-[#7c3aed]">UM</span>
        </h1>

        <div className="flex items-center  gap-4">
          {navLink.map((link) =>
            link.requiresAuth ? (
              <SignInButton key={link.name} mode="modal">
                <Button className="text-md bg-[#7c3aed]  hover:bg-[#7c3aed]  font-medium hover:text-white cursor-pointer">
                  {link.name}
                </Button>
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
      <Separator className="w-full mt-4" />
      <div className="">
        <p className="text-center py-4">
          &copy; Copy {new Date().getFullYear()} made by{" "}
          <Link
            href={"https://github.com/Drew-space"}
            className="underline font-semibold"
          >
            Drew
          </Link>
          ❤️ AllRights reserved{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

/* <div className="">
          <img
            src="/whatsapp.svg"
            alt="Chat on WhatsApp"
            className="h-7 w-7 rounded-full"
          />
        </div>*/
