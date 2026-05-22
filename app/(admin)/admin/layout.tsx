"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserButton } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/admin-sidebar";
import { usePathname } from "next/navigation";
import { useRoleGuard } from "@/hooks/useRoleGuard";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/agents": "Agents",
  "/admin/kyc": "KYC Queue",
  "/admin/listings": "All Listings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin";

  const currentUser = useRoleGuard("admin");
  if (!currentUser) return null;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <div className="flex justify-between w-full items-center">
              <h1 className="text-sm font-medium">{title}</h1>
              <UserButton />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
