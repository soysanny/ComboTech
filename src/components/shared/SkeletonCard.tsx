import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "./Skeleton";

export interface SkeletonCardProps {
  rows?: number;
}

/** Card-shaped skeleton for list/detail loading states. */
export function SkeletonCard({ rows = 3 }: SkeletonCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <Skeleton className="h-5 w-1/3" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
