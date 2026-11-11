import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 text-foreground placeholder:text-muted-foreground/80 flex field-sizing-content min-h-16 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--input-bg)] px-3 py-2 text-base backdrop-blur-md transition-colors outline-none focus-visible:bg-[var(--input-bg-focus)] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
