"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Computer,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  MessageSquare,
  Ticket,
  ImageIcon,
  ScrollText,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminItems: SidebarItem[] = [
  { label: "Dashboard", href: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: "Products", href: ROUTES.adminProducts, icon: Package },
  { label: "Categories", href: ROUTES.adminCategories, icon: ShoppingBag },
  { label: "Orders", href: ROUTES.adminOrders, icon: ScrollText },
  { label: "Customers", href: ROUTES.adminCustomers, icon: Users },
  { label: "Messages", href: ROUTES.adminMessages, icon: MessageSquare },
  { label: "Payments", href: ROUTES.adminPayments, icon: CreditCard },
  { label: "Coupons", href: ROUTES.adminCoupons, icon: Ticket },
  { label: "Banners", href: ROUTES.adminBanners, icon: ImageIcon },
  { label: "Logs", href: ROUTES.adminLogs, icon: ScrollText },
];

function SidebarContent({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b px-4">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(140deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] text-sm font-bold text-white shadow-md">
            <Computer className="size-5" strokeWidth={2.5} />
          </span>
          <span className="font-heading text-base font-bold tracking-tight">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-auto px-3 py-4" aria-label="Sidebar">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            logout();
            router.push(ROUTES.home);
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="bg-sidebar text-sidebar-foreground border-border hidden w-64 shrink-0 flex-col border-r lg:flex">
        <SidebarContent items={adminItems} />
      </aside>

      {/* Mobile header */}
      <div className="bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b px-4 lg:hidden">
        <Link href={ROUTES.home} className="inline-flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(140deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] text-xs font-bold text-white">
            <Computer className="size-4" strokeWidth={2.5} />
          </span>
          <span className="font-heading text-sm font-bold">Admin</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Open sidebar">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <SidebarContent items={adminItems} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
