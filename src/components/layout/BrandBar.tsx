import Link from "next/link";
import { BRAND_NAV, brandNavHref } from "@/constants/site";
import { cn } from "@/lib/utils";

/** Horizontal brand shortcut bar (shown below the homepage hero banner). */
export function BrandBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border/60 bg-card w-full overflow-hidden rounded-2xl border shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-6 overflow-x-auto px-6 py-3">
        <span className="text-muted-foreground shrink-0 text-xs font-bold tracking-wide uppercase">
          Brands:
        </span>
        {BRAND_NAV.map((brand) => (
          <Link
            key={brand.label}
            href={brandNavHref(brand)}
            className="text-muted-foreground hover:text-foreground shrink-0 text-sm font-semibold tracking-wide uppercase transition-colors"
          >
            {brand.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
