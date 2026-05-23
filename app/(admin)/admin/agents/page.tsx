"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search } from "lucide-react";

export default function AdminAgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const agents = useQuery(api.admin.getAgents);
  const setUserRole = useMutation(api.admin.setUserRole);
  const deleteUser = useMutation(api.admin.deleteUser);

  const filtered =
    agents?.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.username.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  async function handleSetRole(
    userId: Id<"users">,
    role: "user" | "agent" | "admin",
  ) {
    try {
      await setUserRole({ userId, role });
      toast.success(`Role updated to ${role}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function handleDelete(userId: Id<"users">) {
    try {
      await deleteUser({ userId });
      toast.success("Agent removed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-medium">
              All Agents ({filtered.length})
            </CardTitle>
            <div className="relative max-w-xs w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
            {!agents ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                Loading...
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                {search ? "No agents match your search." : "No agents yet."}
              </p>
            ) : (
              filtered.map((agent) => (
                <div
                  key={agent._id}
                  className="flex items-center gap-3 border rounded-md p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/admin/agents/${agent._id}`)}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={agent.imageUrl} />
                    <AvatarFallback>{agent.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {agent.email}
                    </p>
                  </div>

                  <Badge className="bg-[#ede9fe] text-[#7c3aed] border border-[#7c3aed]/30 rounded-full text-xs shrink-0 hidden sm:flex">
                    Verified agent
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/agents/${agent._id}`);
                    }}
                  >
                    View
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                      >
                        <EllipsisVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetRole(agent._id, "user");
                        }}
                      >
                        Demote to user
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(agent._id);
                        }}
                      >
                        Remove agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
