import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/create-listing" className={buttonVariants()}>
          + Add listing
        </Link>
      </div>
    </div>
  );
}
