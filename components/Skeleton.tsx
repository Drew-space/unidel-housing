"use client";

import { Skeleton } from "@/components/ui/skeleton";

const HouseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl overflow-hidden">
      {/* Image */}
      <Skeleton className="lg:h-56 h-36 sm:h-48 w-full" />

      {/* Content */}
      <div className="p-2 sm:p-4 space-y-2">
        {/* Room + Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-2" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Title */}
        <Skeleton className="h-4 w-3/4" />

        {/* Price + action */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default HouseCardSkeleton;
