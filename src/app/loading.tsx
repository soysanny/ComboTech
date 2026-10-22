import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-4"
    >
      <div className="relative">
        <Loader2
          className="text-primary size-10 animate-spin"
          aria-hidden
        />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium">
        Loading…
      </p>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
