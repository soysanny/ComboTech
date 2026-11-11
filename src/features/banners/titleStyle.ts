import type {
  Banner,
  BannerTitleFont,
  BannerTitleStyle,
} from "@/features/admin/types";

export const BANNER_TITLE_FONT_OPTIONS: {
  value: BannerTitleFont;
  label: string;
  css: string;
}[] = [
  {
    value: "sans",
    label: "Sans (Geist)",
    css: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "brand",
    label: "Brand (Sora)",
    css: "var(--font-sora), ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: "mono",
    label: "Mono (Geist Mono)",
    css: "var(--font-geist-mono), ui-monospace, monospace",
  },
];

export const BANNER_TITLE_FONT_CSS: Record<BannerTitleFont, string> =
  Object.fromEntries(
    BANNER_TITLE_FONT_OPTIONS.map((font) => [font.value, font.css]),
  ) as Record<BannerTitleFont, string>;

export const BANNER_TITLE_WEIGHT_OPTIONS = [
  { value: 400, label: "Regular (400)" },
  { value: 500, label: "Medium (500)" },
  { value: 600, label: "Semibold (600)" },
  { value: 700, label: "Bold (700)" },
  { value: 800, label: "Extra bold (800)" },
];

export const BANNER_TITLE_STYLE_LIMITS = {
  fontSize: { min: 12, max: 72, step: 1 },
  mobileFontSize: { min: 12, max: 48, step: 1 },
  lineHeight: { min: 1, max: 2, step: 0.05 },
  letterSpacing: { min: -0.05, max: 0.2, step: 0.005 },
  maxWidth: { min: 20, max: 100, step: 1 },
  mobileMaxWidth: { min: 20, max: 100, step: 1 },
  paddingX: { min: 16, max: 120, step: 1 },
  paddingY: { min: 16, max: 120, step: 1 },
  mobilePaddingX: { min: 12, max: 64, step: 1 },
  mobilePaddingY: { min: 12, max: 64, step: 1 },
  buttonGap: { min: 4, max: 64, step: 1 },
  mobileButtonGap: { min: 4, max: 48, step: 1 },
  maxLines: { min: 1, max: 6, step: 1 },
} as const;

/**
 * Defaults mirror the original homepage hero as closely as possible while
 * reserving safe space for the carousel arrows and pagination indicators.
 */
export const DEFAULT_BANNER_TITLE_STYLE: BannerTitleStyle = {
  fontFamily: "sans",
  fontSize: 30,
  mobileFontSize: 18,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.25,
  letterSpacing: -0.025,
  textAlign: "left",
  maxWidth: 48,
  mobileMaxWidth: 100,
  horizontalPosition: "left",
  verticalPosition: "bottom",
  paddingX: 56,
  paddingY: 40,
  mobilePaddingX: 20,
  mobilePaddingY: 24,
  buttonGap: 12,
  mobileButtonGap: 12,
  maxLinesEnabled: false,
  maxLines: 2,
};

const NUMERIC_TITLE_STYLE_KEYS = [
  "fontSize",
  "mobileFontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "maxWidth",
  "mobileMaxWidth",
  "paddingX",
  "paddingY",
  "mobilePaddingX",
  "mobilePaddingY",
  "buttonGap",
  "mobileButtonGap",
  "maxLines",
] as const;

/** Merge stored values with defaults and replace invalid/missing values. */
export function sanitizeBannerTitleStyle(
  style?: Partial<BannerTitleStyle> | null,
): BannerTitleStyle {
  const sanitized: BannerTitleStyle = {
    ...DEFAULT_BANNER_TITLE_STYLE,
    ...(style ?? {}),
  };

  for (const key of NUMERIC_TITLE_STYLE_KEYS) {
    if (!Number.isFinite(sanitized[key])) {
      sanitized[key] = DEFAULT_BANNER_TITLE_STYLE[key];
    }
  }

  if (!(sanitized.fontFamily in BANNER_TITLE_FONT_CSS)) {
    sanitized.fontFamily = DEFAULT_BANNER_TITLE_STYLE.fontFamily;
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(sanitized.color)) {
    sanitized.color = DEFAULT_BANNER_TITLE_STYLE.color;
  }
  if (!["left", "center", "right"].includes(sanitized.textAlign)) {
    sanitized.textAlign = DEFAULT_BANNER_TITLE_STYLE.textAlign;
  }
  if (!["left", "center", "right"].includes(sanitized.horizontalPosition)) {
    sanitized.horizontalPosition =
      DEFAULT_BANNER_TITLE_STYLE.horizontalPosition;
  }
  if (!["top", "middle", "bottom"].includes(sanitized.verticalPosition)) {
    sanitized.verticalPosition = DEFAULT_BANNER_TITLE_STYLE.verticalPosition;
  }
  if (typeof sanitized.maxLinesEnabled !== "boolean") {
    sanitized.maxLinesEnabled = DEFAULT_BANNER_TITLE_STYLE.maxLinesEnabled;
  }

  return sanitized;
}

/** Merge a stored (possibly partial or missing) style with safe defaults. */
export function resolveBannerTitleStyle(
  banner?: Pick<Banner, "titleStyle" | "draftTitleStyle"> | null,
  draft = false,
): BannerTitleStyle {
  const source = draft
    ? (banner?.draftTitleStyle ?? banner?.titleStyle)
    : banner?.titleStyle;

  return sanitizeBannerTitleStyle(source);
}

/** Resolve the title shown in the editor (draft wins) or on the homepage. */
export function resolveBannerTitle(
  banner?: Pick<Banner, "title" | "draftTitle"> | null,
  draft = false,
): string {
  if (!banner) return "";
  return draft ? (banner.draftTitle ?? banner.title) : banner.title;
}

export function hasBannerDraft(
  banner: Pick<Banner, "draftTitle" | "draftTitleStyle">,
): boolean {
  return banner.draftTitle != null || banner.draftTitleStyle != null;
}
