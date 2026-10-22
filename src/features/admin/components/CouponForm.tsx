"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Coupon } from "../types";

export interface CouponFormData {
  code: string;
  description?: string;
  discountType: "percentage" | "amount";
  discountValue: number;
  minSpend?: number;
  expiryDate: string;
  usageLimit: number;
  active: boolean;
}

const couponSchema = z.object({
  code: z.string().min(2, "Code is required"),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "amount"]),
  discountValue: z.coerce.number().nonnegative(),
  minSpend: z.coerce.number().nonnegative().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  usageLimit: z.coerce.number().int().positive(),
  active: z.boolean().default(true),
});

export interface CouponFormProps {
  initialValue?: Coupon;
  onSubmit: (value: CouponFormData) => void;
  loading?: boolean;
}

/** Admin coupon create/edit form. */
export function CouponForm({ initialValue, onSubmit, loading }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema) as Resolver<CouponFormData>,
    defaultValues: initialValue
      ? {
          code: initialValue.code,
          description: initialValue.description,
          discountType: initialValue.discountType,
          discountValue: initialValue.discountValue,
          minSpend: initialValue.minSpend,
          expiryDate: initialValue.expiryDate.slice(0, 16),
          usageLimit: initialValue.usageLimit,
          active: initialValue.active,
        }
      : {
          code: "",
          description: "",
          discountType: "percentage",
          discountValue: 10,
          minSpend: 0,
          expiryDate: "",
          usageLimit: 100,
          active: true,
        },
  });

  const discountType = useWatch({ control, name: "discountType" });
  const active = useWatch({ control, name: "active" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon code</Label>
          <Input id="code" {...register("code")} />
          {errors.code && <p className="text-destructive text-xs">{errors.code.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry date</Label>
          <Input id="expiryDate" type="datetime-local" {...register("expiryDate")} />
          {errors.expiryDate && <p className="text-destructive text-xs">{errors.expiryDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Discount type</Label>
          <Select
            value={discountType}
            onValueChange={(value) => setValue("discountType", value as "percentage" | "amount")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="amount">Fixed amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">Discount value</Label>
          <Input id="discountValue" type="number" step="0.01" {...register("discountValue")} />
          {errors.discountValue && <p className="text-destructive text-xs">{errors.discountValue.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minSpend">Minimum spend</Label>
          <Input id="minSpend" type="number" step="0.01" {...register("minSpend")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usageLimit">Usage limit</Label>
          <Input id="usageLimit" type="number" {...register("usageLimit")} />
          {errors.usageLimit && <p className="text-destructive text-xs">{errors.usageLimit.message}</p>}
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
          {loading ? "Saving..." : initialValue ? "Update coupon" : "Create coupon"}
        </Button>
      </div>
    </form>
  );
}
