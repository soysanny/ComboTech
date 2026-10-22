import type { ComponentType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  trend?: { value: number; positive: boolean };
  className?: string;
}

/** Dashboard KPI card with optional icon and trend indicator. */
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-sm">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {trend ? (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trend.positive ? "+" : ""}
              {trend.value}% vs last month
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="bg-muted text-muted-foreground rounded-lg p-2.5">
            <Icon className="size-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
