"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BannerSlideContent } from "@/features/banners/components/BannerSlideContent";
import type { BannerTitleStyle } from "@/features/admin/types";

export interface BannerPreviewProps {
  title: string;
  imageUrl: string;
  titleStyle: BannerTitleStyle;
}

export function BannerPreview({
  title,
  imageUrl,
  titleStyle,
}: BannerPreviewProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Live preview</h3>
          <p className="text-muted-foreground text-xs">
            Uses the same rendering as the homepage.
          </p>
        </div>
        <div className="surface-inset flex items-center rounded-lg p-0.5">
          <Button
            type="button"
            size="xs"
            variant={mode === "desktop" ? "secondary" : "ghost"}
            onClick={() => setMode("desktop")}
            aria-pressed={mode === "desktop"}
          >
            <Monitor className="size-3.5" />
            Desktop
          </Button>
          <Button
            type="button"
            size="xs"
            variant={mode === "mobile" ? "secondary" : "ghost"}
            onClick={() => setMode("mobile")}
            aria-pressed={mode === "mobile"}
          >
            <Smartphone className="size-3.5" />
            Mobile
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "relative mx-auto w-full overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-slate-950 shadow-sm",
          mode === "desktop" ? "aspect-[16/6]" : "aspect-[4/3] max-w-[320px]",
        )}
      >
        <BannerSlideContent
          title={title || "Banner title"}
          imageUrl={imageUrl}
          titleStyle={titleStyle}
          mode={mode}
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Desktop and mobile values are saved separately. The homepage applies
        them automatically.
      </p>
    </div>
  );
}
