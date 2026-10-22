import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  /** Constrain content to the site max width with responsive gutters. */
  contained?: boolean;
  /** Entrance animation for the page content. */
  animate?: boolean;
}

/** Consistent page padding / max-width wrapper used across portals. */
export function PageWrapper({
  children,
  className,
  contained = true,
  animate = true,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        "w-full px-4 py-6 sm:px-6 lg:px-8",
        contained && "mx-auto max-w-7xl",
        animate && "animate-fade-in",
        className,
      )}
    >
      {children}
    </div>
  );
}
