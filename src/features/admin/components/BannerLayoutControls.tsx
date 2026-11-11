"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type {
  BannerHorizontalPosition,
  BannerTitleStyle,
  BannerVerticalPosition,
} from "@/features/admin/types";
import { BANNER_TITLE_STYLE_LIMITS } from "@/features/banners/titleStyle";
import type { BannerFormData } from "@/features/banners/validation";
import { NumberField } from "./BannerFormFields";

export interface BannerLayoutControlsProps {
  style: BannerTitleStyle;
  register: UseFormRegister<BannerFormData>;
  errors: FieldErrors<BannerFormData>;
  onChange: (patch: Partial<BannerTitleStyle>) => void;
  disabled?: boolean;
}

const limits = BANNER_TITLE_STYLE_LIMITS;

export function BannerLayoutControls({
  style,
  register,
  errors,
  onChange,
  disabled,
}: BannerLayoutControlsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Title area &amp; spacing</h3>
        <p className="text-muted-foreground text-xs">
          The text area can sit left, centre, or right while its text keeps its
          own alignment. Desktop reserves space for arrows and pagination.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-max-width"
          label="Desktop text width"
          suffix="%"
          min={limits.maxWidth.min}
          max={limits.maxWidth.max}
          step={limits.maxWidth.step}
          error={errors.titleStyle?.maxWidth?.message}
          registration={register("titleStyle.maxWidth", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-mobile-max-width"
          label="Mobile text width"
          suffix="%"
          min={limits.mobileMaxWidth.min}
          max={limits.mobileMaxWidth.max}
          step={limits.mobileMaxWidth.step}
          error={errors.titleStyle?.mobileMaxWidth?.message}
          registration={register("titleStyle.mobileMaxWidth", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Horizontal position</Label>
          <Select
            value={style.horizontalPosition}
            onValueChange={(value) =>
              onChange({
                horizontalPosition: value as BannerHorizontalPosition,
              })
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

        <div className="space-y-2">
          <Label>Vertical position</Label>
          <Select
            value={style.verticalPosition}
            onValueChange={(value) =>
              onChange({
                verticalPosition: value as BannerVerticalPosition,
              })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="middle">Middle</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-padding-x"
          label="Desktop horizontal padding"
          suffix="px"
          min={limits.paddingX.min}
          max={limits.paddingX.max}
          step={limits.paddingX.step}
          error={errors.titleStyle?.paddingX?.message}
          registration={register("titleStyle.paddingX", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-padding-y"
          label="Desktop vertical padding"
          suffix="px"
          min={limits.paddingY.min}
          max={limits.paddingY.max}
          step={limits.paddingY.step}
          error={errors.titleStyle?.paddingY?.message}
          registration={register("titleStyle.paddingY", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-mobile-padding-x"
          label="Mobile horizontal padding"
          suffix="px"
          min={limits.mobilePaddingX.min}
          max={limits.mobilePaddingX.max}
          step={limits.mobilePaddingX.step}
          error={errors.titleStyle?.mobilePaddingX?.message}
          registration={register("titleStyle.mobilePaddingX", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-mobile-padding-y"
          label="Mobile vertical padding"
          suffix="px"
          min={limits.mobilePaddingY.min}
          max={limits.mobilePaddingY.max}
          step={limits.mobilePaddingY.step}
          error={errors.titleStyle?.mobilePaddingY?.message}
          registration={register("titleStyle.mobilePaddingY", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="title-style-button-gap"
          label="Desktop gap before Shop now"
          suffix="px"
          min={limits.buttonGap.min}
          max={limits.buttonGap.max}
          step={limits.buttonGap.step}
          error={errors.titleStyle?.buttonGap?.message}
          registration={register("titleStyle.buttonGap", {
            valueAsNumber: true,
          })}
        />
        <NumberField
          id="title-style-mobile-button-gap"
          label="Mobile gap before Shop now"
          suffix="px"
          min={limits.mobileButtonGap.min}
          max={limits.mobileButtonGap.max}
          step={limits.mobileButtonGap.step}
          error={errors.titleStyle?.mobileButtonGap?.message}
          registration={register("titleStyle.mobileButtonGap", {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className="surface-inset space-y-3 rounded-xl p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="title-style-max-lines" className="cursor-pointer">
              Limit maximum title lines
            </Label>
            <p className="text-muted-foreground mt-1 text-xs">
              Off by default so the complete title is shown.
            </p>
          </div>
          <Switch
            id="title-style-max-lines"
            checked={style.maxLinesEnabled}
            onCheckedChange={(checked) =>
              onChange({ maxLinesEnabled: checked })
            }
            disabled={disabled}
          />
        </div>
        {style.maxLinesEnabled && (
          <NumberField
            id="title-style-max-lines-count"
            label="Maximum lines"
            min={limits.maxLines.min}
            max={limits.maxLines.max}
            step={limits.maxLines.step}
            error={errors.titleStyle?.maxLines?.message}
            registration={register("titleStyle.maxLines", {
              valueAsNumber: true,
            })}
          />
        )}
      </div>
    </section>
  );
}
