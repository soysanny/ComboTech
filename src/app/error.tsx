"use client";

import { useEffect } from "react";
import { TriangleAlert, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="bg-destructive/10 inline-flex size-16 items-center justify-center rounded-full">
        <TriangleAlert className="text-destructive size-8" aria-hidden />
      </div>
      <p className="text-muted-foreground mt-8 text-xs font-bold tracking-[0.16em] uppercase">
        500 — Server error
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
        An unexpected error occurred. You can try again, and if the problem
        persists please contact support.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="mr-2 size-4" />
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.assign("/")}>
          <Home className="mr-2 size-4" />
          Go home
        </Button>
      </div>
    </main>
  );
}
