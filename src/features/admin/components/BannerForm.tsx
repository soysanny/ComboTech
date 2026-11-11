"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Banner, BannerTitleStyle } from "../types";
import {
  DEFAULT_BANNER_TITLE_STYLE,
  hasBannerDraft,
  resolveBannerTitle,
  resolveBannerTitleStyle,
  sanitizeBannerTitleStyle,
} from "@/features/banners/titleStyle";
import {
  bannerFormSchema,
  type BannerFormData,
} from "@/features/banners/validation";
import { BannerLayoutControls } from "./BannerLayoutControls";
import { BannerPreview } from "./BannerPreview";
import { BannerTitleStyleControls } from "./BannerTitleStyleControls";

export type { BannerFormData } from "@/features/banners/validation";

export interface BannerFormProps {
  initialValue?: Banner;
  onSubmit: (value: BannerFormData) => void;
  onSaveDraft?: (value: BannerFormData) => void;
  loading?: boolean;
}

/** Admin banner create/edit form with a live homepage preview. */
export function BannerForm({
  initialValue,
  onSubmit,
  onSaveDraft,
  loading,
}: BannerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema) as Resolver<BannerFormData>,
    defaultValues: initialValue
      ? {
          title: resolveBannerTitle(initialValue, true),
          imageUrl: initialValue.imageUrl,
          linkUrl: initialValue.linkUrl,
          type: initialValue.type,
          order: initialValue.order,
          active: initialValue.active,
          titleStyle: resolveBannerTitleStyle(initialValue, true),
        }
      : {
          title: "",
          imageUrl: "",
          linkUrl: "",
          type: "homepage",
          order: 1,
          active: true,
          titleStyle: { ...DEFAULT_BANNER_TITLE_STYLE },
        },
  });

  const watched = useWatch({ control });
  const type = (watched.type ?? "homepage") as "homepage" | "promotion";
  const active = watched.active ?? true;
  const previewTitle = watched.title ?? "";
  const previewImageUrl = watched.imageUrl ?? "";
  const titleStyle = (watched.titleStyle ??
    DEFAULT_BANNER_TITLE_STYLE) as BannerTitleStyle;
  const previewTitleStyle = sanitizeBannerTitleStyle(titleStyle);

  const updateStyle = (patch: Partial<BannerTitleStyle>) => {
    const current = (getValues("titleStyle") ??
      DEFAULT_BANNER_TITLE_STYLE) as BannerTitleStyle;
    setValue(
      "titleStyle",
      { ...current, ...patch },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const publish = handleSubmit((value) => onSubmit(value));
  const saveDraft = handleSubmit((value) => onSaveDraft?.(value));

  return (
    <form onSubmit={publish} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <section className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">Banner content</h3>
                {initialValue && hasBannerDraft(initialValue) && (
                  <Badge variant="secondary">Editing saved draft</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                These fields are shared by the homepage and promotion banners.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Textarea
                id="title"
                rows={4}
                maxLength={240}
                placeholder="Enter the banner title. Press Enter to add a line break."
                {...register("title")}
              />
              <p className="text-muted-foreground text-xs">
                Line breaks are preserved. The complete title is shown unless a
                line limit is enabled.
              </p>
              {errors.title && (
                <p className="text-destructive text-xs">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
              <p className="text-muted-foreground text-xs">
                Used for both desktop and mobile.
              </p>
              {errors.imageUrl && (
                <p className="text-destructive text-xs">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input id="linkUrl" {...register("linkUrl")} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setValue("type", value as "homepage" | "promotion")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display order</Label>
                <Input id="order" type="number" {...register("order")} />
                {errors.order && (
                  <p className="text-destructive text-xs">
                    {errors.order.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch
                id="active"
                checked={active}
                onCheckedChange={(checked) => setValue("active", checked)}
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </section>

          {type === "homepage" && (
            <>
              <BannerTitleStyleControls
                style={titleStyle}
                register={register}
                errors={errors}
                onChange={updateStyle}
                disabled={loading}
              />
              <BannerLayoutControls
                style={titleStyle}
                register={register}
                errors={errors}
                onChange={updateStyle}
                disabled={loading}
              />
            </>
          )}
        </div>

        <div className="order-first lg:sticky lg:top-0 lg:order-none lg:self-start">
          {type === "homepage" ? (
            <BannerPreview
              title={previewTitle}
              imageUrl={previewImageUrl}
              titleStyle={previewTitleStyle}
            />
          ) : (
            <div className="surface-inset text-muted-foreground rounded-2xl p-4 text-sm">
              Title styling controls are available for homepage banners. The
              promotion carousel keeps its current appearance.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-[var(--surface-border)] pt-4 sm:flex-row sm:items-center sm:justify-end">
        {initialValue && onSaveDraft && (
          <p className="text-muted-foreground text-xs sm:mr-auto sm:max-w-sm">
            Save draft keeps title changes private. Publish applies the title,
            styling, and other banner fields to the homepage.
          </p>
        )}
        {initialValue && onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            disabled={loading}
          >
            Save draft
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialValue
              ? "Publish changes"
              : "Create banner"}
        </Button>
      </div>
    </form>
  );
}
