import { cn } from "@/lib/utils";

export type SkeletonProps = React.ComponentProps<"div">;

/** Shimmering skeleton block for loading states. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-md bg-gradient-to-r from-muted via-muted-foreground/15 to-muted bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
