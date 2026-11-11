import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TickerBar } from "@/components/layout/TickerBar";
import { FloatingContactButtons } from "@/components/layout/FloatingContactButtons";
import { BackToTop } from "@/components/layout/BackToTop";

/** Storefront shell — ticker + header + main content + footer + floating UI. */
export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TickerBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContactButtons />
      <BackToTop />
    </div>
  );
}
