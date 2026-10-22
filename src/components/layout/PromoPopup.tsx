"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useBanners } from "@/features/banners";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "cambotech-promo-dismissed";

/**
 * Storefront promotional popup (CC Computer style). Appears once per browser
 * session unless the visitor dismisses it. Uses the first active promotion
 * banner, falling back to a built-in offer when none is configured.
 */
export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const { data } = useBanners("promotion");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  const banner = data?.[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <div className="relative">
          {banner?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="max-h-72 w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 bg-[linear-gradient(135deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] px-6 py-10 text-center text-white">
              <Sparkles className="size-10" />
              <p className="text-3xl font-extrabold tracking-tight">
                Save up to 30%
              </p>
              <p className="text-sm text-white/85">
                Special launch deals on laptops, desktops, and accessories.
              </p>
            </div>
          )}
        </div>

        <DialogHeader className="px-6 pb-2">
          <DialogTitle className="text-lg">
            {banner?.title ?? "Special promotion"}
          </DialogTitle>
          <DialogDescription>
            Limited-time offers on selected computers and gear. Grab them before
            they are gone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-6 pb-6 sm:flex-row">
          <Button asChild className="flex-1">
            <Link
              href={banner?.linkUrl ?? ROUTES.products}
              onClick={() => handleOpenChange(false)}
            >
              Shop the deals
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
