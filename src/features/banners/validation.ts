import { z } from "zod";
import { BANNER_TITLE_STYLE_LIMITS } from "./titleStyle";

const limits = BANNER_TITLE_STYLE_LIMITS;

export const bannerTitleStyleSchema = z.object({
  fontFamily: z.enum(["sans", "brand", "mono"]),
  fontSize: z.coerce
    .number()
    .min(limits.fontSize.min, "Desktop font size is too small")
    .max(limits.fontSize.max, "Desktop font size is too large"),
  mobileFontSize: z.coerce
    .number()
    .min(limits.mobileFontSize.min, "Mobile font size is too small")
    .max(limits.mobileFontSize.max, "Mobile font size is too large"),
  fontWeight: z.coerce.number().int().min(400).max(800),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color, e.g. #ffffff"),
  lineHeight: z.coerce
    .number()
    .min(limits.lineHeight.min)
    .max(limits.lineHeight.max),
  letterSpacing: z.coerce
    .number()
    .min(limits.letterSpacing.min)
    .max(limits.letterSpacing.max),
  textAlign: z.enum(["left", "center", "right"]),
  maxWidth: z.coerce
    .number()
    .min(limits.maxWidth.min, "Desktop width is too small")
    .max(limits.maxWidth.max),
  mobileMaxWidth: z.coerce
    .number()
    .min(limits.mobileMaxWidth.min, "Mobile width is too small")
    .max(limits.mobileMaxWidth.max),
  horizontalPosition: z.enum(["left", "center", "right"]),
  verticalPosition: z.enum(["top", "middle", "bottom"]),
  paddingX: z.coerce.number().min(limits.paddingX.min).max(limits.paddingX.max),
  paddingY: z.coerce.number().min(limits.paddingY.min).max(limits.paddingY.max),
  mobilePaddingX: z.coerce
    .number()
    .min(limits.mobilePaddingX.min)
    .max(limits.mobilePaddingX.max),
  mobilePaddingY: z.coerce
    .number()
    .min(limits.mobilePaddingY.min)
    .max(limits.mobilePaddingY.max),
  buttonGap: z.coerce
    .number()
    .min(limits.buttonGap.min)
    .max(limits.buttonGap.max),
  mobileButtonGap: z.coerce
    .number()
    .min(limits.mobileButtonGap.min)
    .max(limits.mobileButtonGap.max),
  maxLinesEnabled: z.boolean(),
  maxLines: z.coerce
    .number()
    .int()
    .min(limits.maxLines.min)
    .max(limits.maxLines.max),
});

export const bannerFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title is required")
    .max(240, "Title must be 240 characters or fewer"),
  imageUrl: z.string().min(1, "Image URL is required"),
  linkUrl: z.string().optional(),
  type: z.enum(["homepage", "promotion"]),
  order: z.coerce.number().int().nonnegative(),
  active: z.boolean(),
  titleStyle: bannerTitleStyleSchema,
});

export type BannerFormData = z.infer<typeof bannerFormSchema>;

export const bannerCreateSchema = bannerFormSchema.extend({
  titleStyle: bannerTitleStyleSchema.optional(),
});

export const bannerUpdateSchema = bannerFormSchema.partial().extend({
  draftTitle: z
    .string()
    .trim()
    .min(2, "Draft title is required")
    .max(240, "Draft title must be 240 characters or fewer")
    .nullable()
    .optional(),
  draftTitleStyle: bannerTitleStyleSchema.nullable().optional(),
});
