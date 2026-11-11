"use client";

import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { BannerTitleStyle } from "@/features/admin/types";
import { BANNER_TITLE_FONT_CSS, sanitizeBannerTitleStyle } from "../titleStyle";

const DESKTOP_ARROW_SAFE = 56;
const MOBILE_ARROW_SAFE = 16;
const INDICATOR_SAFE_BOTTOM = 52;

export interface BannerSlideContentProps {
  title: string;
  imageUrl: string;
  titleStyle?: BannerTitleStyle;
  /** Force a responsive mode for admin previews. Omit on the homepage. */
  mode?: "desktop" | "mobile";
  priority?: boolean;
  className?: string;
}

function justifyFor(position: BannerTitleStyle["horizontalPosition"]) {
  if (position === "center") return "center";
  if (position === "right") return "flex-end";
  return "flex-start";
}

function alignFor(position: BannerTitleStyle["verticalPosition"]) {
  if (position === "middle") return "center";
  if (position === "bottom") return "flex-end";
  return "flex-start";
}

function selfFor(align: BannerTitleStyle["textAlign"]) {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
}

/** Shared hero slide visuals so the homepage and admin preview always match. */
export function BannerSlideContent({
  title,
  imageUrl,
  titleStyle,
  mode,
  priority = false,
  className,
}: BannerSlideContentProps) {
  const viewportIsDesktop = useMediaQuery("(min-width: 768px)");
  const viewportIsSm = useMediaQuery("(min-width: 640px)");
  const isDesktop = mode ? mode === "desktop" : viewportIsDesktop;
  const ctaLarge = mode ? mode === "desktop" : viewportIsSm;
  const style = sanitizeBannerTitleStyle(titleStyle);

  const image = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title}
      className="absolute inset-0 h-full w-full object-cover"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
    />
  ) : (
    <span className="banner-gradient absolute inset-0" />
  );

  const gradient = (
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
  );

  if (!titleStyle) {
    return (
      <div className={cn("absolute inset-0", className)}>
        {image}
        {gradient}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 text-white sm:p-8 lg:p-10">
          <span className="line-clamp-2 max-w-xl text-lg font-bold tracking-tight drop-shadow-sm sm:text-2xl lg:text-3xl">
            {title}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm sm:text-sm">
            Shop now
            <ArrowRight className="size-3.5" />
          </span>
        </span>
      </div>
    );
  }

  const fontSize = isDesktop ? style.fontSize : style.mobileFontSize;
  const maxWidth = isDesktop ? style.maxWidth : style.mobileMaxWidth;
  const paddingX = isDesktop ? style.paddingX : style.mobilePaddingX;
  const paddingY = isDesktop ? style.paddingY : style.mobilePaddingY;
  const buttonGap = isDesktop ? style.buttonGap : style.mobileButtonGap;

  const safeX = isDesktop
    ? Math.max(paddingX, DESKTOP_ARROW_SAFE)
    : Math.max(paddingX, MOBILE_ARROW_SAFE);
  const safeTop = Math.max(paddingY, 16);
  const safeBottom =
    style.verticalPosition === "bottom"
      ? Math.max(paddingY, INDICATOR_SAFE_BOTTOM)
      : Math.max(paddingY, 16);

  const titleStyles: CSSProperties = {
    fontFamily: BANNER_TITLE_FONT_CSS[style.fontFamily],
    fontSize: `${fontSize}px`,
    fontWeight: style.fontWeight,
    color: style.color,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}em`,
    textAlign: style.textAlign,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
    ...(style.maxLinesEnabled
      ? {
          display: "-webkit-box",
          WebkitLineClamp: style.maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : { display: "block" }),
  };

  return (
    <div className={cn("absolute inset-0", className)}>
      {image}
      {gradient}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex"
        style={{
          paddingTop: `${safeTop}px`,
          paddingBottom: `${safeBottom}px`,
          paddingLeft: `${safeX}px`,
          paddingRight: `${safeX}px`,
          justifyContent: justifyFor(style.horizontalPosition),
          alignItems: alignFor(style.verticalPosition),
        }}
      >
        <div
          className="flex min-h-0 min-w-0 flex-col"
          style={{
            width: `${maxWidth}%`,
            maxWidth: "100%",
            gap: `${buttonGap}px`,
          }}
        >
          <span className="min-h-0 drop-shadow-sm" style={titleStyles}>
            {title}
          </span>
          <span
            className={cn(
              "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm",
              ctaLarge && "text-sm",
            )}
            style={{ alignSelf: selfFor(style.textAlign) }}
          >
            Shop now
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
