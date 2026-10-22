import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionShellProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

/** Consistent section container used inside page wrappers. */
export function SectionShell({
  children,
  className,
  spacing = "md",
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "w-full",
        spacing === "sm" && "space-y-4",
        spacing === "md" && "space-y-6",
        spacing === "lg" && "space-y-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
