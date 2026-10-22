"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/features/products/types";

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export interface CategoryFormProps {
  initialValue?: Category;
  onSubmit: (value: CategoryFormData) => void;
  loading?: boolean;
}

/** Admin category create/edit form. */
export function CategoryForm({ initialValue, onSubmit, loading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryFormData>,
    defaultValues: initialValue
      ? {
          name: initialValue.name,
          slug: initialValue.slug,
          description: initialValue.description,
          imageUrl: initialValue.imageUrl,
        }
      : {
          name: "",
          slug: "",
          description: "",
          imageUrl: "",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" {...register("imageUrl")} />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialValue ? "Update category" : "Create category"}
        </Button>
      </div>
    </form>
  );
}
