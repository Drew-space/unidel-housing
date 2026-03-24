"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlusIcon, MailIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}) {
  return (
    // <SidebarGroup>
    //   <SidebarGroupContent className="flex flex-col gap-2">
    //     <SidebarMenu>
    //       {items.map((item) => (
    //         <SidebarMenuItem key={item.title}>
    //           <SidebarMenuButton tooltip={item.title}>
    //             {item.icon}
    //             <span>{item.title}</span>
    //           </SidebarMenuButton>
    //         </SidebarMenuItem>
    //       ))}
    //     </SidebarMenu>
    //   </SidebarGroupContent>
    // </SidebarGroup>
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.href || "#"} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
