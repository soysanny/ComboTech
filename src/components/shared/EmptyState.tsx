import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Reusable empty state — explains why there is no data and offers an action. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-card/60 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center shadow-sm",
        className,
      )}
    >
      {icon ? (
        <div className="bg-muted text-muted-foreground mb-5 flex size-14 items-center justify-center rounded-full">
          {icon}
        </div>
      ) : null}
      <h3 className="text-foreground text-lg font-semibold tracking-tight">
        {title}
      </h3>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
