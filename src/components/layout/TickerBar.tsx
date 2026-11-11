import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { SITE } from "@/constants/site";
import { ROUTES } from "@/constants/routes";

/** Slim static announcement bar — one short, useful message. */
export function TickerBar() {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-8 w-full max-w-[1440px] items-center justify-between gap-4 px-4 text-[11px] font-medium sm:px-6 lg:px-8">
        <p className="flex min-w-0 items-center gap-1.5 truncate">
          <MapPin className="size-3 shrink-0 opacity-70" />
          <span className="truncate">{SITE.tagline}</span>
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={ROUTES.contact}
            className="hidden text-background/80 transition-colors hover:text-background sm:inline"
          >
            Contact
          </Link>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-1.5 transition-colors hover:text-background/80"
          >
            <Phone className="size-3" />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
