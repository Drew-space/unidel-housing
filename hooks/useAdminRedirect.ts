"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Drop this in app/(main)/layout.tsx or page.tsx
 * Redirects admin users straight to /admin when they land on the main site
 */
export function useAdminRedirect() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser === undefined) return; // still loading
    if (currentUser?.role === "admin") {
      router.replace("/admin");
    }
  }, [currentUser, router]);
}
