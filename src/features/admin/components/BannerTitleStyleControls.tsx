"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BannerTextAlign,
  BannerTitleFont,
  BannerTitleStyle,
} from "@/features/admin/types";
import {
  BANNER_TITLE_FONT_OPTIONS,
  BANNER_TITLE_STYLE_LIMITS,
  BANNER_TITLE_WEIGHT_OPTIONS,
  DEFAULT_BANNER_TITLE_STYLE,
} from "@/features/banners/titleStyle";
import type { BannerFormData } from "@/features/banners/validation";
import { FieldError, NumberField } from "./BannerFormFields";

export interface BannerTitleStyleControlsProps {
  style: BannerTitleStyle;
  register: UseFormRegister<BannerFormData>;
  errors: FieldErrors<BannerFormData>;
  onChange: (patch: Partial<BannerTitleStyle>) => void;
  disabled?: boolean;
}

const limits = BANNER_TITLE_STYLE_LIMITS;

export function BannerTitleStyleControls({
  style,
  register,
  errors,
  onChange,
  disabled,
}: BannerTitleStyleControlsProps) {
  const colorIsValid = /^#[0-9a-fA-F]{6}$/.test(style.color);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Title typography</h3>
          <p className="text-muted-foreground text-xs">
            Typography is independent from where the text area sits.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange({ ...DEFAULT_BANNER_TITLE_STYLE })}
        >
          Reset to Default
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Font family</Label>
          <Select
            value={style.fontFamily}
            onValueChange={(value) =>
              onChange({ fontFamily: value as BannerTitleFont })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BANNER_TITLE_FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font weight</Label>
          <Select
            value={String(style.fontWeight)}
            onValueChange={(value) => onChange({ fontWeight: Number(value) })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BANNER_TITLE_WEIGHT_OPTIONS.map((weight) => (
                <SelectItem key={weight.value} value={String(weight.value)}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-font-size"
          label="Desktop font size"
          suffix="px"
          min={limits.fontSize.min}
          max={limits.fontSize.max}
          step={limits.fontSize.step}
          error={errors.titleStyle?.fontSize?.message}
          registration={register("titleStyle.fontSize", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-mobile-font-size"
          label="Mobile font size"
          suffix="px"
          min={limits.mobileFontSize.min}
          max={limits.mobileFontSize.max}
          step={limits.mobileFontSize.step}
          error={errors.titleStyle?.mobileFontSize?.message}
          registration={register("titleStyle.mobileFontSize", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-line-height"
          label="Line height"
          min={limits.lineHeight.min}
          max={limits.lineHeight.max}
          step={limits.lineHeight.step}
          error={errors.titleStyle?.lineHeight?.message}
          registration={register("titleStyle.lineHeight", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-letter-spacing"
          label="Letter spacing"
          suffix="em"
          min={limits.letterSpacing.min}
          max={limits.letterSpacing.max}
          step={limits.letterSpacing.step}
          error={errors.titleStyle?.letterSpacing?.message}
          registration={register("titleStyle.letterSpacing", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title-style-color">Text color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="title-style-color-picker"
            type="color"
            aria-label="Pick text color"
            value={colorIsValid ? style.color : "#ffffff"}
            onChange={(event) => onChange({ color: event.target.value })}
            className="h-10 w-14 cursor-pointer p-1"
            disabled={disabled}
          />
          <Input
            id="title-style-color"
            value={style.color}
            onChange={(event) => onChange({ color: event.target.value })}
            className="font-mono uppercase"
            maxLength={7}
            disabled={disabled}
          />
        </div>
        <FieldError message={errors.titleStyle?.color?.message} />
      </div>

      <div className="space-y-2">
        <Label>Text alignment</Label>
        <Select
          value={style.textAlign}
          onValueChange={(value) =>
            onChange({ textAlign: value as BannerTextAlign })
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
