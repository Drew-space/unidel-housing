"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  const allUsers = useQuery(api.admin.getAllUsers);
  const allHouses = useQuery(api.admin.getAllListings);
  const pendingKyc = useQuery(api.kyc.getKycSubmissions, { status: "pending" });

  const setUserRole = useMutation(api.admin.setUserRole);
  const deleteUser = useMutation(api.admin.deleteUser);

  const agents = allUsers?.filter((u) => u.role === "agent") ?? [];
  const totalUsers = allUsers?.length ?? 0;
  const totalListings = allHouses?.length ?? 0;
  const totalAgents = agents.length;
  const totalPending = pendingKyc?.length ?? 0;

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
      toast.success("User removed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* ── Stat cards ── */}
      <div className="flex gap-3 overflow-x-auto py-1 md:grid md:grid-cols-4 md:overflow-visible">
        <div className="min-w-[130px] ring ring-[#7c3aed] rounded-xl bg-[#ede9fe] text-[#7c3aed] flex flex-col p-4 md:aspect-video shrink-0 md:shrink md:min-w-0">
          <h1 className="text-sm font-medium">Total listings</h1>
          <div className="flex flex-1 items-center justify-center py-4 md:py-0">
            <p className="text-4xl font-semibold">{totalListings}</p>
          </div>
        </div>
        <div className="min-w-[130px] rounded-xl bg-[#dbeafe] ring ring-blue-400 text-blue-600 flex flex-col p-4 md:aspect-video shrink-0 md:shrink md:min-w-0">
          <h1 className="text-sm font-medium">Total users</h1>
          <div className="flex flex-1 items-center justify-center py-4 md:py-0">
            <p className="text-4xl font-semibold">{totalUsers}</p>
          </div>
        </div>
        <div className="min-w-[130px] rounded-xl bg-[#dcfce7] ring ring-green-400 text-green-600 flex flex-col p-4 md:aspect-video shrink-0 md:shrink md:min-w-0">
          <h1 className="text-sm font-medium">Verified agents</h1>
          <div className="flex flex-1 items-center justify-center py-4 md:py-0">
            <p className="text-4xl font-semibold">{totalAgents}</p>
          </div>
        </div>
        <div className="min-w-[130px] rounded-xl bg-[#fef9c3] ring ring-yellow-400 text-yellow-600 flex flex-col p-4 md:aspect-video shrink-0 md:shrink md:min-w-0">
          <h1 className="text-sm font-medium">Pending KYC</h1>
          <div className="flex flex-1 items-center justify-center py-4 md:py-0">
            <p className="text-4xl font-semibold">{totalPending}</p>
          </div>
        </div>
      </div>

      {/* ── Agents list ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Agents</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            onClick={() => router.push("/admin/kyc")}
          >
            KYC queue
            {totalPending > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-semibold rounded-full px-1.5">
                {totalPending}
              </span>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {!agents.length && (
              <p className="text-sm text-muted-foreground text-center py-10">
                No agents yet.
              </p>
            )}
            {agents.map((agent) => (
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

                <Badge className="bg-[#ede9fe] text-[#7c3aed] border border-[#7c3aed]/30 rounded-full text-xs shrink-0">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
