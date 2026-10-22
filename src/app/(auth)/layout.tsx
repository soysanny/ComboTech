import type { ReactNode } from "react";
import Link from "next/link";
import { Computer } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ParticlesBg } from "@/components/ui/particles-bg";

/** Staff auth shell — centered card layout for the staff login page. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <ParticlesBg className="opacity-60" />
      </div>

      <Link
        href={ROUTES.home}
        className="group mb-8 inline-flex items-center gap-2.5"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(140deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] text-sm font-bold text-white shadow-md transition-all group-hover:scale-105">
          <Computer className="size-5" strokeWidth={2.5} />
        </span>
        <span className="font-brand text-lg font-semibold tracking-tight">
          CamboTech
        </span>
      </Link>

      <div className="w-full max-w-md animate-scale-in">
        {children}
      </div>

      <p className="text-muted-foreground mt-8 text-center text-xs">
        © {new Date().getFullYear()} CAMBOTECH. All rights reserved.
      </p>
    </div>
  );
}
