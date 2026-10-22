import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Forbidden" };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="bg-destructive/10 inline-flex size-16 items-center justify-center rounded-full">
        <ShieldX className="text-destructive size-8" aria-hidden />
      </div>
      <p className="text-muted-foreground mt-8 text-xs font-bold tracking-[0.16em] uppercase">
        403 — Access denied
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        You don&apos;t have permission
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
        Your account doesn&apos;t have the required role to view this page.
        Contact support if you think this is a mistake.
      </p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Back to home
        </Link>
      </Button>
    </main>
  );
}
