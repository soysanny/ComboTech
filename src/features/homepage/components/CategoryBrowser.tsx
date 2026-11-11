"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { CATEGORY_NAV } from "@/constants/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CategoryLink,
  CategoryLinkList,
} from "@/components/layout/CategoryLinks";

/** Desktop category sidebar aligned with the homepage slideshow. */
export function CategorySidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "bg-card hidden flex-col rounded-xl border p-2 shadow-sm lg:flex",
        className,
      )}
      aria-label="Shop by category"
    >
      <div className="flex h-10 items-center gap-2 px-2 text-sm font-semibold">
        <LayoutGrid className="text-primary size-4" />
        Shop by category
      </div>

      <div className="grid flex-1 grid-cols-2 content-start gap-0.5">
        {CATEGORY_NAV.map((category) => (
          <CategoryLink key={category.slug} category={category} compact />
        ))}
      </div>

      <Link
        href={ROUTES.products}
        className="bg-primary/5 text-primary hover:bg-primary/10 mt-2 flex min-h-10 items-center justify-between rounded-lg px-3 text-xs font-semibold transition-colors"
      >
        All products
        <ArrowRight className="size-3.5" />
      </Link>
    </aside>
  );
}

/** Mobile/tablet alternative to the desktop category sidebar. */
export function MobileCategoryButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 w-full justify-between bg-card lg:hidden",
            className,
          )}
        >
          <span className="flex items-center gap-2 font-semibold">
            <LayoutGrid className="text-primary size-4" />
            Categories
          </span>
          <span className="text-muted-foreground text-xs">
            {CATEGORY_NAV.length} categories
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Shop by category</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <CategoryLinkList onNavigate={close} />
          <Link
            href={ROUTES.products}
            onClick={close}
            className="bg-primary/5 text-primary hover:bg-primary/10 mt-4 flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-semibold transition-colors"
          >
            All products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
