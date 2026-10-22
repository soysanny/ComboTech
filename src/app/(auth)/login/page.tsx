import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Access your account and continue where you left off.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
