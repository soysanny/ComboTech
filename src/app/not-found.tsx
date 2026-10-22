import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="bg-muted inline-flex size-16 items-center justify-center rounded-full">
        <SearchX className="text-muted-foreground size-8" aria-hidden />
      </div>
      <p className="text-muted-foreground mt-8 text-xs font-bold tracking-[0.16em] uppercase">
        404 — Page not found
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        We couldn&apos;t find that page
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Let&apos;s get you back on track.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Back to home
        </Link>
      </Button>
    </main>
  );
}
