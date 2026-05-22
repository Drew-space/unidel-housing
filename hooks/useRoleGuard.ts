import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRoleGuard(requiredRole?: "agent" | "admin") {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (!currentUser) {
      router.replace("/");
      return;
    }
    if (requiredRole === "admin" && currentUser.role !== "admin") {
      router.replace("/");
      return;
    }
    if (
      !requiredRole &&
      currentUser.role !== "agent" &&
      currentUser.role !== "admin"
    )
      router.replace("/");
  }, [currentUser, router, requiredRole]);

  return currentUser;
}
