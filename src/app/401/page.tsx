import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Unauthorized" };

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="bg-muted inline-flex size-16 items-center justify-center rounded-full">
        <Lock className="text-muted-foreground size-8" aria-hidden />
      </div>
      <p className="text-muted-foreground mt-8 text-xs font-bold tracking-[0.16em] uppercase">
        401 — Authentication required
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Please sign in
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-base leading-relaxed">
        You need to sign in to access this page. Use your CAMBOTECH account to
        continue.
      </p>
      <Button asChild className="mt-8">
        <Link href="/login">
          Sign in
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
    </main>
  );
}
