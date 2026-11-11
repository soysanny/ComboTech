import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground focus-visible:border-primary/60 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 text-foreground placeholder:text-muted-foreground/80 h-10 w-full min-w-0 rounded-xl border border-[var(--surface-border)] bg-[var(--input-bg)] px-3 py-2 text-sm shadow-[0_12px_36px_-28px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:bg-[var(--input-bg-focus)] focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
