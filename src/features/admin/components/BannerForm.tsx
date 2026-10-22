"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Banner } from "../types";

export interface BannerFormData {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  type: "homepage" | "promotion";
  order: number;
  active: boolean;
}

const bannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  linkUrl: z.string().optional(),
  type: z.enum(["homepage", "promotion"]),
  order: z.coerce.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export interface BannerFormProps {
  initialValue?: Banner;
  onSubmit: (value: BannerFormData) => void;
  loading?: boolean;
}

/** Admin banner create/edit form. */
export function BannerForm({ initialValue, onSubmit, loading }: BannerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema) as Resolver<BannerFormData>,
    defaultValues: initialValue
      ? {
          title: initialValue.title,
          imageUrl: initialValue.imageUrl,
          linkUrl: initialValue.linkUrl,
          type: initialValue.type,
          order: initialValue.order,
          active: initialValue.active,
        }
      : {
          title: "",
          imageUrl: "",
          linkUrl: "",
          type: "homepage",
          order: 1,
          active: true,
        },
  });

  const type = useWatch({ control, name: "type" });
  const active = useWatch({ control, name: "active" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && <p className="text-destructive text-xs">{errors.imageUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input id="linkUrl" {...register("linkUrl")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(value) => setValue("type", value as "homepage" | "promotion")}>
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
          {errors.order && <p className="text-destructive text-xs">{errors.order.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <Switch
          id="active"
          checked={active}
          onCheckedChange={(checked) => setValue("active", checked)}
        />
        <Label htmlFor="active" className="cursor-pointer">Active</Label>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialValue ? "Update banner" : "Create banner"}
        </Button>
      </div>
    </form>
  );
}
