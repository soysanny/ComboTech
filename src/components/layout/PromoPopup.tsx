"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useBanners } from "@/features/banners";
import { isDisplayableImageUrl } from "@/features/homepage/lib/imageUrl";
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
  const [imageFailed, setImageFailed] = useState(false);
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

  const banner =
    data?.find((item) => isDisplayableImageUrl(item.imageUrl)) ?? data?.[0];
  const bannerHref =
    banner?.linkUrl && banner.linkUrl.startsWith("/")
      ? banner.linkUrl
      : ROUTES.products;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <div className="relative">
          {banner?.imageUrl && !imageFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="max-h-72 w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="bg-foreground text-background flex flex-col items-center gap-2 px-6 py-10 text-center">
              <Sparkles className="size-8 opacity-70" />
              <p className="text-2xl font-bold tracking-tight">
                CamboTech promotions
              </p>
              <p className="text-sm opacity-75">
                Browse our latest laptops, desktops, components and accessories.
              </p>
            </div>
          )}
        </div>

        <DialogHeader className="px-6 pb-2">
          <DialogTitle className="text-lg">
            {banner?.title ?? "CamboTech promotions"}
          </DialogTitle>
          <DialogDescription>
            {banner
              ? "See the latest offer on selected computers and gear."
              : "Browse our latest laptops, desktops, components and accessories."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-6 pb-6 sm:flex-row">
          <Button asChild className="flex-1">
            <Link
              href={bannerHref}
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
